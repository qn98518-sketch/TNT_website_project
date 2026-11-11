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
  "arrowRight",
];

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
              <p className="hero-lede">{content.hero.summary}</p>
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
              title="Đánh giá nhu cầu ERP cho nhà máy"
              description="Chọn ưu tiên cần trao đổi để xác định nội dung khảo sát."
            />
          </div>
          <div aria-hidden="true" className="hero-bottom-glow" />
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">ĐIỂM CẦN NHÌN RÕ</span>
              <h2 className="section-title">
                Nhà máy đang mất kiểm soát
                <br />
                <span>ở khâu nào?</span>
              </h2>
              <p className="section-lede">
                Mỗi khâu có dữ liệu và người phụ trách khác nhau. Bắt đầu bằng
                cách nhận diện thông tin nào đang thiếu, trễ hoặc khó đối chiếu.
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

        <section className="section section-pale workflow-section">
          <div className="container">
            <div className="workflow-heading">
              <div>
                <span className="eyebrow">DỮ LIỆU KẾT NỐI</span>
                <h2 className="section-title">
                  Từ dữ liệu rời rạc
                  <br />
                  <span>đến vận hành liên thông.</span>
                </h2>
              </div>
              <p className="section-lede">
                Sơ đồ định hướng để trao đổi nghiệp vụ, không phải mô tả cam
                kết tính năng hay cấu hình đã được xác nhận.
              </p>
            </div>
            <div className="workflow-board">
              <div className="workflow-state workflow-state-before">
                <span className="workflow-state-label">HIỆN TRẠNG CẦN KHẢO SÁT</span>
                <div className="loose-data">
                  <span><Icon name="document" size={16} /> File theo dõi</span>
                  <span><Icon name="data" size={16} /> Thông tin phân tán</span>
                  <span><Icon name="chart" size={16} /> Báo cáo thủ công</span>
                </div>
                <p>Đối chiếu dữ liệu và điểm bàn giao giữa các bộ phận.</p>
              </div>
              <div aria-hidden="true" className="workflow-transition">
                <span><Icon name="arrowRight" size={25} /></span>
                <small>LÀM RÕ<br />ĐIỂM KẾT NỐI</small>
              </div>
              <div className="workflow-state workflow-state-after">
                <span className="workflow-state-label">CÁC ĐIỂM CẦN ĐỐI CHIẾU</span>
                <div className="workflow-nodes">
                  {content.workflow.map((label, index) => (
                    <div className="workflow-node" key={label}>
                      <span aria-hidden="true" className="workflow-node-icon">
                        <Icon name={workflowIcons[index] ?? "info"} size={17} />
                      </span>
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>
                <p>Luồng minh họa để cùng xem xét theo quy trình thực tế.</p>
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
                Phân loại yêu cầu giúp doanh nghiệp và đội triển khai thống
                nhất kỳ vọng, phạm vi và ưu tiên.
              </p>
            </div>
            <div className="fit-grid">
              <article className="fit-card fit-card-ready">
                <span aria-hidden="true" className="fit-icon">
                  <Icon name="tickCircle" size={21} />
                </span>
                <span className="fit-tag">01 / READY</span>
                <h3>Phù hợp</h3>
                <p>
                  Nhu cầu có thể đáp ứng theo chức năng hoặc cấu hình được xác
                  nhận trong phạm vi hiện có.
                </p>
              </article>
              <article className="fit-card fit-card-extend">
                <span aria-hidden="true" className="fit-icon">
                  <Icon name="setting" size={21} />
                </span>
                <span className="fit-tag">02 / EXTEND</span>
                <h3>Cần mở rộng</h3>
                <p>
                  Cần đánh giá thêm về nghiệp vụ, chi phí, mức độ ưu tiên và
                  khả năng bảo trì trước khi thống nhất.
                </p>
              </article>
              <article className="fit-card fit-card-out">
                <span aria-hidden="true" className="fit-icon">
                  <Icon name="closeCircle" size={21} />
                </span>
                <span className="fit-tag">03 / OUT OF SCOPE</span>
                <h3>Ngoài phạm vi</h3>
                <p>
                  Chưa nằm trong phương án đã thống nhất; cần trao đổi riêng
                  trước khi cam kết thực hiện.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="implementation-section">
          <div className="container implementation-layout">
            <div className="implementation-intro">
              <span className="eyebrow eyebrow-light">CÁCH TIẾP CẬN ĐỀ XUẤT</span>
              <h2 className="section-title">
                Từ tìm hiểu
                <br />
                đến thống nhất
                <br />
                <span>phương án.</span>
              </h2>
              <p>
                Các bước và hình thức triển khai cụ thể cần được TNT xác nhận
                theo nhu cầu của từng nhà máy.
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
                Nội dung dưới đây là định hướng trao đổi. Câu trả lời cuối cùng
                cần căn cứ vào phạm vi và thông tin được TNT xác nhận.
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
              title="Cùng đánh giá nhu cầu của nhà máy"
              description="Bắt đầu với vấn đề ưu tiên — phạm vi sẽ được làm rõ trong buổi trao đổi."
            />
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
