# CMS trên Vercel + Supabase

## Bản online hiện tại

Đã triển khai và kiểm tra ngày **14/11/2026**:

- Website: https://tnt-website-theta.vercel.app
- CMS: https://tnt-website-theta.vercel.app/cms
- Project Vercel: `hms-343f/tnt-website`.
- Supabase đã liên kết: `supabase-bronze-button`.
- Đã chuyển 1 tài khoản và 2 yêu cầu từ PostgreSQL local; dùng tài khoản và
  mật khẩu CMS hiện tại. Hộp thư tự cập nhật mỗi 3 giây khi đang mở.

Production đã có `DATABASE_URL`, `CMS_SESSION_SECRET`, `DATABASE_SSL_CA`
dưới dạng Secret. API online hoạt động độc lập với máy local/XAMPP. Local vẫn
dùng database phát triển riêng; dùng đường dẫn CMS online để xem form gửi từ
website online. Kết quả kiểm tra nằm trong [CMS_VALIDATION.md](./CMS_VALIDATION.md).

Các bước bên dưới dành cho cài đặt mới hoặc vận hành sau này.

Website, CMS và API cùng chạy trong project Next.js hiện có. Supabase quản lý
PostgreSQL; máy tính/XAMPP của bạn không cần bật khi website online.

```text
Form khách hàng → POST /api/leads → PostgreSQL trên Supabase
CMS /cms       → /api/cms/*     → cùng database
```

Giao diện, username/password, admin duy nhất, nhân viên editor/viewer, bộ lọc,
phân trang, ghi chú và đổi mật khẩu được giữ. Hộp thư tự cập nhật mỗi 3 giây;
bản chuyển đổi này chưa dùng Supabase Realtime. Phiên đăng nhập, giới hạn gửi
form/đăng nhập và nhật ký thao tác đều lưu trong PostgreSQL, không dùng file local.
CMS dùng cơ chế tài khoản hiện có; không cần bật Supabase Auth hoặc cho phép
đăng ký công khai.

## 1. Chuẩn bị Supabase

Tạo/chọn project Supabase do bạn sở hữu. Trong **Connect**, lấy chuỗi PostgreSQL
**Transaction pooler** (thường cổng 6543) cho Vercel. Không dùng project HTTPS URL
hoặc API key thay cho connection string. Mật khẩu trong URL phải được URL-encode.
Driver đã tắt prepared statements để tương thích transaction pooling.

Đặt trong `.env.local` (không commit):

```dotenv
DATABASE_URL=postgresql://postgres.PROJECT_REF:ENCODED_PASSWORD@POOLER_HOST:6543/postgres
CMS_SESSION_SECRET=RANDOM_SECRET_AT_LEAST_32_CHARACTERS
```

