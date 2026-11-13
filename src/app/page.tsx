import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { ReferenceFrame, ReferenceGlyph, ReferenceHeading, ReferenceImage } from "@/components/reference-frame";
import { Icon, type IconName } from "@/components/ui/icon";
import { homePageContent } from "@/content/local-data";
import { HomeProjectShowcase } from "@/components/home-project-showcase";
export default async function Home() {
    const { t } = await getI18n();
    const content = homePageContent;
    return <ReferenceFrame>
    <main className="rf-home">
      <section className="rf-home-hero">
        <div className="rf-container">
          <div className="rf-home-hero-copy">
            <span className="rf-eyebrow">{t("TECHNOLOGY ENGINEERING PARTNER")}</span>
            <h1>{t("Kiến tạo công nghệ.")}<br />
              <em>{t("Thúc đẩy tăng trưởng.")}</em>
            </h1>
            <p>{t(content.hero.summary)}</p>
            <div className="rf-actions">
              <Link className="rf-button" href="#contact">{t("Trao đổi dự án ")}<Icon name="arrowRight"/>
              </Link>
              <Link className="rf-button rf-outline" href="#solutions">{t("Khám phá giải pháp")}</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="rf-numbers">
        <div className="rf-container">
          <ReferenceHeading eyebrow={t("NHỮNG CON SỐ BIẾT NÓI")} description={t("Với nhiều năm kinh nghiệm trong lĩnh vực công nghệ, TNT luôn nỗ lực mang đến những giải pháp hiệu quả, đồng hành cùng hàng trăm doanh nghiệp trên hành trình chuyển đổi số và phát triển bền vững.")}>{t("Năng lực được khẳng định")}<br />
            <em>{t("qua từng dự án")}</em>
          </ReferenceHeading>
          <div className="rf-statistics">{t(content.statistics.map((s, i) => <article key={s.label}>
              <ReferenceGlyph name={`statistic-${i}`}/>
            <div>
              <strong>{t(s.value)}</strong>
              <h3>{t(s.label)}</h3>
              <p>{t(s.description)}</p>
            </div>
          </article>))}</div>
          <small className="rf-review">{t(content.statisticsNote)}</small>
        </div>
      </section>
      <section className="rf-services" id="solutions">
        <div className="rf-container">
          <ReferenceHeading eyebrow={t("GIẢI PHÁP & DỊCH VỤ")} description={t("Từ nền tảng quản trị doanh nghiệp TNM ERP đến các dịch vụ phát triển phần mềm, nhân lực và hạ tầng CNTT, đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số.")}>{t("Công nghệ toàn diện")}<br />{t("cho ")}<em>{t("doanh nghiệp")}</em>
          </ReferenceHeading>
          <div className="rf-erp-panel">
            <div className="rf-erp-copy">
              <span className="rf-pill">{t("GIẢI PHÁP TRỌNG TÂM")}</span>
              <h2>{t("TNM ")}<em>{t("ERP")}</em>
              </h2>
              <h3>{t("Quản trị tập trung. Vận hành hiệu quả.")}</h3>
              <p>{t("Kết nối dữ liệu, chuẩn hóa quy trình và hỗ trợ quản lý toàn diện các hoạt động của doanh nghiệp.")}</p>
              <Link className="rf-button" href="/dich-vu/erp">{t("Khám phá TNM ERP ")}<Icon name="arrowRight"/>
              </Link>
            </div>
            <div className="rf-erp-visual">
              <ReferenceImage className="rf-erp-laptop" src="/images/reference/erp-laptop-v2.webp" alt={t("Máy tính hiển thị giao diện quản trị TNM ERP")}/>
              <ul className="rf-erp-modules" aria-label={t("7 phân hệ TNM ERP")}>
                {t(content.erpModules.map((module) => <li key={module.code}>
                  <Link className="rf-erp-module" href="/dich-vu/erp" aria-label={t(`Khám phá phân hệ ${module.label} — ${module.code}`)}>
                    <span className="rf-erp-module-icon"><Icon name={module.icon as IconName} size={30}/></span>
                    <strong>{t(module.label)}</strong>
                    <span className="rf-erp-module-code">{t(module.code)}</span>
                    <Icon className="rf-erp-module-arrow" name="arrowRight" size={16}/>
                  </Link>
                </li>))}
              </ul>
            </div>
          </div>
          <div className="rf-service-subheading">
            <h3>{t("Các dịch vụ công nghệ khác")}</h3>
            <p>{t("Cung cấp đa dạng dịch vụ CNTT, đáp ứng linh hoạt nhu cầu doanh nghiệp.")}</p>
          </div>
          <div className="rf-service-grid">{t(content.additionalServices.map((s, i) => <article key={s.title}>
            <ReferenceImage src={`/images/reference/service-${i}.webp`} alt={t("")}/>
            <h3>{t(s.title)}</h3>
            <p>{t(s.description)}</p>
            <Link href={s.href} aria-label={t(`Khám phá ${s.title}`)}>
              <Icon name="arrowRight"/>
            </Link>
          </article>))}</div>
        </div>
      </section>
      <section className="rf-reasons">
        <div className="rf-container rf-reasons-grid">
          <div>
            <span className="rf-eyebrow">{t("LÝ DO LỰA CHỌN TNT")}</span>
            <h2>{t("Vì sao doanh nghiệp")}<br />
              <em>{t("chọn TNT")}</em>
            </h2>
            <p>{t("Chúng tôi không chỉ cung cấp dịch vụ, mà còn đồng hành cùng doanh nghiệp trên hành trình tăng trưởng bền vững.")}</p>
          </div>{t(content.reasons.map((r, i) => <article key={r.title}>
            <ReferenceImage src={`/images/reference/reason-${i}-clear.webp`} alt={t("")}/>
            <h3>{t(r.title)}</h3>
            <p>{t(r.description)}</p>
          </article>))}</div>
      </section>
      <section className="rf-process">
        <div className="rf-container">
          <ReferenceHeading eyebrow={t("QUY TRÌNH TRIỂN KHAI")} description={t("TNT áp dụng quy trình triển khai tinh gọn, linh hoạt và minh bạch, đảm bảo dự án được triển khai hiệu quả và phù hợp với từng doanh nghiệp.")}>{t("Từ nhu cầu đến giá trị")}<br />{t("trong ")}<em>{t("4 bước đơn giản")}</em>
          </ReferenceHeading>
          <ol className="rf-process-grid">{t(content.process.map((p, i) => <li key={p.title}>
            <b>{t("0")}{t(i + 1)}</b>
            <ReferenceImage src={`/images/reference/process-${i}.webp`} alt={t("")}/>
            <h3>{t(p.title)}</h3>
            <p>{t(p.description)}</p>{t(i < 3 && <Icon name="arrowRight" className="rf-step-arrow"/>)}</li>))}</ol>
          <div className="rf-values">{t([["tickCircle", "Rõ ràng", "Quy trình minh bạch, mục tiêu cụ thể."], ["setting", "Linh hoạt", "Giải pháp phù hợp với từng doanh nghiệp."], ["chart", "Hiệu quả", "Tập trung vào kết quả và giá trị thực tế."]].map(([icon, title, text]) => <div key={title}>
            <Icon name={icon as IconName}/>
            <div>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </div>
          </div>))}</div>
        </div>
      </section>
      <HomeProjectShowcase />
      <section className="rf-insights">
        <div className="rf-container">
          <ReferenceHeading eyebrow={t("GÓC NHÌN CÔNG NGHỆ")} description={t("Khám phá những bài viết chuyên sâu, phân tích xu hướng công nghệ và kinh nghiệm thực tiễn từ đội ngũ chuyên gia TNT, đồng hành cùng doanh nghiệp trên hành trình chuyển đổi số.")}>{t("Cập nhật xu hướng công nghệ")}<br />{t("và ")}<em>{t("góc nhìn từ chuyên gia")}</em>
          </ReferenceHeading>
          <Link className="rf-all-posts" href="/kien-thuc/blog">{t("Xem tất cả bài viết ")}<Icon name="arrowRight"/>
          </Link>
          <div className="rf-insight-grid">
            <article className="rf-feature-insight">
              <div>
                <span className="rf-pill">{t("CHUYỂN ĐỔI SỐ")}</span>
                <h3>{t("5 xu hướng công nghệ")}<br />{t("sẽ định hình doanh nghiệp")}<br />{t("trong 2025")}</h3>
                <p>{t("Khám phá những xu hướng công nghệ quan trọng mà doanh nghiệp không thể bỏ qua trong năm tới.")}</p>
                <small>{t("12/03/2025　 ·　5 phút đọc")}</small>
                <Link className="rf-button rf-outline" href="/kien-thuc/blog">{t("Đọc bài viết ")}<Icon name="arrowRight"/>
                </Link>
              </div>
            </article>
            <div className="rf-small-insights">{t(content.featuredInsights.slice(1).map((a, i) => <article key={a.title}>
              <div>
                <span className="rf-pill">{t(i === 0 ? "HẠ TẦNG CNTT" : "BẢO MẬT")}</span>
                <h3>{t(a.title)}</h3>
                <small>{t(i === 0 ? "08/03/2025" : "03/03/2025")}{t("　·　")}{t(i + 3)}{t(" phút đọc")}</small>
              </div>
              <ReferenceImage src={a.image} alt={t(a.imageAlt)}/>
              <Link href={a.href} aria-label={t(a.title)}>
                <Icon name="arrowRight"/>
              </Link>
            </article>))}</div>
          </div>
        </div>
      </section>
      <section className="rf-contact rf-home-contact">
        <div className="rf-container rf-contact-grid">
          <div className="rf-contact-copy">
            <span className="rf-eyebrow">{t("LIÊN HỆ VỚI CHÚNG TÔI")}</span>
            <h2>{t("Cùng nhau kiến tạo")}<br />
              <em>{t("giải pháp phù hợp")}</em>
              <br />{t("cho doanh nghiệp của bạn")}</h2>
            <p>{t("Hãy chia sẻ nhu cầu của bạn, đội ngũ TNT sẽ liên hệ tư vấn trong thời gian sớm nhất.")}</p>
            <div className="rf-contact-benefits">
              <span>
                <Icon name="message"/>{t("Tư vấn chuyên sâu")}</span>
              <span>
                <Icon name="shield"/>{t("Bảo mật thông tin")}</span>
              <span>
                <Icon name="people"/>{t("Đồng hành lâu dài")}</span>
            </div>
          </div>
          <LeadForm context="general" submitLabel={t("Gửi yêu cầu tư vấn")} title={t("Nhận tư vấn ngay")} description={t("Điền thông tin để đội ngũ chuyên gia của TNT liên hệ với bạn.")}/>
        </div>
      </section>
    </main>
  </ReferenceFrame>;
}
