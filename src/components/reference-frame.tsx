import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { SiteImage as Image } from "@/components/site-image";
import { SiteHeader } from "@/components/site-header";
import { SiteBreadcrumbs, type BreadcrumbItem } from "@/components/site-breadcrumbs";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Icon } from "@/components/ui/icon";
import "./reference-pages.css";
import "./unified-pages.css";
import "./wireframe-pages.css";
import "./hero-banners.css";
import "./section-spacing.css";
import "./project-story.css";
import "./responsive-actions.css";
import "./site-header.css";
import "./leadership-carousel.css";
import "./dropdowns.css";
import "./editorial-content.css";
import "./home-statistics.css";
import "./mobile-layout.css";
import "./tablet-layout.css";
import "./scroll-reveal.css";
/** Shared navigation and footer, with a matching content style for the other pages. */
export async function ReferenceFrame({ children, variant, breadcrumbs }: {
    children: React.ReactNode;
    variant?: "unified";
    breadcrumbs?: readonly BreadcrumbItem[];
}) {
    const { t } = await getI18n();
    return <div className={`rf-frame${variant === "unified" ? " rf-unified" : ""}`}>
    <SiteHeader />
    <div className="site-page-content">
      <SiteBreadcrumbs items={breadcrumbs} />
      {children}
    </div>
    <ScrollReveal /><footer className="rf-footer">
      <div className="rf-container rf-footer-grid">
        <div>
          <Link aria-label={t("TNT — Trang chủ")} className="rf-logo" href="/"/>
          <p>{t("Kiến tạo hạ tầng công nghệ")}<br />{t("cho tăng trưởng doanh nghiệp.")}</p>
          <div className="rf-socials" aria-label={t("Trí Nghĩa Tech")}>
            <span>{t("in")}</span>
            <a href="https://www.facebook.com/profile.php?id=100057386293839" target="_blank" rel="noopener noreferrer" aria-label="Facebook TNT Trí Nghĩa Tech"><Icon name="facebook" size="100%"/></a>
            <Icon name="monitor" size={18}/>
          </div>
        </div>
        <div>
          <h2>{t("Dịch vụ")}</h2>
          <Link href="/dich-vu/erp">TNM ERP</Link>
          <Link href="/dich-vu/outsourcing">{t("Gia công phần mềm")}</Link>
          <Link href="/dich-vu/outsourcing">{t("Phát triển phần mềm theo yêu cầu")}</Link>
          <Link href="/dich-vu/body-shop">{t("Cung ứng nhân lực CNTT")}</Link>
        </div>
        <div>
          <h2>{t("Công ty")}</h2>
          <Link href="/du-an">{t("Dự án")}</Link>
          <Link href="/kien-thuc/blog">{t("Blog")}</Link>
          <Link href="/ve-tnt">{t("Giới thiệu")}</Link>
          <Link href="/#contact">{t("Liên hệ")}</Link>
        </div>
        <div>
          <h2>{t("Liên hệ")}</h2>
          <p>
            <Icon name="building"/>{t(" Tầng 4, tòa nhà LeBuilding, 342 Mỹ Đình, phường Từ Liêm, Hà Nội")}</p>
          <p>
            <Icon name="call"/><a href="tel:0889889788">0889 889 788</a></p>
          <p>
            <Icon name="message"/><a href="mailto:info@tringhiatech.vn">info@tringhiatech.vn</a></p>

        </div>
      </div>
      <div className="rf-container rf-footer-bottom">
        <span>© {new Date().getFullYear()} TNT Trí Nghĩa Tech. All rights reserved.</span>
        <div className="rf-footer-policies"><span>{t("Chính sách bảo mật ")}</span><span>{t(" Điều khoản sử dụng ")}</span><span>{t(" Tuyển dụng")}</span></div>
      </div>
    </footer>
  </div>;
}
export async function ReferenceImage({ src, alt, className = "", mediaKind }: {
    src: string;
    alt: string;
    className?: string;
    mediaKind?: 'photo' | 'cutout' | 'background';
}) {
    const { t } = await getI18n();
    return <Image unoptimized className={className} src={src} alt={t(alt)} width={1200} height={700} mediaKind={mediaKind}/>;
}
export async function ReferenceHeading({ eyebrow, children, description }: {
    eyebrow?: string;
    children: React.ReactNode;
    description?: string;
}) {
    const { t } = await getI18n();
    return <div className="rf-heading">
    <div>{t(eyebrow && <span className="rf-eyebrow">{t(eyebrow)}</span>)}<h2 className="tnt-section-title">{t(children)}</h2>
    </div>{t(description && <p>{t(description)}</p>)}</div>;
}
export function ReferenceWave() { return <div className="rf-wave" aria-hidden="true"/>; }
/** Decorative artwork extracted from the supplied reference, never a UI control. */
export function ReferenceGlyph({ name }: {
    name: string;
}) {
    return <svg aria-hidden="true" focusable="false" width={60} height={60} viewBox="0 0 100 100">
    <image href={`/images/reference/${name}.webp`} width={100} height={100}/>
  </svg>;
}
