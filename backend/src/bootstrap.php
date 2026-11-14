<?php
declare(strict_types=1);

// A tiny dotenv loader: process environment takes precedence; never expose this file.
$envFile = dirname(__DIR__) . '/.env';
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (!preg_match('/^([A-Z][A-Z0-9_]*)=(.*)$/', $line, $match)) continue;
        if (getenv($match[1]) === false) {
            $value = trim($match[2]);
            if (strlen($value) >= 2 && (($value[0] === '"' && str_ends_with($value, '"')) || ($value[0] === "'" && str_ends_with($value, "'")))) $value = substr($value, 1, -1);
            putenv($match[1] . '=' . $value);
        }
    }
}
date_default_timezone_set('UTC');
ini_set('display_errors', '0');
ini_set('log_errors', '1');
function env(string $key, string $default = ''): string { $value = getenv($key); return $value === false ? $default : $value; }
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $database = env('DB_DATABASE');
    if (!preg_match('/^[A-Za-z0-9_]+$/', $database)) throw new RuntimeException('DB_DATABASE is required and must be an identifier');
    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false];
    if (env('DB_SSL_CA') !== '') { $options[PDO::MYSQL_ATTR_SSL_CA] = env('DB_SSL_CA'); $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = true; }
    $pdo = new PDO('mysql:host=' . env('DB_HOST', '127.0.0.1') . ';port=' . (int)env('DB_PORT', '3306') . ';dbname=' . $database . ';charset=utf8mb4', env('DB_USERNAME'), env('DB_PASSWORD'), $options);
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
}
require_once __DIR__ . '/http.php';
require_once __DIR__ . '/validation.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/leads.php';
require_once __DIR__ . '/users.php';
