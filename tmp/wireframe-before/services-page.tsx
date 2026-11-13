import { getI18n } from "@/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { ContentPageShell } from "@/components/content-page";
import { LeadForm } from "@/components/lead-form";
import { Icon } from "@/components/ui/icon";
import { projectRepository, serviceRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";
export async function generateMetadata() { return createPageMetadata({
    title: "Dịch vụ",
    description: "Tìm hiểu các hướng dịch vụ ERP, phát triển phần mềm và nhân lực công nghệ của TNT.",
    path: "/dich-vu",
}); }
const serviceIcons = ["box", "code", "people"] as const;
const advantageIcons = ["briefcase", "data", "setting", "people"] as const;
const advantages = [
    { title: "Tập trung nghiệp vụ", description: "Ưu tiên nhu cầu vận hành." },
    { title: "Giải pháp kết nối", description: "Tổ chức dữ liệu đồng nhất." },
    { title: "Linh hoạt triển khai", description: "Cấu hình theo phạm vi." },
    { title: "Đồng hành cùng bạn", description: "Từ tư vấn đến hỗ trợ." },
];
const process = [
    { title: "Tiếp nhận", description: "Lắng nghe nhu cầu và hiện trạng." },
    { title: "Tư vấn", description: "Phân tích phương án phù hợp." },
    { title: "Triển khai", description: "Phối hợp thực hiện theo kế hoạch." },
    { title: "Đồng hành", description: "Bàn giao và hỗ trợ vận hành." },
];
export default async function ServicesPage() {
    const { t } = await getI18n();
    const [services, projects] = await Promise.all([
        serviceRepository.listPublished(),
        projectRepository.listForPreview(),
    ]);
    return (<ContentPageShell action={{ href: "#services", label: "Khám phá dịch vụ" }} description={t("Từ hệ thống ERP đến phát triển phần mềm và cung ứng nhân lực CNTT, TNT đồng hành cùng doanh nghiệp ở từng giai đoạn chuyển đổi.")} eyebrow={t("DỊCH VỤ CÔNG NGHỆ TNT")} highlightedTitle={t("Đồng hành cùng tăng trưởng.")} title={t("Giải pháp đúng nhu cầu.")}>
      <section className="section" id="services">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">{t("GIẢI PHÁP & DỊCH VỤ")}</span>
            <h2 className="section-title">{t("Công nghệ toàn diện")}<br />
              <span>{t("cho doanh nghiệp")}</span>
            </h2>
            <p className="section-lede">{t("Ba nhóm dịch vụ cốt lõi được thiết kế xoay quanh nhu cầu vận hành và phát triển hệ thống.")}</p>
          </div>
          <div className="service-overview-grid">
            {t(services.map((service, index) => (<article className="service-overview-card" key={service.slug}>
                <span className="service-overview-icon">
                  <Icon name={serviceIcons[index] ?? "box"} size={24}/>
                </span>
                <h3>{t(service.title)}</h3>
                <p>{t(service.summary)}</p>
                <Link className="text-link" href={service.href}>{t("Khám phá dịch vụ ")}<Icon name="arrowRight" size={16}/>
                </Link>
              </article>)))}
          </div>
        </div>
      </section>

      <section className="section section-pale">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">{t("VÌ SAO TNT?")}</span>
            <h2 className="section-title">{t("Hiểu bài toán.")}<br />
              <span>{t("Thiết kế giải pháp phù hợp.")}</span>
            </h2>
            <p className="section-lede">{t("Đội ngũ hướng tới việc giải quyết đúng vấn đề và triển khai phù hợp với quy trình thực tế của doanh nghiệp.")}</p>
          </div>
          <div className="service-advantage-grid">
            {t(advantages.map((advantage, index) => (<article className="service-advantage-card" key={advantage.title}>
                <span aria-hidden="true">
                  <Icon name={advantageIcons[index] ?? "info"} size={22}/>
                </span>
                <h3>{t(advantage.title)}</h3>
                <p>{t(advantage.description)}</p>
              </article>)))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">{t("DỰ ÁN THAM KHẢO · MẪU DEMO")}</span>
            <h2 className="section-title">{t("Năng lực được thể hiện")}<br />
              <span>{t("qua dự án tham khảo")}</span>
            </h2>
            <p className="section-lede">{t("Nội dung minh họa cách trình bày bài toán công nghệ và vận hành; không xác nhận đây là các dự án TNT đã thực hiện.")}</p>
          </div>
          <div className="service-proof-grid">
            {t(projects.slice(0, 3).map((project) => {
            if (!project.image || !project.imageAlt) {
                throw new Error(`Missing project image for "${project.slug}".`);
            }
            return (<article className="service-proof-card" key={project.slug}>
                  <Link href={`/du-an/${project.slug}`} className="service-proof-image">
                    <Image src={project.image} alt={t(project.imageAlt)} width={720} height={450} sizes="(max-width: 760px) 100vw, 33vw"/>
                  </Link>
                  <div className="service-proof-copy">
                    <span className="sample-label">{t(project.sourceLabel)}</span>
                    <div className="service-proof-meta">
                      {t(project.service)} <span>{t("·")}</span> {t(project.industry)}
                    </div>
                    <h3>
                      <Link href={`/du-an/${project.slug}`}>{t(project.title)}</Link>
                    </h3>
                    <p>{t(project.summary)}</p>
                    <Link className="text-link" href={`/du-an/${project.slug}`}>{t("Xem câu chuyện dự án ")}<Icon name="arrowRight" size={16}/>
                    </Link>
                  </div>
                </article>);
        }))}
          </div>
          <div className="service-overview-more">
            <Link className="button button-outline" href="/du-an">{t("Xem tất cả dự án ")}<Icon name="arrowRight" size={16}/>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-pale">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">{t("QUY TRÌNH HỢP TÁC")}</span>
            <h2 className="section-title">{t("Từ nhu cầu đến")}<br />
              <span>{t("giải pháp phù hợp")}</span>
            </h2>
            <p className="section-lede">{t("Cấu trúc quy trình minh họa để làm rõ cách TNT và doanh nghiệp phối hợp.")}</p>
          </div>
          <ol className="service-step-grid">
            {t(process.map((step, index) => (<li className="service-step-card" key={step.title}>
                <span className="service-step-number">
                  {t(String(index + 1).padStart(2, "0"))}
                </span>
                <h3>{t(step.title)}</h3>
                <p>{t(step.description)}</p>
              </li>)))}
          </ol>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container">
          <LeadForm context="general" title={t("Cùng nhau kiến tạo giải pháp phù hợp")} description={t("Chia sẻ bài toán vận hành. TNT sẽ cùng bạn tìm hướng tiếp cận phù hợp.")} pagePath="/dich-vu" idPrefix="services-contact"/>
        </div>
      </section>
    </ContentPageShell>);
}
