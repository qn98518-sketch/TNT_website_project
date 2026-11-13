import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { ReferenceFrame, ReferenceImage } from "@/components/reference-frame";
import { Icon, type IconName } from "@/components/ui/icon";
import { aboutPageContent } from "@/content/local-data";
import { createPageMetadata } from "@/lib/metadata";
export async function generateMetadata() { return createPageMetadata({ title: "Về TNT", description: "Tìm hiểu cách TNT tiếp cận bài toán công nghệ: hiểu nghiệp vụ, xác định mức độ phù hợp và thống nhất phạm vi.", path: "/ve-tnt" }); }
export default async function AboutPage() {
    const { t } = await getI18n();
    const content = aboutPageContent;
    const methodIcons: IconName[] = ["diagram", "layer", "box"];
    return <ReferenceFrame>
    <main className="rf-about">
      <section className="rf-about-hero">
        <ReferenceImage src="/images/reference/about-factory-new.webp" mediaKind="background" alt={t("Nhân viên nhà máy kiểm tra chất lượng và dữ liệu trên dây chuyền đóng gói thực phẩm")}/>
        <div className="rf-about-hero-panel">
          <div>
            <h1>{t("Hiểu nghiệp vụ trước.")}<br />{t("Đề xuất giải pháp sau.")}</h1>
            <span className="rf-rule"/>
            <p>{t(content.hero.summary)}</p>
            <Link className="rf-button" href="/dich-vu/erp">{t("Khám phá giải pháp ERP ")}<Icon name="arrowRight"/>
            </Link>
          </div>
        </div>
      </section>
      <section className="rf-about-overview">
        <div className="rf-container">
          <div className="rf-overview-top">
            <div>
              <span className="rf-rule"/>
              <h2>{t("Công nghệ phục vụ nhu cầu")}<br />{t("vận hành thực tế")}</h2>{t(content.overview.paragraphs.map(p => <p key={p}>{t(p)}</p>))}</div>
            <ReferenceImage src="/images/reference/food-factory-clear.webp" alt={t("Nhân viên và dây chuyền nhà máy thực phẩm")}/>
          </div>
          <div className="rf-overview-bottom">
            <ReferenceImage src="/images/reference/tnt-factory-consulting.webp" alt={t("Tư vấn giải pháp tại nhà máy")}/>
            <div className="rf-mission">
              <article>
                <Icon name="scan"/>
                <h3>{t("Đối tác ERP đáng tin cậy")}</h3>
                <p>{t("Trở thành đối tác ERP đáng tin cậy của các doanh nghiệp chế biến thực phẩm tại Việt Nam.")}</p>
              </article>
              <article>
                <Icon name="diagram"/>
                <h3>{t("Giúp doanh nghiệp")}<br />{t("kiểm soát vận hành tốt hơn")}</h3>
                <p>{t("Giúp doanh nghiệp chế biến thực phẩm kiểm soát vận hành hiệu quả hơn thông qua giải pháp ERP phù hợp và dịch vụ tư vấn thực tiễn.")}</p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="rf-about-capabilities">
        <div className="rf-container">
          <div>
            <h2>{t("Tập trung vào nghiệp vụ")}<br />{t("ngành, phát triển giải pháp")}<br />{t("có thể tái sử dụng")}</h2>
            <span className="rf-rule"/>
          </div>
          <ul>{t(content.industryCapabilities.map(item => <li key={item.title}>
            <Icon name="tickCircle"/>
            <div>
              <h3>{t(item.title)}</h3>
              <p>{t(item.description)}</p>
            </div>
          </li>))}</ul>
        </div>
      </section>
      <section className="rf-about-method">
        <div className="rf-container">
          <span className="rf-rule"/>
          <h2>{t("FIT FIRST. CUSTOMIZE WITH PURPOSE.")}</h2>
          <p>{t("Ưu tiên sự phù hợp. Tùy chỉnh có mục đích.")}</p>
          <ol>{t(content.methodSteps.map((s, i) => <li key={s.english}>
            <span>
              <Icon name={methodIcons[i]}/>
            </span>
            <div>
              <h3>{t(s.english)}</h3>
              <p>{t(s.description)}</p>
            </div>{t(i < 2 && <Icon className="rf-step-arrow" name="arrowRight"/>)}</li>))}</ol>
        </div>
      </section>
      <section className="rf-about-stats">
        <div className="rf-container">
          <span className="rf-rule"/>
          <h2>{t("Năng lực triển khai")}</h2>
          <p>{t("Đội ngũ có kinh nghiệm triển khai các giải pháp quản trị doanh nghiệp, sẵn sàng đồng hành cùng bạn từ tư vấn, phát triển đến vận hành.")}</p>
          <div className="rf-about-stat-strip">{t(content.statistics.map(s => <div key={s.label}>
            <strong>{t(s.value)}</strong>
            <h3>{t(s.label)}</h3>
          </div>))}<p>
              <Icon name="info"/>{t("Số liệu cần được xác nhận")}<br />{t("và có thể cập nhật theo")}<br />{t("từng giai đoạn.")}</p>
          </div>
        </div>
      </section>
      <section className="rf-team">
        <div className="rf-container">
          <span className="rf-rule"/>
          <h2>{t("Đội ngũ lãnh đạo")}</h2>
          <p>{t("Những người dẫn dắt định hướng, phát triển giải pháp và đồng hành cùng khách hàng.")}</p>
          <div className="rf-team-grid">{t(content.teamRoles.map((r, i) => <article key={r.title}>
            <ReferenceImage src={`/images/reference/leader-${i + 1}.webp`} alt={t(r.imageAlt)}/>
            <div>
              <h3>{t(r.title)}</h3>
              <p>{t(r.description)}</p>
            </div>
          </article>))}</div>
          <small className="rf-review">{t("Thông tin nhân sự và hình ảnh là mẫu minh họa, cần TNT xác nhận.")}</small>
        </div>
      </section>
      <section className="rf-contact rf-about-contact" id="about-contact">
        <div className="rf-container rf-contact-grid">
          <div className="rf-contact-copy">
            <h2>{t("Chia sẻ vấn đề.")}<br />{t("Cùng xác định giải pháp")}<br />{t("phù hợp.")}</h2>
            <span className="rf-rule"/>
            <p>
              <Icon name="call"/>{t(" Hotline: 0889 889 788")}</p>
            <p>
              <Icon name="message"/>{t(" Email: info@tringhiatech.vn")}</p>
            <small>{t("Thông tin liên hệ theo bản thiết kế, cần TNT xác nhận.")}</small>
          </div>
          <LeadForm context="general" submitLabel={t("Gửi yêu cầu tư vấn")} pagePath="/ve-tnt" title={t("Gửi yêu cầu tư vấn")} description={t("Chia sẻ nhu cầu để TNT cùng xác định giải pháp phù hợp.")}/>
        </div>
      </section>
    </main>
  </ReferenceFrame>;
}
