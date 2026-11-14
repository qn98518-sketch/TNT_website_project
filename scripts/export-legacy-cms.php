<?php
declare(strict_types=1);
// Called only by the migration CLI. Output stays in process memory, never in logs.
require_once dirname(__DIR__) . '/backend/src/bootstrap.php';
db()->exec('SET TRANSACTION READ ONLY');
db()->beginTransaction();
try {
    $data = [
        'users' => queryRows('SELECT * FROM cms_users ORDER BY id'),
        'leads' => queryRows('SELECT * FROM cms_leads ORDER BY id'),
        'audit' => queryRows('SELECT * FROM cms_audit_log ORDER BY id'),
    ];
    db()->commit();
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    if (db()->inTransaction()) db()->rollBack();
    fwrite(STDERR, 'Không thể đọc database MySQL cũ. Dữ liệu nguồn được giữ nguyên.');
    exit(1);
}
