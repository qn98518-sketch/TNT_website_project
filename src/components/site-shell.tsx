import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Icon } from "@/components/ui/icon";

const navigation = [
  { href: "/ve-tnt", label: "Về TNT" },
  { href: "/giai-phap-nganh-thuc-pham", label: "Giải pháp thực phẩm" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/du-an", label: "Dự án" },
  { href: "/kien-thuc", label: "Kiến thức" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link aria-label="TNT — Trang chủ" className="brand brand-inverted" href="/">
            <span aria-hidden="true" className="brand-lockup">
              <span className="brand-lockup-title">TNT</span>
              <span className="brand-lockup-caption">TRÍ NGHĨA TECH</span>
            </span>
          </Link>
          <p>
            Kết nối công nghệ với nhu cầu vận hành — bắt đầu từ việc hiểu đúng
            bài toán.
          </p>
        </div>

        <div className="footer-links">
          <h2>Khám phá</h2>
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-contact">
          <h2>Liên hệ</h2>
          <p>
            Kênh tiếp nhận yêu cầu và thông tin liên hệ sẽ được cập nhật sau khi
            TNT xác nhận.
          </p>
          <Link className="footer-contact-link" href="/#contact">
            Gửi yêu cầu tư vấn <Icon name="arrowUp" size={16} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© TNT — Trí Nghĩa Tech</span>
        <span>Thông tin được cập nhật theo nội dung đã xác nhận.</span>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
