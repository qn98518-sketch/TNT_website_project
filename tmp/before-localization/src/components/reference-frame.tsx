import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Icon } from "@/components/ui/icon";
import "./reference-pages.css";

/** Scoped to the three pages reconstructed from the supplied PDFs. */
export function ReferenceFrame({ children, variant }: { children: React.ReactNode; variant?: "unified"; }) {
  return <div className={`rf-frame${variant === "unified" ? " rf-unified" : ""}`}>
    <SiteHeader />{children}<ScrollReveal /><footer className="rf-footer">
      <div className="rf-container rf-footer-grid">
        <div>
          <Link aria-label="TNT — Trang chủ" className="rf-logo" href="/" />
          <p>Kiến tạo hạ tầng công nghệ<br />cho tăng trưởng doanh nghiệp.</p>
          <div className="rf-socials" aria-label="Trí Nghĩa Tech">
            <span>in</span>
            <span>f</span>
            <Icon name="monitor" size={18} />
          </div>
        </div>
        <div>
          <h2>Dịch vụ</h2>
          <Link href="/dich-vu/outsourcing">Gia công phần mềm</Link>
          <Link href="/dich-vu/outsourcing">Phát triển phần mềm theo yêu cầu</Link>
          <Link href="/dich-vu/body-shop">Cung ứng nhân lực CNTT</Link>
        </div>
        <div>
          <h2>Công ty</h2>
          <Link href="/du-an">Dự án</Link>
          <Link href="/kien-thuc/blog">Blog</Link>
          <Link href="/ve-tnt">Giới thiệu</Link>
          <Link href="/#contact">Liên hệ</Link>
        </div>
        <div>
          <h2>Liên hệ</h2>
          <p>
            <Icon name="building" /> TP. Hồ Chí Minh, Việt Nam</p>
          <p>
            <Icon name="call" /> +84 28 1234 5678</p>
          <p>
            <Icon name="message" /> info@tnt-tech.vn</p>
          <small>Thông tin theo bản thiết kế, cần TNT xác nhận.</small>
        </div>
      </div>
      <div className="rf-container rf-footer-bottom">
        <span>© 2025 TNT Trí Nghĩa Tech. All rights reserved.</span>
        <span>Chính sách bảo mật <i /> Điều khoản sử dụng <i /> Tuyển dụng</span>
      </div>
    </footer>
  </div>;
}

export function ReferenceImage({ src, alt, className = "" }: { src: string; alt: string; className?: string; }) {
  return <Image unoptimized className={className} src={src} alt={alt} width={1200} height={700} />;
}

export function ReferenceHeading({ eyebrow, children, description }: { eyebrow?: string; children: React.ReactNode; description?: string; }) {
  return <div className="rf-heading">
    <div>{eyebrow && <span className="rf-eyebrow">{eyebrow}</span>}<h2>{children}</h2>
    </div>{description && <p>{description}</p>}</div>;
}

export function ReferenceWave() { return <div className="rf-wave" aria-hidden="true" />; }

/** Decorative artwork extracted from the supplied reference, never a UI control. */
export function ReferenceGlyph({ name }: { name: string }) {
  return <svg aria-hidden="true" focusable="false" width={60} height={60} viewBox="0 0 100 100">
    <image href={`/images/reference/${name}.webp`} width={100} height={100} />
  </svg>;
}
