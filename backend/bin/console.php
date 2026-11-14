<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once dirname(__DIR__) . '/src/bootstrap.php';
try {
    $command=$argv[1] ?? 'help';
    if ($command === 'migrate') {
        db()->exec('CREATE TABLE IF NOT EXISTS cms_migrations (name VARCHAR(100) PRIMARY KEY, checksum CHAR(64) NOT NULL, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB');
        foreach (glob(dirname(__DIR__) . '/database/*.sql') as $file) {
            $name=basename($file); $checksum=hash_file('sha256',$file); $existing=row('SELECT checksum FROM cms_migrations WHERE name=?',[$name]);
            if ($existing) { if (!hash_equals($existing['checksum'],$checksum)) throw new RuntimeException('Applied migration was edited: ' . $name); echo "$name already applied\n"; continue; }
            $delimiter=';'; $statement='';
            foreach (file($file, FILE_IGNORE_NEW_LINES) as $line) {
                if (str_starts_with(trim($line),'--') || trim($line)==='') continue;
                if (preg_match('/^DELIMITER\s+(\S+)$/i',trim($line),$match)) { $delimiter=$match[1]; continue; }
                $statement.=$line . "\n";
                if (str_ends_with(rtrim($statement),$delimiter)) {
                    $sql=substr(rtrim($statement),0,-strlen($delimiter));
                    // A failed first migration may already have created an earlier trigger.
                    if (preg_match('/^CREATE TRIGGER (\w+)/i',trim($sql),$match) && row('SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=DATABASE() AND TRIGGER_NAME=?',[$match[1]])) { $statement=''; continue; }
                    db()->exec($sql); $statement='';
                }
            }
            if (trim($statement)!=='') throw new RuntimeException('Unterminated SQL statement');
            execute('INSERT INTO cms_migrations (name,checksum) VALUES (?,?)',[$name,$checksum]); echo "$name applied\n";
        }
    } elseif ($command === 'create-admin') {
        if (row("SELECT id FROM cms_users WHERE role='admin'")) throw new RuntimeException('The fixed admin already exists; a second admin is forbidden');
        $username=env('CMS_ADMIN_USERNAME'); $displayName=env('CMS_ADMIN_NAME'); $email=env('CMS_ADMIN_EMAIL');
        // Supply password through stdin (recommended) or a temporary process environment.
        $password=env('CMS_ADMIN_PASSWORD'); if ($password==='') $password=rtrim(stream_get_contents(STDIN),"\r\n");
        $input=(object)['username'=>$username,'displayName'=>$displayName,'email'=>$email,'password'=>$password,'role'=>'editor','active'=>true]; $data=validateUser($input);
        transaction(function()use($data){execute("INSERT INTO cms_users (username,display_name,email,password_hash,role,active) VALUES (?,?,?,?,'admin',1)",[$data['username'],$data['displayName'],$data['email'],password_hash($data['password'],PASSWORD_DEFAULT)]);$id=(int)db()->lastInsertId();audit($id,'bootstrap_admin','user',$id);});
        echo "Fixed admin created. No password is printed or stored in source files.\n";
    } else { echo "Commands:\n  migrate       Apply versioned MySQL schema\n  create-admin  Create the only fixed admin (one time)\n"; }
} catch (ApiError $e) { fwrite(STDERR,$e->getMessage() . ' ' . json_encode($e->fields,JSON_UNESCAPED_UNICODE) . "\n"); exit(1); }
catch (Throwable $e) { fwrite(STDERR,'Command failed: ' . $e->getMessage() . "\n"); exit(1); }
