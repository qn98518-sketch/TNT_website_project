# Kiểm chứng TNT CMS

## Production Supabase + Vercel — 14/11/2026

- Đã triển khai project `hms-343f/tnt-website` lên
  [CMS online](https://tnt-website-theta.vercel.app/cms).
- Deployment `dpl_82M72DJGmJDmz1mRbqdN57RFu3nR`: **READY**, build Next.js
  trên Vercel thành công; domain Production đã trỏ tới bản này.
- Supabase `supabase-bronze-button` đã gắn với project. Migration và đối chiếu
  sau nhập xác nhận **1 tài khoản, 2 yêu cầu, đúng 1 admin**; giữ bcrypt hash cũ.
- Đã thêm `DATABASE_URL`, `CMS_SESSION_SECRET`, `DATABASE_SSL_CA` dưới dạng
  Secret cho Production. Kết nối database xác minh CA Supabase và hostname.
- Kiểm tra bản upload: 255 file, không chứa `.env`, `.vercel`, database,
  credential local, `backend/` hoặc `tmp/`.
- **16 kiểm tra HTTP/API online PASS**: trang CMS 200, chặn đọc khi chưa đăng
  nhập, phiên PostgreSQL, no-store, cookie Secure/HttpOnly/SameSite, đăng nhập
  bằng mật khẩu cũ, dữ liệu đã chuyển, admin duy nhất, gửi form, retry không
  tạo trùng, đọc yêu cầu mới qua API mà không reload, sửa trạng thái/ghi chú,
  xóa bản ghi thử và đăng xuất.
- Bản ghi thử đã được dọn; sau kiểm tra còn **1 tài khoản và 2 yêu cầu thật**.
  Dữ liệu PostgreSQL/MySQL local được giữ làm bản nguồn; bản online dùng Supabase.
- Xác minh bằng build và HTTP/API thực tế. Chưa chạy kiểm thử UI tự động trên
  trình duyệt trong bước triển khai này.

## Bản chuyển đổi Next.js + PostgreSQL — 14/11/2026

- Production build Next.js: PASS. TypeScript và ESLint phần API/CMS đã sửa: PASS.
- `npm.cmd run test:cms`: **182 assertions PASS**, database thử riêng, hai
  tiến trình Next.js production; không cần PHP/MySQL cho runtime.
- Kiểm tra import tài khoản bcrypt `$2y$` của PHP, yêu cầu/ghi chú/version/thời
  gian UTC/JSON/nhật ký, nhập lại cùng snapshot, từ chối ghi đè đích có dữ liệu,
  và retry submission từ hệ thống cũ: PASS.
- Đăng nhập/CSRF/HttpOnly/SameSite, admin duy nhất, editor/viewer, CRUD, bộ lọc,
  phân trang, xung đột version, khóa/xóa nhân viên, đổi mật khẩu/thu hồi phiên,
  chia sẻ phiên giữa hai instance, giới hạn login/form và RLS/schema riêng: PASS.
- Dữ liệu thật local đã sao chép từ MySQL sang PostgreSQL: **1 tài khoản, 2 yêu
  cầu**. Không đổi password hash hoặc ghi vào database MySQL nguồn.
- Sau khi dừng PHP 8080 và MySQL 3307, PostgreSQL 5433 vẫn chạy; `/cms` và
  `/api/cms/session` trả 200. `cms:check` xác nhận đúng một admin.
- Bản chuyển đổi local sau đó đã được triển khai lên cloud; xem kết quả
  Production phía trên và [CMS_SUPABASE.md](./CMS_SUPABASE.md).

Các kết quả PHP/MySQL bên dưới là lịch sử của backend cũ.

---

Ngày: 14/11/2026. Phạm vi: backend CMS PHP/MySQL, nối các form hiện có và giao diện `/cms`.

## Kết quả

- `npm.cmd run build`: PASS, gồm `/cms`, `/api/cms/[...path]`, `/api/leads` và toàn bộ trang hiện có.
- ESLint các file CMS, bridge, contract, form chung, SelectBox và cấu hình Next.js: PASS.
- PHP syntax check 10 file: PASS.
- `npm.cmd run test:cms`: PASS, **168 assertions**, cộng **36 ca contract PHP** và **5 kiểm tra ràng buộc database**.
- Migration chạy lần đầu và chạy lại: PASS. Kiểm tra băm mật khẩu và 31 bản ghi audit: PASS.

Môi trường thực: Windows, PHP 8.2.12 + PDO MySQL/mbstring từ XAMPP,
MariaDB 10.4.32 (tương thích MySQL), Next.js 16.4.6 và React 19.3.0.
Test khởi tạo datadir riêng dưới `tmp/`, port ngẫu nhiên và mật khẩu test ngẫu nhiên,
không dùng hoặc sửa database XAMPP hiện có. Test dừng các tiến trình do nó tạo.
Docker/MySQL 8.4 được cung cấp để triển khai nhưng chưa chạy trong môi trường này.

## Các luồng đã kiểm chứng

1. Contract TypeScript/PHP khớp nhau ở cả năm ngữ cảnh form; từ chối null,
   array, sai kiểu, thiếu trường, dữ liệu quá dài, control characters, enum sai,
   unknown keys và key liên quan prototype; yêu cầu đồng ý liên hệ chính xác true.
2. Gửi form → Next.js → PHP → database thật; chỉ xác nhận sau khi commit.
   Retry cùng submission ID không tạo trùng; nội dung khác dùng cùng ID bị từ chối.
3. API PHP độc lập vẫn chặn dữ liệu sai, JSON hỏng, array root và payload lớn.
   Origin PHP từ chối khi thiếu server secret. BFF chặn cross-origin, sai media
   type, JSON hỏng và payload quá 32 KB. Không phản hồi secret hoặc password hash.
4. Đăng nhập đúng/sai; CSRF cho login và thao tác ghi; cookie HttpOnly,
   SameSite=Strict; response API no-store; giới hạn login và gửi form.
5. Admin tạo/đọc/sửa/khóa/xóa nhân viên; trùng username/email bị chặn.
   Editor CRUD yêu cầu; viewer chỉ đọc, không thể gọi lén API sửa/xóa hoặc quản lý user.
6. Không thể tạo admin thứ hai bằng API/CLI/SQL; không thể xóa, đổi username,
   khóa hoặc hạ quyền admin, kể cả gọi SQL trực tiếp. Không tự xóa tài khoản.
7. Đổi mật khẩu cần mật khẩu hiện tại và xác nhận đúng. Mật khẩu cũ mất hiệu lực,
   phiên hiện tại giữ được, phiên khác bị thu hồi. Khóa/xóa nhân viên thu hồi phiên.
8. Client tự lấy CSRF mới sau khi phiên bị thu hồi, không tự gửi lại mutation đã lỗi.
9. Tìm kiếm literal an toàn, bộ lọc trạng thái/ngữ cảnh, phân trang, ngày hợp lệ,
   kiểm tra version khi sửa/xóa để ngăn ghi đè dữ liệu mới.
10. `/cms` trả trang CMS; `/ve-tnt/cms`, `/du-an/erp-che-bien-thuy-san/cms`,
    `/dich-vu/erp/cms` chuyển đến `/cms`.
11. SSR của 7 trang có form: Home, About, ngành thực phẩm, tổng quan dịch vụ,
    ERP, Outsourcing và Body Shop. Form dùng component chung và có giới hạn độ dài ở input.

## Giới hạn kiểm chứng / triển khai

- Chưa kiểm tra trực quan hoặc thao tác trong trình duyệt thật: browser access host
  của công cụ không kết nối được. Responsive được triển khai bằng CSS; cần xác nhận
  trực quan desktop/tablet/mobile khi trình duyệt khả dụng.
- Chưa có hosting PHP/MySQL production được cấu hình. Không tạo tài khoản admin thật
  hay đưa khóa/mật khẩu vào mã nguồn. Chưa công bố CMS mới lên Vercel.
- Cần triển khai PHP, chạy migration/create-admin, cấu hình `CMS_BACKEND_URL` và
  `CMS_SHARED_SECRET` trên website rồi kiểm tra HTTPS/cookie Secure qua tên miền thật.

Hướng dẫn: [backend/README.md](../backend/README.md).
SQL: [001_initial.sql](../backend/database/001_initial.sql).
Tham chiếu nền tảng: [Vercel runtimes](https://vercel.com/docs/functions/runtimes),
[PHP session security](https://www.php.net/manual/en/features.session.security.management.php),
[PDO prepared statements](https://www.php.net/manual/en/pdo.prepared-statements.php).
