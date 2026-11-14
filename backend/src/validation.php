<?php
declare(strict_types=1);
const CONTEXTS = ['general','food-processing','erp','outsourcing','body-shop'];
const STATUSES = ['new','contacted','in_progress','closed','spam'];
const DETAIL_OPTIONS = [
    'erpNeed' => ['Đánh giá mức độ phù hợp','Kết nối dữ liệu','Làm rõ phạm vi mở rộng','Khác'],
    'projectType' => ['Phần mềm mới','Mở rộng hệ thống hiện có','Tích hợp hệ thống','Khác'],
    'estimatedTiming' => ['Đang tìm hiểu','Trong 1–3 tháng','Sau 3 tháng','Chưa xác định'],
    'role' => ['Developer','QA / Tester','Business Analyst','Khác'],
    'headcount' => ['1','2–3','4–5','Chưa xác định'],
    'foodPriority' => ['Nguyên vật liệu và tồn kho','Tiến độ sản xuất','Hao hụt và chi phí','Chất lượng và truy xuất lô','Chưa xác định'],
];
const CONTEXT_DETAILS = ['general'=>[], 'food-processing'=>['foodPriority'], 'erp'=>['erpNeed'], 'outsourcing'=>['projectType','estimatedTiming'], 'body-shop'=>['role','headcount']];
function interests(string $context): array {
    return match ($context) {
        'food-processing' => DETAIL_OPTIONS['foodPriority'], 'erp' => ['TNM ERP'], 'outsourcing' => ['Phát triển phần mềm'], 'body-shop' => ['Nhân lực công nghệ'],
        default => ['TNM ERP','Phát triển phần mềm','Nhân lực công nghệ','Khác'],
    };
}
function validateLead(stdClass $input, bool $managed = false, bool $updating = false): array {
    $errors = [];
    $allowed = ['name','emailOrPhone','company','interest','industry','companySize','message','consent','context','source','details'];
    if ($managed) $allowed = array_merge($allowed, ['status','notes'], $updating ? ['version'] : []);
    unknownFields($input, $allowed, $errors);
    $data = [];
    foreach (['name'=>120,'emailOrPhone'=>254,'company'=>160,'interest'=>160,'industry'=>160,'companySize'=>80,'message'=>4000,'source'=>300] as $key=>$max) $data[$key] = textField($input, $key, $max, $errors, in_array($key, ['name','emailOrPhone','company','interest','source'], true));
    $contact = $data['emailOrPhone'];
    $emailOk = preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/u', $contact);
    $phoneOk = preg_match('/^\+?[\d\s().-]+$/u', $contact) && preg_match('/^\d{7,15}$/D', preg_replace('/\D/', '', $contact));
    if (!$emailOk && !$phoneOk) $errors['emailOrPhone'] = 'Vui lòng nhập email hoặc số điện thoại hợp lệ (7–15 chữ số).';
    $data['context'] = textField($input, 'context', 30, $errors, true);
    if (!in_array($data['context'], CONTEXTS, true)) $errors['context'] = 'Ngữ cảnh gửi yêu cầu không hợp lệ.';
    elseif (!in_array($data['interest'], interests($data['context']), true)) $errors['interest'] = 'Vui lòng chọn một lĩnh vực hợp lệ.';
    if ($data['companySize'] !== '' && !in_array($data['companySize'], ['1-50','51-200','201-500','500+'], true)) $errors['companySize'] = 'Quy mô công ty không hợp lệ.';
    if (!preg_match('~^/(?!/)[^\s?\x23\\\\]*$~uD', $data['source'])) $errors['source'] = 'Nguồn yêu cầu phải là đường dẫn nội bộ hợp lệ.';
    if (($input->consent ?? null) !== true) $errors['consent'] = 'Vui lòng xác nhận đồng ý để TNT liên hệ.';
    $data['consent'] = true;
    $data['details'] = new stdClass();
    if (property_exists($input, 'details') && !$input->details instanceof stdClass) $errors['details'] = 'Thông tin chi tiết phải là đối tượng JSON.';
    else foreach (get_object_vars($input->details ?? new stdClass()) as $key=>$detail) {
        if (!in_array($key, CONTEXT_DETAILS[$data['context']] ?? [], true) || !is_string($detail) || !in_array(trim($detail), DETAIL_OPTIONS[$key] ?? [], true)) $errors['details'] = 'Thông tin chi tiết không thuộc lựa chọn được hỗ trợ.';
        else $data['details']->$key = trim($detail);
    }
    if ($managed) {
        $data['status'] = textField($input, 'status', 20, $errors, true);
        if (!in_array($data['status'], STATUSES, true)) $errors['status'] = 'Trạng thái không hợp lệ.';
        $data['notes'] = textField($input, 'notes', 4000, $errors);
        if ($updating) $data['version'] = positiveInt($input->version ?? null, 'version');
    }
    checkFields($errors); return $data;
}
function validatePassword(mixed $value, string $key, array &$errors): string {
    if (!is_string($value) || strlen($value) < 12 || strlen($value) > 72 || str_contains($value, "\0") || !preg_match('/\p{L}/u', $value) || !preg_match('/\p{N}/u', $value)) {
        $errors[$key] = 'Mật khẩu cần 12–72 byte, có chữ và số, không chứa ký tự null.'; return '';
    }
    return $value;
}
function validateUser(stdClass $input, bool $updating = false): array {
    $errors = []; unknownFields($input, array_merge(['username','displayName','email','role','active','password'], $updating ? ['version'] : []), $errors);
    $username = textField($input, 'username', 50, $errors, true);
    if (!preg_match('/^[a-z0-9][a-z0-9._-]{2,49}$/D', $username)) $errors['username'] = 'Tên đăng nhập gồm 3–50 ký tự thường, số, dấu chấm, gạch dưới hoặc gạch ngang.';
    $displayName = textField($input, 'displayName', 120, $errors, true);
    $email = textField($input, 'email', 254, $errors, true);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email không hợp lệ.';
    $role = textField($input, 'role', 10, $errors, true);
    if (!in_array($role, ['editor','viewer'], true)) $errors['role'] = 'Chỉ có thể tạo nhân viên xử lý hoặc người xem.';
    if (!is_bool($input->active ?? null)) $errors['active'] = 'Trạng thái phải là true hoặc false.';
    $password = '';
    if (!$updating || property_exists($input, 'password')) $password = validatePassword($input->password ?? null, 'password', $errors);
    $version = $updating ? positiveInt($input->version ?? null, 'version') : 1;
    checkFields($errors);
    return compact('username','displayName','email','role','password','version') + ['active'=>$input->active];
}
