<?php
declare(strict_types=1);
function userConflict(PDOException $e): never {
    if (($e->errorInfo[1] ?? 0) === 1062) throw new ApiError('DUPLICATE_USER', 'Tên đăng nhập hoặc email đã được sử dụng.', 409, ['username'=>'Kiểm tra tên đăng nhập và email bị trùng.','email'=>'Kiểm tra tên đăng nhập và email bị trùng.']);
    throw $e;
}
function createUser(array $data, array $actor): never {
    try {
        $id = transaction(function () use ($data, $actor) {
            execute('INSERT INTO cms_users (username,display_name,email,password_hash,role,active) VALUES (?,?,?,?,?,?)', [$data['username'],$data['displayName'],$data['email'],password_hash($data['password'], PASSWORD_DEFAULT),$data['role'],(int)$data['active']]);
            $id = (int)db()->lastInsertId(); audit((int)$actor['id'], 'create', 'user', $id, ['role'=>$data['role']]); return $id;
        });
    } catch (PDOException $e) { userConflict($e); }
    respond(['user'=>safeUser(row('SELECT * FROM cms_users WHERE id=?', [$id]))], 201);
}
function updateUser(int $id, stdClass $input, array $actor): never {
    try {
        transaction(function () use ($id, $input, $actor) {
            $target = row('SELECT * FROM cms_users WHERE id=? FOR UPDATE', [$id]);
            if (!$target) throw new ApiError('NOT_FOUND', 'Không tìm thấy tài khoản.', 404);
            if ($target['role'] === 'admin') throw new ApiError('FIXED_ADMIN', 'Tài khoản admin cố hữu không thể đổi định danh hoặc quyền. Hãy dùng mục Đổi mật khẩu.', 403);
            $data = validateUser($input, true);
            if ((int)$target['version'] !== $data['version']) throw new ApiError('VERSION_CONFLICT', 'Tài khoản đã được cập nhật. Vui lòng tải lại.', 409);
            $params = [$data['username'],$data['displayName'],$data['email'],$data['role'],(int)$data['active']]; $passwordSql = '';
            if ($data['password'] !== '') { $passwordSql = ', password_hash=?'; $params[] = password_hash($data['password'], PASSWORD_DEFAULT); }
            $params[] = $id;
            execute('UPDATE cms_users SET username=?,display_name=?,email=?,role=?,active=?,auth_version=auth_version+1,version=version+1,updated_at=UTC_TIMESTAMP()' . $passwordSql . ' WHERE id=?', $params);
            audit((int)$actor['id'], 'update', 'user', $id, ['role'=>$data['role'],'active'=>$data['active'],'passwordReset'=>$data['password'] !== '']);
        });
    } catch (PDOException $e) { userConflict($e); }
    respond(['user'=>safeUser(row('SELECT * FROM cms_users WHERE id=?', [$id]))]);
}
function deleteUser(int $id, stdClass $input, array $actor): never {
    $errors = []; unknownFields($input, ['version'], $errors); checkFields($errors); $version = positiveInt($input->version ?? null, 'version');
    if ($id === (int)$actor['id']) throw new ApiError('SELF_DELETE_FORBIDDEN', 'Bạn không thể tự xóa tài khoản của mình.', 403);
    transaction(function () use ($id, $version, $actor) {
        $target = row('SELECT * FROM cms_users WHERE id=? FOR UPDATE', [$id]);
        if (!$target) throw new ApiError('NOT_FOUND', 'Không tìm thấy tài khoản.', 404);
        if ($target['role'] === 'admin') throw new ApiError('FIXED_ADMIN', 'Không thể xóa admin cố hữu.', 403);
        if ((int)$target['version'] !== $version) throw new ApiError('VERSION_CONFLICT', 'Tài khoản đã thay đổi. Vui lòng tải lại.', 409);
        execute('DELETE FROM cms_users WHERE id=?', [$id]); audit((int)$actor['id'], 'delete', 'user', $id);
    }); respond(['deleted'=>true]);
}
