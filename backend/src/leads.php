<?php
declare(strict_types=1);
function safeLead(array $lead): array {
    return ['id'=>(int)$lead['id'],'name'=>$lead['name'],'emailOrPhone'=>$lead['email_or_phone'],'company'=>$lead['company'], 'interest'=>$lead['interest'],'industry'=>$lead['industry'],'companySize'=>$lead['company_size'],'message'=>$lead['message'],'consent'=>(bool)$lead['consent'],'context'=>$lead['context'],'source'=>$lead['source'],'details'=>json_decode($lead['details'], false, 32, JSON_THROW_ON_ERROR),'status'=>$lead['status'],'notes'=>$lead['notes'],'version'=>(int)$lead['version'],'createdAt'=>str_replace(' ', 'T', $lead['created_at']) . 'Z','updatedAt'=>str_replace(' ', 'T', $lead['updated_at']) . 'Z'];
}
function leadValues(array $data): array { return [$data['name'],$data['emailOrPhone'],$data['company'],$data['interest'],$data['industry'],$data['companySize'],$data['message'],1,$data['context'],$data['source'],json_encode($data['details'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)]; }
function createLead(array $data, ?array $actor = null, ?string $key = null): array {
    $hash = hash('sha256', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
    return transaction(function () use ($data, $actor, $key, $hash) {
        if ($key) {
            $existing = row('SELECT * FROM cms_leads WHERE submission_key=?', [$key]);
            if ($existing) {
                if (!hash_equals($existing['payload_hash'], $hash)) throw new ApiError('IDEMPOTENCY_CONFLICT', 'Mã gửi đã được dùng cho một nội dung khác.', 409);
                return ['id'=>(int)$existing['id'], 'duplicate'=>true];
            }
        }
        try {
            execute('INSERT INTO cms_leads (name,email_or_phone,company,interest,industry,company_size,message,consent,context,source,details,status,notes,created_by,updated_by,submission_key,payload_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', array_merge(leadValues($data), [$data['status'] ?? 'new',$data['notes'] ?? '',$actor['id'] ?? null,$actor['id'] ?? null,$key,$key ? $hash : null]));
        } catch (PDOException $e) {
            if ($key && ($e->errorInfo[1] ?? 0) === 1062) {
                $existing = row('SELECT * FROM cms_leads WHERE submission_key=? FOR UPDATE', [$key]);
                if ($existing && hash_equals($existing['payload_hash'], $hash)) return ['id'=>(int)$existing['id'],'duplicate'=>true];
                throw new ApiError('IDEMPOTENCY_CONFLICT', 'Mã gửi đã được dùng cho một nội dung khác.', 409);
            }
            throw $e;
        }
        $id = (int)db()->lastInsertId(); audit(isset($actor['id']) ? (int)$actor['id'] : null, 'create', 'lead', $id, ['channel'=>$actor ? 'cms' : 'website']);
        return ['id'=>$id,'duplicate'=>false];
    });
}
function listLeads(): never {
    $errors = []; $allowed = ['q','context','status','page','perPage','from','to'];
    foreach ($_GET as $key=>$value) if (!in_array($key, $allowed, true) || !is_string($value)) $errors['filters'] = 'Bộ lọc không hợp lệ.';
    checkFields($errors);
    $q = trim($_GET['q'] ?? ''); $context = $_GET['context'] ?? ''; $status = $_GET['status'] ?? '';
    if (mb_strlen($q) > 160) $errors['q'] = 'Từ khóa tối đa 160 ký tự.';
    if ($context !== '' && !in_array($context, CONTEXTS, true)) $errors['context'] = 'Ngữ cảnh không hợp lệ.';
    if ($status !== '' && !in_array($status, STATUSES, true)) $errors['status'] = 'Trạng thái không hợp lệ.';
    foreach (['page'=>1000000,'perPage'=>100] as $key=>$max) if (isset($_GET[$key]) && (!ctype_digit($_GET[$key]) || (int)$_GET[$key] < 1 || (int)$_GET[$key] > $max)) $errors[$key] = 'Phân trang không hợp lệ.';
    foreach (['from','to'] as $key) if (($_GET[$key] ?? '') !== '') {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $_GET[$key]);
        if (!$date || $date->format('Y-m-d') !== $_GET[$key]) $errors[$key] = 'Ngày phải đúng định dạng YYYY-MM-DD.';
    }
    if (!isset($errors['from'], $errors['to']) && ($_GET['from'] ?? '') !== '' && ($_GET['to'] ?? '') !== '' && $_GET['from'] > $_GET['to']) $errors['from'] = 'Ngày bắt đầu phải trước ngày kết thúc.';
    checkFields($errors);
    $where = []; $params = [];
    if ($q !== '') { $where[] = '(name LIKE ? OR company LIKE ? OR email_or_phone LIKE ?)'; $term = '%' . strtr($q, ['\\'=>'\\\\','%'=>'\\%','_'=>'\\_']) . '%'; array_push($params, $term, $term, $term); }
    if ($context !== '') { $where[] = 'context=?'; $params[] = $context; }
    if ($status !== '') { $where[] = 'status=?'; $params[] = $status; }
    if (($_GET['from'] ?? '') !== '') { $where[] = 'created_at>=?'; $params[] = $_GET['from'] . ' 00:00:00'; }
    if (($_GET['to'] ?? '') !== '') { $where[] = 'created_at<?'; $params[] = (new DateTimeImmutable($_GET['to']))->modify('+1 day')->format('Y-m-d') . ' 00:00:00'; }
    $clause = $where ? ' WHERE ' . implode(' AND ', $where) : '';
    $page = (int)($_GET['page'] ?? 1); $perPage = (int)($_GET['perPage'] ?? 15); $offset = ($page - 1) * $perPage;
    $total = (int)row('SELECT COUNT(*) AS n FROM cms_leads' . $clause, $params)['n'];
    $items = array_map('safeLead', queryRows('SELECT * FROM cms_leads' . $clause . " ORDER BY created_at DESC,id DESC LIMIT $perPage OFFSET $offset", $params));
    $stats = queryRows('SELECT status,COUNT(*) AS total FROM cms_leads GROUP BY status');
    respond(['items'=>$items,'total'=>$total,'page'=>$page,'perPage'=>$perPage,'stats'=>array_column($stats, 'total', 'status')]);
}
function updateLead(int $id, array $data, array $actor): never {
    transaction(function () use ($id, $data, $actor) {
        $lead = row('SELECT id,version FROM cms_leads WHERE id=? FOR UPDATE', [$id]);
        if (!$lead) throw new ApiError('NOT_FOUND', 'Không tìm thấy yêu cầu.', 404);
        if ((int)$lead['version'] !== $data['version']) throw new ApiError('VERSION_CONFLICT', 'Yêu cầu đã được người khác cập nhật. Vui lòng đóng và mở lại để tải bản mới.', 409);
        execute('UPDATE cms_leads SET name=?,email_or_phone=?,company=?,interest=?,industry=?,company_size=?,message=?,consent=?,context=?,source=?,details=?,status=?,notes=?,updated_by=?,version=version+1,updated_at=UTC_TIMESTAMP() WHERE id=?', array_merge(leadValues($data), [$data['status'],$data['notes'],$actor['id'],$id]));
        audit((int)$actor['id'], 'update', 'lead', $id);
    });
    respond(['lead'=>safeLead(row('SELECT * FROM cms_leads WHERE id=?', [$id]))]);
}
function deleteLead(int $id, stdClass $input, array $actor): never {
    $errors = []; unknownFields($input, ['version'], $errors); checkFields($errors); $version = positiveInt($input->version ?? null, 'version');
    transaction(function () use ($id, $version, $actor) {
        $lead = row('SELECT version FROM cms_leads WHERE id=? FOR UPDATE', [$id]);
        if (!$lead) throw new ApiError('NOT_FOUND', 'Không tìm thấy yêu cầu.', 404);
        if ((int)$lead['version'] !== $version) throw new ApiError('VERSION_CONFLICT', 'Yêu cầu đã thay đổi. Vui lòng tải lại trước khi xóa.', 409);
        execute('DELETE FROM cms_leads WHERE id=?', [$id]); audit((int)$actor['id'], 'delete', 'lead', $id);
    }); respond(['deleted'=>true]);
}
