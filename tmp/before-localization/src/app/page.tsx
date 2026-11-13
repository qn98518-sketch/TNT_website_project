import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { ReferenceFrame, ReferenceGlyph, ReferenceHeading, ReferenceImage } from "@/components/reference-frame";
import { Icon, type IconName } from "@/components/ui/icon";
import { homePageContent } from "@/content/local-data";
import { HomeProjectShowcase } from "@/components/home-project-showcase";

export default function Home() {
  const content = homePageContent;
  return <ReferenceFrame>
    <main className="rf-home">
      <section className="rf-home-hero">
        <div className="rf-container">
          <div className="rf-home-hero-copy">
            <span className="rf-eyebrow">TECHNOLOGY ENGINEERING PARTNER</span>
            <h1>Kiến tạo công nghệ.<br />
              <em>Thúc đẩy tăng trưởng.</em>
            </h1>
            <p>{content.hero.summary}</p>
            <div className="rf-actions">
              <Link className="rf-button" href="#contact">Trao đổi dự án <Icon name="arrowRight" />
              </Link>
              <Link className="rf-button rf-outline" href="#solutions">Khám phá giải pháp</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="rf-numbers">
        <div className="rf-container">
          <ReferenceHeading eyebrow="NHỮNG CON SỐ BIẾT NÓI" description="Với nhiều năm kinh nghiệm trong lĩnh vực công nghệ, TNT luôn nỗ lực mang đến những giải pháp hiệu quả, đồng hành cùng hàng trăm doanh nghiệp trên hành trình chuyển đổi số và phát triển bền vững.">Năng lực được khẳng định<br />
            <em>qua từng dự án</em>
          </ReferenceHeading>
          <div className="rf-statistics">{content.statistics.map((s, i) => <article key={s.label}>
              <ReferenceGlyph name={`statistic-${i}`} />
            <div>
              <strong>{s.value}</strong>
              <h3>{s.label}</h3>
              <p>{s.description}</p>
            </div>
          </article>)}</div>
          <small className="rf-review">{content.statisticsNote}</small>
        </div>
      </section>
      <section className="rf-services" id="solutions">
        <div className="rf-container">
          <ReferenceHeading eyebrow="GIẢI PHÁP & DỊCH VỤ" description="Từ nền tảng quản trị doanh nghiệp TNM ERP đến các dịch vụ phát triển phần mềm, nhân lực và hạ tầng CNTT, đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số.">Công nghệ toàn diện<br />cho <em>doanh nghiệp</em>
          </ReferenceHeading>
          <div className="rf-erp-panel">
            <div className="rf-erp-copy">
              <span className="rf-pill">GIẢI PHÁP TRỌNG TÂM</span>
              <h2>TNM <em>ERP</em>
              </h2>
              <h3>Quản trị tập trung. Vận hành hiệu quả.</h3>
              <p>Kết nối dữ liệu, chuẩn hóa quy trình và hỗ trợ quản lý toàn diện các hoạt động của doanh nghiệp.</p>
              <Link className="rf-button" href="/dich-vu/erp">Khám phá TNM ERP <Icon name="arrowRight" />
              </Link>
            </div>
            <div className="rf-erp-visual">
              <ReferenceImage className="rf-erp-laptop" src="/images/reference/erp-laptop-v2.webp" alt="Máy tính hiển thị giao diện quản trị TNM ERP" />
              <ul className="rf-erp-modules" aria-label="7 phân hệ TNM ERP">
                {content.erpModules.map((module) => <li key={module.code}>
                  <Link className="rf-erp-module" href="/dich-vu/erp" aria-label={`Khám phá phân hệ ${module.label} — ${module.code}`}>
                    <span className="rf-erp-module-icon"><Icon name={module.icon as IconName} size={30} /></span>
                    <strong>{module.label}</strong>
                    <span className="rf-erp-module-code">{module.code}</span>
                    <Icon className="rf-erp-module-arrow" name="arrowRight" size={16} />
                  </Link>
                </li>)}
              </ul>
            </div>
          </div>
          <div className="rf-service-subheading">
            <h3>Các dịch vụ công nghệ khác</h3>
            <p>Cung cấp đa dạng dịch vụ CNTT, đáp ứng linh hoạt nhu cầu doanh nghiệp.</p>
          </div>
          <div className="rf-service-grid">{content.additionalServices.map((s, i) => <article key={s.title}>
            <ReferenceImage src={`/images/reference/service-${i}.webp`} alt="" />
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <Link href={s.href} aria-label={`Khám phá ${s.title}`}>
              <Icon name="arrowRight" />
            </Link>
          </article>)}</div>
        </div>
      </section>
      <section className="rf-reasons">
        <div className="rf-container rf-reasons-grid">
          <div>
            <span className="rf-eyebrow">LÝ DO LỰA CHỌN TNT</span>
            <h2>Vì sao doanh nghiệp<br />
              <em>chọn TNT</em>
            </h2>
            <p>Chúng tôi không chỉ cung cấp dịch vụ, mà còn đồng hành cùng doanh nghiệp trên hành trình tăng trưởng bền vững.</p>
          </div>{content.reasons.map((r, i) => <article key={r.title}>
            <ReferenceImage src={`/images/reference/reason-${i}-clear.webp`} alt="" />
            <h3>{r.title}</h3>
            <p>{r.description}</p>
          </article>)}</div>
      </section>
      <section className="rf-process">
        <div className="rf-container">
          <ReferenceHeading eyebrow="QUY TRÌNH TRIỂN KHAI" description="TNT áp dụng quy trình triển khai tinh gọn, linh hoạt và minh bạch, đảm bảo dự án được triển khai hiệu quả và phù hợp với từng doanh nghiệp.">Từ nhu cầu đến giá trị<br />trong <em>4 bước đơn giản</em>
          </ReferenceHeading>
          <ol className="rf-process-grid">{content.process.map((p, i) => <li key={p.title}>
            <b>0{i + 1}</b>
            <ReferenceImage src={`/images/reference/process-${i}.webp`} alt="" />
            <h3>{p.title}</h3>
            <p>{p.description}</p>{i < 3 && <Icon name="arrowRight" className="rf-step-arrow" />}</li>)}</ol>
          <div className="rf-values">{[["tickCircle", "Rõ ràng", "Quy trình minh bạch, mục tiêu cụ thể."], ["setting", "Linh hoạt", "Giải pháp phù hợp với từng doanh nghiệp."], ["chart", "Hiệu quả", "Tập trung vào kết quả và giá trị thực tế."]].map(([icon, title, text]) => <div key={title}>
            <Icon name={icon as IconName} />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>)}</div>
        </div>
      </section>
      <HomeProjectShowcase />
      <section className="rf-insights">
        <div className="rf-container">
          <ReferenceHeading eyebrow="GÓC NHÌN CÔNG NGHỆ" description="Khám phá những bài viết chuyên sâu, phân tích xu hướng công nghệ và kinh nghiệm thực tiễn từ đội ngũ chuyên gia TNT, đồng hành cùng doanh nghiệp trên hành trình chuyển đổi số.">Cập nhật xu hướng công nghệ<br />và <em>góc nhìn từ chuyên gia</em>
          </ReferenceHeading>
          <Link className="rf-all-posts" href="/kien-thuc/blog">Xem tất cả bài viết <Icon name="arrowRight" />
          </Link>
          <div className="rf-insight-grid">
            <article className="rf-feature-insight">
              <div>
                <span className="rf-pill">CHUYỂN ĐỔI SỐ</span>
                <h3>5 xu hướng công nghệ<br />sẽ định hình doanh nghiệp<br />trong 2025</h3>
                <p>Khám phá những xu hướng công nghệ quan trọng mà doanh nghiệp không thể bỏ qua trong năm tới.</p>
                <small>12/03/2025　 ·　5 phút đọc</small>
                <Link className="rf-button rf-outline" href="/kien-thuc/blog">Đọc bài viết <Icon name="arrowRight" />
                </Link>
              </div>
            </article>
            <div className="rf-small-insights">{content.featuredInsights.slice(1).map((a, i) => <article key={a.title}>
              <div>
                <span className="rf-pill">{i === 0 ? "HẠ TẦNG CNTT" : "BẢO MẬT"}</span>
                <h3>{a.title}</h3>
                <small>{i === 0 ? "08/03/2025" : "03/03/2025"}　·　{i + 3} phút đọc</small>
              </div>
              <ReferenceImage src={a.image} alt={a.imageAlt} />
              <Link href={a.href} aria-label={a.title}>
                <Icon name="arrowRight" />
              </Link>
            </article>)}</div>
          </div>
        </div>
      </section>
      <section className="rf-contact rf-home-contact">
        <div className="rf-container rf-contact-grid">
          <div className="rf-contact-copy">
            <span className="rf-eyebrow">LIÊN HỆ VỚI CHÚNG TÔI</span>
            <h2>Cùng nhau kiến tạo<br />
              <em>giải pháp phù hợp</em>
              <br />cho doanh nghiệp của bạn</h2>
            <p>Hãy chia sẻ nhu cầu của bạn, đội ngũ TNT sẽ liên hệ tư vấn trong thời gian sớm nhất.</p>
            <div className="rf-contact-benefits">
              <span>
                <Icon name="message" />Tư vấn chuyên sâu</span>
              <span>
                <Icon name="shield" />Bảo mật thông tin</span>
              <span>
                <Icon name="people" />Đồng hành lâu dài</span>
            </div>
          </div>
          <LeadForm context="general" submitLabel="Gửi yêu cầu tư vấn" title="Nhận tư vấn ngay" description="Điền thông tin để đội ngũ chuyên gia của TNT liên hệ với bạn." />
        </div>
      </section>
    </main>
  </ReferenceFrame>;
}
