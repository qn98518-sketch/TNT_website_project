import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { PageFrame } from "@/components/site-shell";
import { Icon, type IconName } from "@/components/ui/icon";
import { foodSolutionPageContent } from "@/content/local-data";
import { createPageMetadata } from "@/lib/metadata";

const challengeIcons: readonly IconName[] = [
  "box",
  "activity",
  "chart",
  "shield",
];
const workflowIcons: readonly IconName[] = [
  "box",
  "building",
  "activity",
  "tickCircle",
  "shoppingCart",
  "chart",
];
const implementationIcons: readonly IconName[] = [
  "search",
  "diagram",
  "checklist",
  "setting",
  "tickCircle",
];
const fitIcons: readonly IconName[] = ["tickCircle", "setting", "closeCircle"];
const partnershipIcons: readonly IconName[] = ["briefcase", "data", "checklist", "people"];

export const metadata = createPageMetadata({
  title: "Giải pháp ngành thực phẩm",
  description:
    "Cùng làm rõ nhu cầu quản lý nguyên vật liệu, kho, sản xuất, chất lượng và thành phẩm trong nhà máy thực phẩm.",
  path: "/giai-phap-nganh-thuc-pham",
});

export default function FoodSolutionPage() {
  const content = foodSolutionPageContent;

  return (
    <PageFrame>
      <main>
        <section className="food-hero">
          <div aria-hidden="true" className="food-hero-photo">
            <Image
              src={content.hero.image}
              alt=""
              fill
              priority
              sizes="(max-width: 860px) 100vw, 55vw"
            />
          </div>
          <div className="container food-hero-grid">
            <div className="food-hero-copy">
              <span className="eyebrow eyebrow-light">
                {content.hero.eyebrow} <span className="eyebrow-rule" />
              </span>
              <h1>
                {content.hero.title[0]}
                <br />
                {content.hero.title[1]}
                <br />
                <span>{content.hero.title[2]}</span>
              </h1>
              <p className="food-hero-subtitle">{content.hero.subtitle}</p>
              <p className="hero-lede">{content.hero.summary}</p>
              <div className="food-hero-actions">
                <Link className="button button-primary" href="#food-contact">
                  Đăng ký trao đổi cùng TNT <Icon name="arrowRight" size={16} />
                </Link>
                <Link className="button button-ghost" href="#food-workflow">
                  Xem cách vận hành thực tế <Icon name="arrowDown" size={16} />
                </Link>
              </div>
              <div className="food-hero-points">
                <span>Nguyên liệu</span>
                <i aria-hidden="true"><Icon name="arrowRight" size={15} /></i>
                <span>Sản xuất</span>
                <i aria-hidden="true"><Icon name="arrowRight" size={15} /></i>
                <span>Thành phẩm</span>
              </div>
            </div>
            <LeadForm
              context="food"
              idPrefix="food-hero-contact"
              title="Đánh giá nhu cầu ERP cho nhà máy bạn"
              description="Trao đổi với TNT để xác định chức năng phù hợp, các hạng mục cần điều chỉnh và hướng triển khai dự kiến."
            />
          </div>
          <div aria-hidden="true" className="hero-bottom-glow" />
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">BÀI TOÁN THỰC TẾ</span>
              <h2 className="section-title">
                Nhà máy đang mất kiểm soát
                <br />
                <span>ở khâu nào?</span>
              </h2>
              <p className="section-lede">
                Dữ liệu phân tán có thể khiến doanh nghiệp khó giám sát sản xuất,
                kiểm soát kho và phản ứng kịp thời.
              </p>
            </div>
            <div className="challenge-grid">
              {content.challenges.map((challenge, index) => (
                <article className="challenge-card" key={challenge.title}>
                  <span aria-hidden="true" className="challenge-icon">
                    <Icon name={challengeIcons[index] ?? "info"} size={22} />
                  </span>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  <span aria-hidden="true" className="challenge-corner">
                    <Icon name="arrowUp" size={16} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-pale workflow-section" id="food-workflow">
          <div className="container">
            <div className="workflow-heading">
              <div>
                <span className="eyebrow">LUỒNG VẬN HÀNH</span>
                <h2 className="section-title">
                  Từ dữ liệu rời rạc
                  <br />
                  <span>đến vận hành liên thông</span>
                </h2>
              </div>
              <p className="section-lede">
                Kết nối dữ liệu xuyên suốt từ nguyên vật liệu đến thành phẩm,
                giúp nhà máy chủ động và minh bạch hơn.
              </p>
            </div>
            <div className="workflow-board">
              <div className="workflow-state workflow-state-before">
                <span className="workflow-state-label">HIỆN TRẠNG PHỔ BIẾN</span>
                <ul className="workflow-context-list">
                  {content.workflowContext.before.map((item) => (
                    <li key={item}><Icon name="closeCircle" size={16} />{item}</li>
                  ))}
                </ul>
              </div>
              <div aria-hidden="true" className="workflow-transition">
                <span><Icon name="arrowRight" size={25} /></span>
                <small>LUỒNG DỮ LIỆU<br />KẾT NỐI</small>
              </div>
              <div className="workflow-state workflow-state-after">
                <span className="workflow-state-label">MÔ HÌNH QUẢN LÝ MỤC TIÊU</span>
                <ul className="workflow-context-list workflow-context-list-after">
                  {content.workflowContext.after.map((item) => (
                    <li key={item}><Icon name="tickCircle" size={16} />{item}</li>
                  ))}
                </ul>
                <div className="workflow-nodes">
                  {content.workflow.map((node, index) => (
                    <div className="workflow-node" key={node.title}>
                      <span aria-hidden="true" className="workflow-node-icon">
                        <Icon name={workflowIcons[index] ?? "info"} size={17} />
                      </span>
                      <strong>{node.title}</strong>
                      <span>{node.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">FIT FIRST. CUSTOMIZE WITH PURPOSE.</span>
              <h2 className="section-title">
                Rõ phần phù hợp.
                <br />
                <span>Rõ cả phần cần cân nhắc.</span>
              </h2>
              <p className="section-lede">
                Không. TNT tìm hiểu cách nhà máy đang vận hành, đối chiếu với nền
                tảng TNM và cùng doanh nghiệp xác định phần nào có thể sử dụng,
                phần nào cần điều chỉnh và phần nào chưa nên đầu tư.
              </p>
            </div>
            <div className="fit-grid">
              {content.fitStages.map((stage, index) => (
                <article
                  className={`fit-card fit-card-${["ready", "extend", "out"][index]}`}
                  key={stage.label}
                >
                  <span aria-hidden="true" className="fit-icon">
                    <Icon name={fitIcons[index] ?? "info"} size={21} />
                  </span>
                  <span className="fit-tag">0{index + 1} / {stage.label}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </article>
              ))}
            </div>
            <p className="fit-conclusion">Rõ chức năng. Rõ phần cần làm. Rõ phạm vi đầu tư.</p>
          </div>
        </section>

        <section className="section food-partnership-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">GIÁ TRỊ HỢP TÁC</span>
              <h2 className="section-title">
                Vì sao doanh nghiệp
                <br />
                <span>làm việc với TNT?</span>
              </h2>
              <p className="section-lede">
                Tập trung vào bài toán vận hành, khả năng phù hợp và lộ trình
                triển khai có thể kiểm soát.
              </p>
            </div>
            <div className="food-partnership-grid">
              {content.partnership.map((item, index) => (
                <article className="food-partnership-card" key={item.title}>
                  <span aria-hidden="true">
                    <Icon name={partnershipIcons[index] ?? "info"} size={23} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <article className="food-project-card">
              <Image
                src={content.projectDisclosure.image}
                alt={content.projectDisclosure.imageAlt}
                width={720}
                height={480}
                sizes="(max-width: 760px) 100vw, 48vw"
              />
              <div className="food-project-copy">
                <span className="eyebrow">DỰ ÁN THAM KHẢO · MẪU DEMO</span>
                <h3>{content.projectDisclosure.title}</h3>
                <p>{content.projectDisclosure.summary}</p>
                <Link className="text-link" href="/du-an/kala">
                  Xem dự án tham khảo <Icon name="arrowRight" size={16} />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="implementation-section">
          <div className="container implementation-layout">
            <div className="implementation-intro">
              <span className="eyebrow eyebrow-light">QUY TRÌNH LÀM VIỆC</span>
              <h2 className="section-title">
                Quy trình đánh giá
                <br />
                <span>và triển khai</span>
              </h2>
              <p>
                Quy trình bài bản, minh bạch từ bước tìm hiểu nhu cầu đến thống
                nhất phương án.
              </p>
            </div>
            <ol className="implementation-list">
              {content.implementation.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true" className="implementation-icon">
                    <Icon name={implementationIcons[index] ?? "info"} size={19} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section faq-section">
          <div className="container faq-layout">
            <div className="faq-intro">
              <span className="eyebrow">CÂU HỎI THƯỜNG GẶP</span>
              <h2 className="section-title">
                Cùng làm rõ
                <br />
                <span>trước khi bắt đầu.</span>
              </h2>
              <p>
                Một số vấn đề doanh nghiệp thường quan tâm trước khi quyết định
                triển khai giải pháp ERP.
              </p>
              <Link className="text-link" href="#food-contact">
                Trao đổi câu hỏi khác <Icon name="arrowDown" size={16} />
              </Link>
            </div>
            <div className="faq-list">
              {content.faqs.map((faq, index) => (
                <details className="faq-item" key={faq.id}>
                  <summary>
                    <span className="faq-index">0{index + 1}</span>
                    <span>{faq.question}</span>
                    <span aria-hidden="true" className="faq-toggle">
                      <Icon className="faq-toggle-closed" name="addCircle" size={19} />
                      <Icon className="faq-toggle-open" name="closeCircle" size={19} />
                    </span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="food-contact">
          <div className="container">
            <LeadForm
              context="food"
              idPrefix="food-follow-up-contact"
              title="Bắt đầu từ bài toán vận hành của nhà máy bạn."
              description="Đăng ký tư vấn để đội ngũ TNT cùng bạn đánh giá nhu cầu, gợi ý phạm vi triển khai phù hợp và lộ trình thực hiện."
            />
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
