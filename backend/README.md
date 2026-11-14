# TNT CMS — PHP / MySQL

> **Backend cũ, giữ lại để nhập dữ liệu/khôi phục.** CMS hiện chạy trực tiếp bằng
> Next.js + PostgreSQL/Supabase. Xem [hướng dẫn mới](../docs/CMS_SUPABASE.md).
> Không cần triển khai thư mục PHP này lên hosting cho bản CMS mới.

CMS quản lý dữ liệu **tất cả biểu mẫu hiện có**, không thay thế nội dung bài viết tĩnh của website.
Giao diện React nằm tại `/cms`, backend là PHP 8.2+ với PDO MySQL và mbstring.
MySQL 8.0+ (khuyến nghị MySQL 8.4) hoặc MariaDB 10.4+; dùng phiên bản PHP còn được cập nhật bảo mật trên hosting thật.

## Kiến trúc và đường dẫn

```text
Form website → POST /api/leads → PHP /api/intake → MySQL
/cms → /api/cms/* (Next.js, cùng domain) → PHP /api/* → MySQL
/ve-tnt/cms hoặc /du-an/ten-bai/cms → /cms
```

Giao diện không nhận khóa kết nối PHP hoặc MySQL. Cookie phiên HttpOnly,
SameSite=Strict chỉ áp dụng `/api/cms`, Secure trên HTTPS. Không dùng localStorage
để lưu phiên/mật khẩu. API có CSRF cho cả đăng nhập và mọi thay đổi dữ liệu,
giới hạn đăng nhập/gửi form, JSON giới hạn 32 KB và câu lệnh PDO có tham số.

Vercel hiện chạy phần Next.js. PHP cần máy chủ PHP/MySQL riêng (hosting Apache,
Nginx/PHP-FPM hoặc Docker); Vercel có PHP community runtime nhưng gói này được
thiết kế cho PHP host với session lưu bền vững. Không tải thư mục `backend/` vào
thư mục `public/` của Next.js. `.vercelignore` loại trừ backend khỏi bản website.

## Quyền truy cập

| Vai trò | Yêu cầu từ form | Tài khoản khác | Mật khẩu cá nhân |
|---|---|---|---|
| admin (duy nhất) | Xem, tạo, sửa, xóa | Tạo, xem, sửa, khóa, đặt lại mật khẩu, xóa nhân viên | Đổi với mật khẩu hiện tại |
| editor | Xem, tạo, sửa, xóa | Không truy cập | Đổi với mật khẩu hiện tại |
| viewer | Chỉ xem | Không truy cập | Đổi với mật khẩu hiện tại |

Admin cố hữu được tạo một lần bằng CLI, không có mật khẩu cứng trong mã nguồn.
Không thể xóa, khóa, đổi username hoặc hạ quyền admin. API không cho tạo thêm
admin; unique generated column và hai trigger trong MySQL cũng bảo vệ quy tắc
này. Không tài khoản nào có thể tự xóa chính mình. Tài khoản khác chỉ có editor
hoặc viewer. Khi thay đổi quyền, khóa, đặt lại mật khẩu hoặc xóa một nhân viên,
phiên của nhân viên bị thu hồi ở yêu cầu tiếp theo. Đổi mật khẩu cá nhân giữ phiên
hiện tại và thu hồi các phiên khác. Phiên hết hạn sau 30 phút không hoạt động hoặc
8 giờ kể từ đăng nhập.

## Cài trên hosting PHP

Để chạy thử XAMPP trên máy hiện tại, xem [CMS local](../docs/CMS_LOCAL.md).

1. Tạo một database utf8mb4 và tài khoản MySQL riêng. Tài khoản chạy migration
   cần quyền CREATE/ALTER/INDEX/TRIGGER và SELECT/INSERT/UPDATE/DELETE trong
   database này. Tài khoản chạy web chỉ cần SELECT/INSERT/UPDATE/DELETE; sau
   cài đặt có thể tách tài khoản migration và runtime. Không dùng root khi chạy thật.
2. Upload `backend/`. Document root **phải trỏ đến `backend/public/`**. Mọi file
   `.env`, `src/`, `database/`, `storage/`, `bin/` ở ngoài document root.
3. Sao chép `.env.example` thành `.env`, nhập DB, `CMS_PUBLIC_URL` là origin website
   Next.js và khóa `CMS_SHARED_SECRET` ngẫu nhiên. Có thể tạo khóa bằng:
   `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"`. Không đưa khóa vào NEXT_PUBLIC_*.
