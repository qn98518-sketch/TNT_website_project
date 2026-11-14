<?php
declare(strict_types=1);
final class ApiError extends RuntimeException {
    public function __construct(public string $errorCode, string $message, public int $status = 400, public array $fields = []) { parent::__construct($message); }
}
function respond(array $payload, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: private, no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex, nofollow');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}
function jsonBody(): stdClass {
    if (!preg_match('~^application/json(?:\s*;|$)~i', $_SERVER['CONTENT_TYPE'] ?? '')) throw new ApiError('UNSUPPORTED_MEDIA_TYPE', 'Yêu cầu phải dùng application/json.', 415);
    $stream = fopen('php://input', 'rb'); $body = stream_get_contents($stream, 32769); fclose($stream);
    if (strlen($body) > 32768) throw new ApiError('PAYLOAD_TOO_LARGE', 'Dữ liệu tối đa 32 KB.', 413);
    try { $input = json_decode($body, false, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException) { throw new ApiError('INVALID_JSON', 'Dữ liệu JSON không hợp lệ.', 400); }
    if (!$input instanceof stdClass) throw new ApiError('VALIDATION_FAILED', 'Dữ liệu phải là một đối tượng JSON.', 422);
    return $input;
}
function checkFields(array $errors): void { if ($errors) throw new ApiError('VALIDATION_FAILED', 'Vui lòng kiểm tra lại thông tin.', 422, $errors); }
function unknownFields(stdClass $input, array $allowed, array &$errors): void {
    foreach (array_keys(get_object_vars($input)) as $key) if (!in_array($key, $allowed, true)) $errors['form'] = 'Dữ liệu có trường không được hỗ trợ.';
}
function textField(stdClass $input, string $key, int $max, array &$errors, bool $required = false): string {
    if (!property_exists($input, $key) && !$required) return '';
    if (!isset($input->$key) || !is_string($input->$key)) { $errors[$key] = 'Trường này phải là chuỗi ký tự.'; return ''; }
    $text = trim($input->$key);
    if (($required && $text === '') || mb_strlen($text, 'UTF-8') > $max || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', $text)) $errors[$key] = "Vui lòng nhập thông tin hợp lệ (tối đa $max ký tự).";
    return $text;
}
function queryRows(string $sql, array $params = []): array { $stmt = db()->prepare($sql); $stmt->execute($params); return $stmt->fetchAll(); }
function row(string $sql, array $params = []): ?array { return queryRows($sql, $params)[0] ?? null; }
function execute(string $sql, array $params = []): int { $stmt = db()->prepare($sql); $stmt->execute($params); return $stmt->rowCount(); }
function transaction(callable $action): mixed {
    db()->beginTransaction();
    try { $result = $action(); db()->commit(); return $result; }
    catch (Throwable $e) { if (db()->inTransaction()) db()->rollBack(); throw $e; }
}
function audit(?int $actor, string $action, string $type, ?int $id, array $metadata = []): void {
    execute('INSERT INTO cms_audit_log (actor_id, action, entity_type, entity_id, metadata) VALUES (?,?,?,?,?)', [$actor, $action, $type, $id, json_encode((object)$metadata, JSON_THROW_ON_ERROR)]);
}
function clientKey(): string {
    $key = $_SERVER['HTTP_X_CLIENT_KEY'] ?? '';
    if (!preg_match('/^[a-f0-9]{64}$/D', $key)) throw new ApiError('INVALID_CLIENT', 'Nguồn yêu cầu không hợp lệ.', 400);
    return $key;
}
function throttle(string $scope, int $limit, int $seconds): void {
    $bucket = hash_hmac('sha256', $scope . ':' . intdiv(time(), $seconds), env('CMS_SHARED_SECRET'));
    execute('INSERT INTO cms_rate_limits (bucket,hits,expires_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1', [$bucket, gmdate('Y-m-d H:i:s', (intdiv(time(), $seconds) + 1) * $seconds)]);
    $hits = (int)row('SELECT hits FROM cms_rate_limits WHERE bucket=?', [$bucket])['hits'];
    if (random_int(1, 100) === 1) execute('DELETE FROM cms_rate_limits WHERE expires_at < UTC_TIMESTAMP()');
    if ($hits > $limit) { header('Retry-After: ' . ($seconds - time() % $seconds)); throw new ApiError('RATE_LIMITED', 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.', 429); }
}
function positiveInt(mixed $value, string $key): int {
    if (!is_int($value) || $value < 1 || $value > 2147483647) throw new ApiError('VALIDATION_FAILED', 'Phiên bản dữ liệu không hợp lệ.', 422, [$key => 'Giá trị phải là số nguyên dương.']);
    return $value;
}