Tạo secret bằng `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
Chỉ dùng giá trị này ở môi trường server. Nếu dùng kết nối direct/session pooler
cho migration, thêm `CMS_MIGRATION_DATABASE_URL` vào `.env.local`; biến này
không cần đưa lên Vercel. Không chia sẻ các giá trị bí mật qua chat.

Kết nối cloud bắt buộc TLS và xác minh chứng chỉ. Nếu provider cần CA riêng,
đặt `DATABASE_SSL_CA` là nội dung PEM tải từ dashboard Supabase (có thể dùng
`\n` giữa các dòng); không tắt xác minh TLS.

## 2. Tạo cấu trúc database

```powershell
npm.cmd run cms:migrate
```

Migration nằm trong `supabase/migrations/`. Công cụ lưu checksum và áp dụng trong
transaction; chạy lại an toàn, thay đổi migration đã áp dụng sẽ bị từ chối.
Hãy dùng lệnh này để cả cấu trúc và bảng theo dõi migration được tạo cùng nhau.
Không chỉnh migration đã chạy hoặc chạy reset vào database đang có dữ liệu.

Các bảng CMS nằm trong schema riêng `tnt_cms`, có RLS, không cấp quyền cho
`anon`, `authenticated` hoặc `service_role`. **Không thêm `tnt_cms` vào danh sách
schema được expose của Supabase Data API.** Chỉ backend Next.js kết nối database.

## 3. Nhập tài khoản và yêu cầu đang có

**Máy hiện tại đã chuyển sang PostgreSQL local.** Để đưa cả các yêu cầu phát sinh
sau chuyển đổi lên Supabase, dùng lệnh sau sau khi đặt database cloud làm đích
và chạy migration:

```powershell
npm.cmd run cms:import:local
```

Lệnh đọc snapshot PostgreSQL local và nhập vào đích trống; giữ tài khoản, mật khẩu,
ID, thời gian và nhật ký. Chọn thời điểm ngừng gửi/sửa dữ liệu local trong lúc
chuyển, rồi chuyển hẳn sang bản online để tránh dữ liệu phát sinh ở hai nơi.
Khởi động lại `npm run dev` khi đổi `.env.local` từ local sang cloud.

### Với máy vẫn dùng MySQL cũ

Với database đích trống, giữ MySQL nguồn ở cổng 3307 đang chạy và `backend/.env`
trên máy, sau đó chạy:

```powershell
npm.cmd run cms:import:mysql
```

Công cụ đọc MySQL trong snapshot chỉ đọc và nhập vào PostgreSQL trong một
transaction: giữ ID, tài khoản, bcrypt hash, thời gian UTC, yêu cầu, ghi chú,
trạng thái, nhật ký và quy tắc gửi lại không tạo trùng. Không in/export mật khẩu
hoặc nội dung khách hàng ra file/log. Tài khoản dùng được bằng mật khẩu hiện tại;
cần đăng nhập lại vì phiên PHP cũ không được chuyển.

Nhập lại cùng snapshot sẽ bỏ qua; snapshot khác khi đích đã có dữ liệu sẽ bị
từ chối, không trộn/ghi đè. Không chạy `cms:admin` trước khi nhập dữ liệu cũ.
Nguồn MySQL được giữ nguyên để có thể đối chiếu và khôi phục.

## 4. Chỉ dành cho database mới hoàn toàn

Nếu không nhập dữ liệu cũ, tạo admin qua CLI. Ví dụ PowerShell:

```powershell
$env:CMS_ADMIN_USERNAME = 'admin'
$env:CMS_ADMIN_NAME = 'TNT Admin'
$env:CMS_ADMIN_EMAIL = 'admin@your-domain.example'
$cmsCredential = Get-Credential -UserName $env:CMS_ADMIN_USERNAME -Message 'Đặt mật khẩu CMS: 12–72 byte, gồm chữ và số'
$cmsCredential.GetNetworkCredential().Password | node scripts/cms-database.cjs create-admin
Remove-Variable cmsCredential
```

Không đặt mật khẩu trong dòng lệnh, Git hoặc biến `NEXT_PUBLIC_*`. Admin chỉ tạo
một lần. API và ràng buộc database ngăn thêm admin, xóa admin hoặc hạ quyền admin.

## 5. Cấu hình project Vercel hiện có

Trong **Settings → Environment Variables**, đặt cho môi trường Production:

| Biến | Giá trị |
|---|---|
| `DATABASE_URL` | Supabase transaction pooler URL |
| `CMS_SESSION_SECRET` | Secret riêng, tối thiểu 32 ký tự |
| `NEXT_PUBLIC_SITE_URL` | Origin HTTPS chính thức của website |
| `DATABASE_SSL_CA` | CA PEM nếu kết nối yêu cầu |

`CMS_BACKEND_URL` và `CMS_SHARED_SECRET` của PHP cũ không còn được sử dụng.
Preview nên dùng database riêng; không gán nhầm database thử nghiệm vào Production.
Deploy lại project Next.js sau khi đặt biến. Không cần PHP runtime, Docker hay VPS.

Mở `https://TEN-MIEN/cms`, đăng nhập và gửi một form thử có đánh dấu kiểm thử.
Xác nhận yêu cầu hiện trong CMS, sửa được ghi chú và chỉ tài khoản phù hợp mới
quản lý được nhân viên. Tắt XAMPP/máy local không ảnh hưởng bản online.

## Kiểm tra và vận hành

```powershell
npm.cmd run cms:check
npm.cmd run build
npm.cmd run test:cms
```

`cms:check` kiểm tra kết nối và số lượng admin/yêu cầu, không in thông tin khách hàng.
`test:cms` cần PostgreSQL local do `cms:setup` tạo; nó dùng database thử riêng có
tên ngẫu nhiên và hai tiến trình Next.js production. Nó không chạy vào Supabase
hoặc database local đang có dữ liệu. Chạy `build` trước test.

Khi nâng cấp schema, tạo migration mới; sao lưu database trước khi chạy.
Theo dõi dung lượng, số kết nối, lưu lượng và hạn mức gói Supabase/Vercel đã chọn.
Nếu chưa kết nối database hoặc kết nối lỗi, form/CMS trả 503, không nhận thành công giả.

Tham khảo: [Supabase connection pooling](https://supabase.com/docs/guides/database/connecting-to-postgres),
[Vercel Functions](https://vercel.com/docs/functions).