4. Chạy `php backend/bin/console.php migrate` từ gốc project (hoặc
   `php bin/console.php migrate` nếu đang ở backend). SQL được lưu riêng tại
   [database/001_initial.sql](database/001_initial.sql), gồm bảng, index và trigger.
   CLI lưu checksum trong `cms_migrations`, chạy lại không tạo dữ liệu trùng.
5. Đặt biến môi trường của tiến trình CLI `CMS_ADMIN_USERNAME`, `CMS_ADMIN_NAME`,
   `CMS_ADMIN_EMAIL`, rồi chạy `create-admin`, truyền mật khẩu qua stdin. Ví dụ
   PowerShell (từ gốc project, thay tên/email phù hợp):

   ```powershell
   $env:CMS_ADMIN_USERNAME = 'your-admin-name'
   $env:CMS_ADMIN_NAME = 'Tên quản trị viên'
   $env:CMS_ADMIN_EMAIL = 'admin@your-domain.example'
   $adminCredential = Get-Credential -UserName $env:CMS_ADMIN_USERNAME -Message 'Nhập mật khẩu CMS (12–72 byte, gồm chữ và số)'
   $adminCredential.GetNetworkCredential().Password | php backend/bin/console.php create-admin
   Remove-Variable adminCredential
   ```

   CLI cũng hỗ trợ `CMS_ADMIN_PASSWORD` tạm thời trong môi trường tiến trình;
   không ghi mật khẩu vào repository, lịch sử lệnh hoặc `.env` dùng cho web.
6. Cấp quyền ghi cho PHP ở `storage/sessions/` (ngoài public). Nếu chạy nhiều PHP
   instance cần dùng chung session storage bền vững. Không dùng thư mục tạm bị
   xóa giữa các request. Đặt `CMS_SESSION_PATH` nếu cần vị trí riêng.
7. Cấu hình HTTPS cho PHP host. Với Apache bật mod_rewrite/AllowOverride để dùng
   `public/.htaccess`. Với Nginx: `try_files $uri /index.php?$query_string;`, chỉ chạy
   PHP ở index.php và truyền request đến PHP-FPM theo cấu hình hosting.
   Áp dụng `config/php.ini` ở cấp PHP/FPM; `.user.ini` có sẵn cho CGI/FPM.
   Tắt `display_errors` và `display_startup_errors` trước khi PHP nhận request,
   bật log riêng ngoài public và cấu hình thư mục tạm PHP có quyền ghi. Nếu chỉ
   tắt lỗi trong index.php thì startup notice vẫn có thể làm hỏng JSON/HTTP status.
8. Trên Vercel thêm `CMS_BACKEND_URL=https://php-api.your-domain.example` (không
   có `/api`) và `CMS_SHARED_SECRET` giống PHP. Redeploy website để áp dụng.
   Nếu PHP host ở một đường dẫn con, reverse proxy cần bỏ tiền tố để PHP thấy
   `/api/...`. Không bật cache cho API. Origin PHP có thể đặt giới hạn mạng;
   bản thân API từ chối mọi request không có shared secret.
9. Đăng nhập bằng `/cms`, gửi thử một form thật và kiểm tra dữ liệu xuất hiện.

## Docker / VPS

Từ `backend/`, sao chép `.env.example` thành `.env`, nhập cả `DB_PASSWORD` và
`MYSQL_ROOT_PASSWORD` khác nhau. Chạy:

```sh
docker compose up -d --build
docker compose exec php php bin/console.php migrate
# Cấp CMS_ADMIN_* cho lệnh CLI và truyền mật khẩu qua stdin như mô tả ở trên.
docker compose exec -e CMS_ADMIN_USERNAME -e CMS_ADMIN_NAME -e CMS_ADMIN_EMAIL -e CMS_ADMIN_PASSWORD php php bin/console.php create-admin
```

Port PHP chỉ bind `127.0.0.1:8080`; dùng reverse proxy TLS phía trước trên VPS.
MySQL không mở port ra ngoài. Hai Docker volume giữ database và sessions.
Nếu chạy local đặt `APP_ENV=local`, `CMS_PUBLIC_URL=http://localhost:3000`;
Next.js dùng `CMS_BACKEND_URL=http://127.0.0.1:8080`. Production bắt buộc HTTPS.

## Hợp đồng API / validate JSON

Tất cả body là JSON object, `Content-Type: application/json`, tối đa 32 KB.
Unknown fields, sai kiểu, null thay string/boolean, array thay object, enum sai,
nguồn không phải đường dẫn nội bộ và nội dung quá dài đều bị từ chối. Quy tắc
select phải đúng ngữ cảnh: ERP, Outsourcing, Body Shop, thực phẩm hoặc liên hệ chung.
Giao diện dùng cùng contract TypeScript trước khi gửi; PHP kiểm tra độc lập.

