# CMS local — chuyển sang PostgreSQL

CMS hiện chạy bằng **Next.js + PostgreSQL**. Nháy đúp `CHAY-CMS-LOCAL.cmd` hoặc chạy:

```powershell
npm.cmd run cms:start
```

Mở `http://localhost:3000/cms`. Tài khoản và mật khẩu cũ được giữ khi nhập từ MySQL.
Hộp thư tự cập nhật mỗi 3 giây khi tab đang hiển thị; trở lại tab sẽ lấy dữ liệu mới.

Database local nằm ở `backend/storage/postgres-data`, cổng riêng **5433**.
Máy hiện tại dùng PostgreSQL 18 đã cài; có thể đổi đường dẫn binary bằng
`CMS_LOCAL_POSTGRES_BIN`. Không xóa datadir nếu cần giữ dữ liệu.

- `npm.cmd run cms:setup`: tạo database local, chạy migration, nhập MySQL cũ một lần.
- `npm.cmd run cms:status`: kiểm tra website và kết nối PostgreSQL.
- `npm.cmd run cms:stop`: dừng dịch vụ do helper quản lý, giữ nguyên database.
- Nếu `.env.local` dùng Supabase, `cms:start` chỉ bật Next.js và kết nối cloud;
  không cần chạy PostgreSQL, MySQL hoặc PHP trên máy.

Triển khai online: [Supabase + Vercel](./CMS_SUPABASE.md).
Các bước XAMPP bên dưới là tài liệu lịch sử cho dữ liệu nguồn trước chuyển đổi.

---

# Lịch sử: chạy CMS bằng PHP/MySQL của XAMPP

Đã cấu hình tại `http://localhost:3000/cms`.

## Sử dụng

1. Nháy đúp `CHAY-CMS-LOCAL.cmd` trong thư mục project. Trình khởi động tự mở
   MySQL riêng, PHP backend và website local nếu các dịch vụ này chưa chạy.
2. Mở `http://localhost:3000/cms` bằng trình duyệt.
3. Tên đăng nhập: **admin**. Mật khẩu ban đầu nằm trong
   `backend/storage/local-admin.txt`. Mở file trên máy để xem, rồi dùng mục
   **Đổi mật khẩu** trong CMS để đặt mật khẩu bạn muốn.
4. Mở `http://localhost:3000`, gửi một form. Quay lại CMS → **Yêu cầu từ biểu mẫu**
   → **Làm mới** để xem dữ liệu, cập nhật trạng thái hoặc ghi chú.

File mật khẩu là thông tin khởi tạo một lần; sau khi bạn đổi mật khẩu trong CMS,
file này không cập nhật theo. Config, mật khẩu, session và database local được
Git bỏ qua và không đưa lên Vercel.

## Lệnh trong terminal tại thư mục project

```powershell
npm.cmd run cms:start
npm.cmd run cms:status
npm.cmd run cms:stop
```

`cms:stop` dừng các dịch vụ do trình khởi động tạo, giữ file database để lần sau
dùng tiếp. Terminal website có sẵn trước khi khởi động CMS được giữ nguyên.
Khi cài trên một máy khác lần đầu: cài XAMPP + Node.js, cài dependencies của project,
rồi chạy `npm.cmd run cms:setup` một lần trước `cms:start`.

## Cấu hình trên máy hiện tại

| Thành phần | Địa chỉ / vị trí |
|---|---|
| Website và CMS | `http://localhost:3000` và `/cms` |
| PHP backend (chỉ nhận request có server secret) | `http://127.0.0.1:8080` |
| MySQL dành riêng cho TNT | `127.0.0.1:3307`, database `tnt_cms_local` |
| Database lưu bền vững | `backend/storage/mysql-data/` |
| Cấu hình backend | `backend/.env` |
| Cấu hình nối Next.js với PHP | `.env.local` |
| Mật khẩu admin ban đầu | `backend/storage/local-admin.txt` |
| Log khởi động PHP / MySQL | `backend/storage/` |

MySQL mặc định trong XAMPP trên máy này lỗi định dạng bảng quyền `proxies_priv`
khi khởi động. Bộ dữ liệu cũ trong `C:/xampp/mysql/data` được giữ nguyên.
CMS dùng **chính binary MySQL của XAMPP**, chạy trên cổng riêng 3307 với datadir
trong project. Trình khởi động không cần sửa cấu hình Apache hoặc dữ liệu XAMPP cũ.
Khi bật MySQL mặc định trong XAMPP Control Panel, lỗi bảng quyền cũ có thể vẫn xuất
hiện; CMS local dùng dịch vụ 3307 riêng nên không phụ thuộc vào nó.

Không xóa `backend/storage/mysql-data` nếu muốn giữ yêu cầu và tài khoản đã tạo.
Đây là môi trường thử local; website Vercel hiện tại không bị đổi cấu hình.

## Kiểm tra đã thực hiện

Đăng nhập admin, gửi form từ website → lưu MySQL, xem/sửa/xóa yêu cầu trong API CMS,
kiểm tra chỉ có một admin, đăng xuất và chuyển `/ve-tnt/cms` → `/cms`: thành công.
Bản ghi thử đã được xóa sau kiểm tra. Mật khẩu không được in trong log kiểm tra.
