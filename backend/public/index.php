<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/src/bootstrap.php';
try {
    $secret = env('CMS_SHARED_SECRET');
    if (strlen($secret) < 32) throw new RuntimeException('CMS_SHARED_SECRET must have at least 32 characters');
    if (!hash_equals($secret, $_SERVER['HTTP_X_CMS_KEY'] ?? '')) throw new ApiError('FORBIDDEN', 'Không được phép truy cập.', 403);
    $method = $_SERVER['REQUEST_METHOD']; $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if ($path === '/api/intake' && $method === 'POST') {
        throttle('intake:' . clientKey(), 10, 600);
        $data = validateLead(jsonBody());
        $id = $_SERVER['HTTP_X_SUBMISSION_ID'] ?? '';
        if ($id !== '' && !preg_match('/^[0-9a-f-]{36}$/iD', $id)) throw new ApiError('VALIDATION_FAILED', 'Mã gửi không hợp lệ.', 422);
        createLead($data, null, $id !== '' ? hash('sha256', $id) : null);
        respond(['accepted'=>true], 202);
    }
    startCmsSession();
    if ($path === '/api/session' && $method === 'GET') {
        $user = currentUser(); respond(['user'=>$user ? safeUser($user) : null, 'csrfToken'=>$_SESSION['csrf']]);
    }
    if ($path === '/api/login' && $method === 'POST') login(jsonBody());
    $user = requireUser();
    if ($method !== 'GET') csrf();
    if ($path === '/api/logout' && $method === 'POST') {
        $errors=[]; unknownFields(jsonBody(), [], $errors); checkFields($errors);
        audit((int)$user['id'], 'logout', 'user', (int)$user['id']); resetSession(); respond(['user'=>null,'csrfToken'=>$_SESSION['csrf']]);
    }
    if ($path === '/api/password' && $method === 'POST') changePassword($user, jsonBody());
    if ($path === '/api/leads') {
        if ($method === 'GET') listLeads();
        if ($method === 'POST') { $user=requireUser(false,true); $created=createLead(validateLead(jsonBody(), true), $user); respond(['lead'=>safeLead(row('SELECT * FROM cms_leads WHERE id=?', [$created['id']]))], 201); }
    }
    if (preg_match('~^/api/leads/([1-9][0-9]{0,9})$~D', $path, $m)) {
        $id=(int)$m[1];
        if ($method === 'GET') { $lead=row('SELECT * FROM cms_leads WHERE id=?', [$id]); if (!$lead) throw new ApiError('NOT_FOUND','Không tìm thấy yêu cầu.',404); respond(['lead'=>safeLead($lead)]); }
        $user=requireUser(false,true);
        if ($method === 'PATCH') updateLead($id, validateLead(jsonBody(), true, true), $user);
        if ($method === 'DELETE') deleteLead($id, jsonBody(), $user);
    }
    if ($path === '/api/users' || preg_match('~^/api/users/([1-9][0-9]{0,9})$~D', $path, $m)) {
        $user=requireUser(true);
        if ($path === '/api/users') {
            if ($method === 'GET') respond(['items'=>array_map('safeUser', queryRows('SELECT * FROM cms_users ORDER BY id'))]);
            if ($method === 'POST') createUser(validateUser(jsonBody()), $user);
        } else {
            $id=(int)$m[1];
            if ($method === 'GET') { $target=row('SELECT * FROM cms_users WHERE id=?', [$id]); if (!$target) throw new ApiError('NOT_FOUND','Không tìm thấy tài khoản.',404); respond(['user'=>safeUser($target)]); }
            if ($method === 'PATCH') updateUser($id, jsonBody(), $user);
            if ($method === 'DELETE') deleteUser($id, jsonBody(), $user);
        }
    }
    throw new ApiError('NOT_FOUND', 'Không tìm thấy chức năng.', 404);
} catch (ApiError $e) {
    respond(['error'=>['code'=>$e->errorCode,'message'=>$e->getMessage(),'fields'=>(object)$e->fields]], $e->status);
} catch (Throwable $e) {
    // No request bodies, passwords, connection strings or SQL in responses/logs.
    $reference=bin2hex(random_bytes(6)); error_log('TNT CMS [' . $reference . '] ' . get_class($e) . ' code=' . $e->getCode());
    respond(['error'=>['code'=>'INTERNAL_ERROR','message'=>'Không thể xử lý yêu cầu lúc này.','reference'=>$reference]], 500);
}