| API website | Chức năng |
|---|---|
| POST `/api/leads` | Tiếp nhận form. Chỉ trả 202 `{accepted:true}` sau khi MySQL commit. |
| GET `/api/cms/session` | User hiện tại hoặc null và CSRF token |
| POST `/api/cms/login` | `{username,password}` + X-CSRF-Token lấy từ session |
| POST `/api/cms/logout` | `{}` + CSRF |
| POST `/api/cms/password` | `{currentPassword,newPassword,confirmPassword}` + CSRF |
| GET `/api/cms/leads` | `q,context,status,from,to,page,perPage`; từ khóa ≤160, page≥1, perPage≤100 |
| GET `/api/cms/leads/:id` | Toàn bộ dữ liệu và chi tiết theo từng form |
| POST `/api/cms/leads` | Body form + `status,notes` |
| PATCH `/api/cms/leads/:id` | Toàn bộ body form + `status,notes,version` |
| DELETE `/api/cms/leads/:id` | `{version}` |
| GET/POST `/api/cms/users` | Danh sách hoặc tạo nhân viên; admin only |
| GET/PATCH/DELETE `/api/cms/users/:id` | Xem/sửa/xóa nhân viên; admin only; sửa/xóa cần version |

Body form: `name` ≤120, `emailOrPhone` ≤254 (email hoặc điện thoại 7–15 chữ số),
`company` ≤160, `interest` đúng enum, `industry` ≤160, `companySize` trong
`1-50,51-200,201-500,500+` hoặc rỗng, `message` ≤4000, `consent` chính xác true,
`context` trong `general,food-processing,erp,outsourcing,body-shop`, `source` ≤300,
`details` là object với các key/giá trị đúng lựa chọn của form. `notes` ≤4000.
Status: `new,contacted,in_progress,closed,spam`. JSON mẫu có thể lấy từ Network
khi gửi form; các ca hợp lệ/sai được kiểm tra tự động trong test suite.

Tạo user: `{username,displayName,email,role,active,password}`. Sửa user dùng cùng
body + `version`, bỏ `password` nếu giữ nguyên. Username 3–50 ký tự lowercase
ASCII, số, `. _ -`. Mật khẩu 12–72 **byte**, có chữ và số, không null. Không trim
mật khẩu. Trả lỗi nhất quán:

```json
{"error":{"code":"VALIDATION_FAILED","message":"Vui lòng kiểm tra lại thông tin.","fields":{"emailOrPhone":"Vui lòng nhập email hoặc số điện thoại hợp lệ."}}}
```

400 JSON hỏng, 413 quá lớn, 415 sai content type, 422 sai trường, 401 chưa đăng
nhập, 403 sai quyền/CSRF/nguồn, 409 trùng user hoặc xung đột version, 429 giới hạn
yêu cầu, 503 PHP chưa cấu hình/không kết nối. Không trả SQL, stack trace hoặc mật khẩu.
Cookie, auth checks và dữ liệu CMS không được cache. PATCH/DELETE dùng optimistic
locking để tránh ghi đè. Public form có `X-Submission-Id` UUID, retry cùng payload
không tạo trùng; không cho tái dùng UUID cho payload khác. Nhật ký CRUD/đăng nhập/
đổi mật khẩu trong `cms_audit_log` không lưu nội dung mật khẩu.

Giới hạn: 10 form/10 phút/nguồn IP, 20 login/15 phút/IP và 5/15 phút/username,
5 lần đổi mật khẩu/15 phút/user+IP. Next.js trên Vercel dùng IP từ
`x-vercel-forwarded-for`; self-host phải cấu hình proxy ghi đè `X-Forwarded-For`,
không tin giá trị client tự gửi. Ngày lọc dùng UTC; giao diện hiển thị giờ thiết bị.

## Kiểm thử và vận hành

`npm run test:cms` chạy contract validation và integration thực với PHP +
MySQL-compatible server trong database **riêng biệt**, gồm đăng nhập/CSRF, phân
quyền, CRUD, khóa phiên, đổi mật khẩu, admin singleton, version và idempotency.
Trên Windows mặc định dùng `C:/xampp/php/php.exe` và `C:/xampp/mysql/bin`;
có thể đặt `CMS_TEST_PHP`, `CMS_TEST_MYSQL_BIN`. Test tạo datadir tạm dưới `tmp/`,
không dùng database XAMPP hiện tại và không ghi credential thật.

Sao lưu database trước migration mới, bảo vệ bản backup và giới hạn truy cập
hosting. Không chỉnh migration đã áp dụng: thêm file SQL có số thứ tự tiếp theo.
Lịch sử kiểm thử của lần triển khai hiện tại được ghi ở `docs/CMS_VALIDATION.md`.
