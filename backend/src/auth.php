<?php
declare(strict_types=1);
function startCmsSession(): void {
    $publicUrl = env('CMS_PUBLIC_URL');
    $scheme = parse_url($publicUrl, PHP_URL_SCHEME);
    $host = parse_url($publicUrl, PHP_URL_HOST);
    if ($scheme !== 'https' && !($scheme === 'http' && in_array($host, ['localhost','127.0.0.1','::1'], true) && env('APP_ENV') === 'local')) throw new RuntimeException('CMS_PUBLIC_URL requires HTTPS (HTTP localhost is local-only)');
    $path = env('CMS_SESSION_PATH', dirname(__DIR__) . '/storage/sessions');
    if ($path === '') $path = dirname(__DIR__) . '/storage/sessions';
    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) throw new RuntimeException('Session storage is not writable');
    ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1'); ini_set('session.use_trans_sid', '0');
    ini_set('session.gc_maxlifetime', '28800'); session_save_path($path); session_name('tnt_cms');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/api/cms','secure'=>$scheme === 'https','httponly'=>true,'samesite'=>'Strict']);
    if (!session_start()) throw new RuntimeException('Session storage is unavailable');
    if (isset($_SESSION['user_id']) && (time() - (int)($_SESSION['last_seen'] ?? 0) > 1800 || time() - (int)($_SESSION['created'] ?? 0) > 28800)) resetSession();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}
function resetSession(): void { $_SESSION = []; session_regenerate_id(true); $_SESSION['csrf'] = bin2hex(random_bytes(32)); }
function safeUser(array $user): array { return ['id'=>(int)$user['id'], 'username'=>$user['username'], 'displayName'=>$user['display_name'], 'email'=>$user['email'], 'role'=>$user['role'], 'active'=>(bool)$user['active'], 'version'=>(int)$user['version'], 'createdAt'=>str_replace(' ', 'T', $user['created_at']) . 'Z']; }
function currentUser(): ?array {
    if (!isset($_SESSION['user_id'])) return null;
    $user = row('SELECT * FROM cms_users WHERE id=?', [$_SESSION['user_id']]);
    if (!$user || !$user['active'] || (int)$user['auth_version'] !== (int)($_SESSION['auth_version'] ?? 0)) { resetSession(); return null; }
    $_SESSION['last_seen'] = time(); return $user;
}
function requireUser(bool $admin = false, bool $write = false): array {
    $user = currentUser();
    if (!$user) throw new ApiError('UNAUTHENTICATED', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
    if (($admin && $user['role'] !== 'admin') || ($write && $user['role'] === 'viewer')) throw new ApiError('FORBIDDEN', 'Tài khoản không có quyền thực hiện thao tác này.', 403);
    return $user;
}
function csrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token)) throw new ApiError('CSRF_REJECTED', 'Phiên bảo vệ biểu mẫu không hợp lệ. Vui lòng tải lại trang.', 403);
}
function login(stdClass $input): never {
    csrf(); $errors = []; unknownFields($input, ['username','password'], $errors);
    $username = textField($input, 'username', 50, $errors, true);
    if (!preg_match('/^[a-z0-9][a-z0-9._-]{2,49}$/D', $username)) $errors['username'] = 'Tên đăng nhập không hợp lệ.';
    if (!is_string($input->password ?? null) || strlen($input->password) < 1 || strlen($input->password) > 72 || str_contains($input->password, "\0")) $errors['password'] = 'Vui lòng nhập mật khẩu (tối đa 72 byte).';
    checkFields($errors);
    throttle('login-ip:' . clientKey(), 20, 900); throttle('login-user:' . hash('sha256', $username), 5, 900);
    $user = row('SELECT * FROM cms_users WHERE username=?', [$username]);
    $valid = password_verify($input->password, $user['password_hash'] ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');
    if (!$valid || !$user || !$user['active']) throw new ApiError('INVALID_CREDENTIALS', 'Tên đăng nhập hoặc mật khẩu không đúng.', 401);
    transaction(function () use ($user, $input) {
        if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) execute('UPDATE cms_users SET password_hash=? WHERE id=?', [password_hash($input->password, PASSWORD_DEFAULT), $user['id']]);
        audit((int)$user['id'], 'login', 'user', (int)$user['id']);
    });
    resetSession(); $_SESSION['user_id'] = (int)$user['id']; $_SESSION['auth_version'] = (int)$user['auth_version']; $_SESSION['created'] = time(); $_SESSION['last_seen'] = time();
    respond(['user'=>safeUser($user),'csrfToken'=>$_SESSION['csrf']]);
}
function changePassword(array $user, stdClass $input): never {
    $errors = []; unknownFields($input, ['currentPassword','newPassword','confirmPassword'], $errors);
    if (!is_string($input->currentPassword ?? null) || strlen($input->currentPassword) > 72 || str_contains($input->currentPassword, "\0")) $errors['currentPassword'] = 'Mật khẩu hiện tại không hợp lệ.';
    $password = validatePassword($input->newPassword ?? null, 'newPassword', $errors);
    if (($input->confirmPassword ?? null) !== $password) $errors['confirmPassword'] = 'Mật khẩu xác nhận không khớp.';
    if ($password !== '' && $password === ($input->currentPassword ?? null)) $errors['newPassword'] = 'Mật khẩu mới phải khác mật khẩu hiện tại.';
    checkFields($errors); throttle('password:' . $user['id'] . ':' . clientKey(), 5, 900);
    transaction(function () use ($user, $input, $password) {
        $locked = row('SELECT * FROM cms_users WHERE id=? FOR UPDATE', [$user['id']]);
        if (!$locked || !$locked['active'] || (int)$locked['auth_version'] !== (int)$user['auth_version']) throw new ApiError('UNAUTHENTICATED', 'Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại.', 401);
        if (!password_verify($input->currentPassword, $locked['password_hash'])) throw new ApiError('VALIDATION_FAILED', 'Mật khẩu hiện tại không đúng.', 422, ['currentPassword'=>'Mật khẩu hiện tại không đúng.']);
        execute('UPDATE cms_users SET password_hash=?, auth_version=auth_version+1, version=version+1, updated_at=UTC_TIMESTAMP() WHERE id=?', [password_hash($password, PASSWORD_DEFAULT), $user['id']]);
        audit((int)$user['id'], 'change_password', 'user', (int)$user['id']);
    });
    session_regenerate_id(true); $_SESSION['auth_version'] = (int)$user['auth_version'] + 1; $_SESSION['csrf'] = bin2hex(random_bytes(32));
    respond(['user'=>safeUser(row('SELECT * FROM cms_users WHERE id=?', [$user['id']])), 'csrfToken'=>$_SESSION['csrf']]);
}
