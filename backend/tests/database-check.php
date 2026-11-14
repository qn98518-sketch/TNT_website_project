<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/src/bootstrap.php';
$admin=row("SELECT * FROM cms_users WHERE role='admin'");
if(!$admin || !password_verify(env('CMS_TEST_CURRENT_PASSWORD'),$admin['password_hash']))throw new RuntimeException('Password hash verification failed');
$checks=[
    ["INSERT INTO cms_users (username,display_name,email,password_hash,role) VALUES ('second-admin','Second','second@example.invalid',?,'admin')",[$admin['password_hash']]],
    ['DELETE FROM cms_users WHERE id=?',[$admin['id']]],
    ["UPDATE cms_users SET role='viewer' WHERE id=?",[$admin['id']]],
    ['UPDATE cms_users SET active=0 WHERE id=?',[$admin['id']]],
    ["UPDATE cms_users SET username='renamed-admin' WHERE id=?",[$admin['id']]],
];
foreach($checks as [$sql,$params]){
    db()->beginTransaction();$blocked=false;
    try{execute($sql,$params);}catch(PDOException $e){$blocked=in_array($e->errorInfo[1]??0,[1062,1644],true);}
    finally{db()->rollBack();}
    if(!$blocked)throw new RuntimeException('Database admin protection failed');
}
$count=(int)row('SELECT COUNT(*) AS n FROM cms_audit_log')['n'];
if($count<10)throw new RuntimeException('Audit records missing');
foreach(queryRows('SELECT metadata FROM cms_audit_log')as$record){if(str_contains($record['metadata'],env('CMS_TEST_CURRENT_PASSWORD')))throw new RuntimeException('Password leaked in audit log');}
echo "Database protections: 5 checks; password hash and $count audit entries verified\n";
