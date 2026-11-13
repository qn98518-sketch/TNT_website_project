import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { ReferenceFrame } from "@/components/reference-frame";
import { Icon } from "@/components/ui/icon";
const navigation = [
    { href: "/ve-tnt", label: "Về TNT" },
    { href: "/giai-phap-nganh-thuc-pham", label: "Giải pháp thực phẩm" },
    { href: "/dich-vu", label: "Dịch vụ" },
    { href: "/du-an", label: "Dự án" },
    { href: "/kien-thuc", label: "Kiến thức" },
];
export async function SiteFooter() {
    const { t } = await getI18n();
    return (<footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link aria-label={t("TNT — Trang chủ")} className="brand brand-inverted" href="/">
            <span aria-hidden="true" className="brand-lockup">
              <span className="brand-lockup-title">{t("TNT")}</span>
              <span className="brand-lockup-caption">{t("TRÍ NGHĨA TECH")}</span>
            </span>
          </Link>
          <p>{t("Kết nối công nghệ với nhu cầu vận hành — bắt đầu từ việc hiểu đúng bài toán.")}</p>
        </div>

        <div className="footer-links">
          <h2>{t("Khám phá")}</h2>
          {t(navigation.map((item) => (<Link href={item.href} key={item.href}>
              {t(item.label)}
            </Link>)))}
        </div>

        <div className="footer-contact">
          <h2>{t("Liên hệ")}</h2>
          <p>{t("Kênh tiếp nhận yêu cầu và thông tin liên hệ sẽ được cập nhật sau khi TNT xác nhận.")}</p>
          <Link className="footer-contact-link" href="/#contact">{t("Gửi yêu cầu tư vấn ")}<Icon name="arrowUp" size={16}/>
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t("© TNT — Trí Nghĩa Tech")}</span>
        <span>{t("Thông tin được cập nhật theo nội dung đã xác nhận.")}</span>
      </div>
    </footer>);
}
export function PageFrame({ children }: {
    children: React.ReactNode;
}) {
    return (<ReferenceFrame variant="unified">{children}</ReferenceFrame>);
}
