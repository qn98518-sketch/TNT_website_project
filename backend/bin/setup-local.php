<?php
declare(strict_types=1);
// Local CLI only: provision a dedicated database/user, never reset an existing database.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
try {
    if (getenv('APP_ENV') !== 'local' || getenv('DB_DATABASE') !== 'tnt_cms_local' || getenv('DB_HOST') !== '127.0.0.1' || getenv('DB_PORT') !== '3307') throw new RuntimeException('This command only provisions the isolated local TNT database');
    $username = getenv('DB_USERNAME'); $password = getenv('DB_PASSWORD');
    if (!is_string($username) || !preg_match('/^tnt_cms_dev_[a-f0-9]{8}$/D', $username) || !is_string($password) || !preg_match('/^[a-f0-9]{48}$/D', $password)) throw new RuntimeException('Invalid local runtime credentials');
    $pdo = new PDO('mysql:host=127.0.0.1;port=3307;charset=utf8mb4', getenv('CMS_LOCAL_MYSQL_USERNAME') ?: 'root', getenv('CMS_LOCAL_MYSQL_PASSWORD') ?: '', [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $pdo->exec('CREATE DATABASE IF NOT EXISTS tnt_cms_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $account = $pdo->quote($username) . "@'127.0.0.1'";
    $pdo->exec('CREATE USER IF NOT EXISTS ' . $account . ' IDENTIFIED BY ' . $pdo->quote($password));
    $pdo->exec('GRANT ALL PRIVILEGES ON tnt_cms_local.* TO ' . $account);
    echo "Local database and dedicated user are ready. Existing databases were preserved.\n";
} catch (Throwable $e) {
    // Do not print credentials, connection strings, or generated SQL.
    fwrite(STDERR, "Local MySQL setup failed. Check XAMPP MySQL and the local root credentials.\n");
    exit(1);
}
