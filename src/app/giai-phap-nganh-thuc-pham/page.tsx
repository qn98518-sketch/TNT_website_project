import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { ReferenceFrame, ReferenceImage } from "@/components/reference-frame";
import { Icon, type IconName } from "@/components/ui/icon";
import { articles, foodSolutionPageContent } from "@/content/local-data";
import { ArticleCards, WireframeHeading } from "@/components/wireframe-sections";
import { seafoodProject } from "@/content/seafood-project";
import { ResponsiveActions } from "@/components/responsive-actions";
import { Accordion } from "@/components/accordion";
import { createPageMetadata } from "@/lib/metadata";
import { FoodImplementationSection } from "@/components/food-implementation-section";
export async function generateMetadata() { return createPageMetadata({ title: "Giải pháp ERP ngành thực phẩm", description: "Cùng làm rõ nhu cầu quản lý nguyên vật liệu, kho, sản xuất, chất lượng và thành phẩm trong nhà máy thực phẩm.", path: "/giai-phap-nganh-thuc-pham" }); }
const challengeIcons: IconName[] = ["boxSearch", "timer", "money", "scan"];
const workflowIcons: IconName[] = ["layer", "box", "activity", "shield", "boxTick", "chart"];
const fitIcons: IconName[] = ["tickCircle", "setting", "closeSquare"];
const implementationIcons: IconName[] = ["search", "checklist", "taskSquare", "settings", "messageText"];
export default async function FoodSolutionPage() {
    const { t } = await getI18n();
    const content = foodSolutionPageContent;
    return <ReferenceFrame breadcrumbs={[{ label: "Giải pháp ERP ngành thực phẩm" }]}>
    <main className="rf-food">
      <section className="rf-food-hero">
        <div className="rf-food-scene" aria-hidden="true"/>
        <div className="rf-container rf-food-hero-grid">
          <div className="rf-food-hero-copy">
            <span className="rf-eyebrow">{t("GIẢI PHÁP ERP CHO DOANH NGHIỆP CHẾ BIẾN THỰC PHẨM")}</span>
            <h1>{t("Sản xuất bao nhiêu,")}<br />{t("hao hụt ở đâu,")}<br />{t("tồn kho thế nào?")}</h1>
            <h2>{t("Quản lý nhà máy bằng dữ liệu kết nối,")}<br />{t("thay vì những file rời rạc.")}</h2>
            <p>{t(content.hero.summary)}</p>
            <ResponsiveActions className="rf-actions">
              <Link className="rf-button" href="#food-contact">
                <Icon name="checklist"/>{t(" Đăng ký trao đổi cùng TNT ")}<Icon name="arrowRight"/>
              </Link>
              <Link className="rf-button rf-outline" href="#food-workflow">
                <Icon name="activity"/>{t(" Xem cách vận hành thực tế")}</Link>
            </ResponsiveActions>
          </div>
          <div className="rf-food-mobile-art" aria-hidden="true">
            <ReferenceImage src="/images/reference/food-tablet-clear.webp" alt={t("")}/>
          </div>
          <LeadForm context="food" idPrefix="food-hero-contact" submitLabel={t("Đăng ký đánh giá nhu cầu")} title={t("Đánh giá nhu cầu ERP cho nhà máy bạn")} description={t("Trao đổi với TNT để xác định chức năng phù hợp, các hạng mục cần điều chỉnh và hướng triển khai dự kiến.")}/>
        </div>
      </section>
      <section className="rf-food-challenges">
        <div className="rf-container">
          <h2 className="tnt-section-title">{t("Nhà máy đang mất kiểm soát ở khâu nào?")}</h2>
          <p>{t("Dữ liệu phân tán giữa mua hàng, kho, sản xuất và chất lượng khiến nhà máy")}<br />{t("khó nắm được tình hình thực tế, dễ phát sinh sai lệch và ảnh hưởng đến hiệu quả.")}</p>
          <div className="rf-food-card-grid">{t(content.challenges.map((c, i) => <article key={c.title}>
              <Icon className="rf-food-challenge-icon" name={challengeIcons[i]} size={64}/>
              <h3>{t(c.title)}</h3>
              <p>{t(c.description)}</p>
            </article>))}</div>
        </div>
      </section>
      <section className="rf-food-workflow" id="food-workflow">
        <div className="rf-container">
          <h2 className="tnt-section-title">{t("Từ dữ liệu rời rạc đến vận hành liên thông")}</h2>
          <p>{t("Kết nối dữ liệu xuyên suốt từ nguyên vật liệu đến thành phẩm, giúp nhà máy kiểm soát tốt hơn, làm việc chủ động và minh bạch hơn.")}</p>
          <div className="rf-workflow-states">
            <article>
              <h3>{t("Hiện trạng phổ biến")}</h3>
              <ul>{t(content.workflowContext.before.map(line => <li key={line}>{t(line)}</li>))}</ul>
            </article>
            <Icon name="arrowRight"/>
            <article>
              <h3>{t("Mô hình quản lý mục tiêu")}</h3>
              <ul>{t(content.workflowContext.after.map(line => <li key={line}>{t(line)}</li>))}</ul>
            </article>
          </div>
          <ol className="rf-workflow-nodes">{t(content.workflow.map((n, i) => <li key={n.title}>
              <Icon name={workflowIcons[i]}/>
              <h3>{t(n.title)}</h3>
              <p>{t(n.description)}</p>{t(i < 5 && <Icon className="rf-step-arrow" name="arrowRight"/>)}</li>))}</ol>
        </div>
      </section>
      <section className="rf-food-fit">
        <div className="rf-container">
          <div className="rf-food-fit-copy">
            <span className="rf-eyebrow">{t("FIT FIRST. CUSTOMIZE WITH PURPOSE.")}</span>
            <span className="rf-rule"/>
            <h2 className="tnt-section-title">{t("Có phải thay đổi toàn bộ")}<br />{t("cách nhà máy vận hành?")}</h2>
            <p>{t("Không. TNT không bắt đầu bằng việc yêu cầu doanh nghiệp thay đổi hoàn toàn quy trình. Chúng tôi tìm hiểu cách nhà máy đang vận hành, đối chiếu với nền tảng TNM và cùng bạn xác định phần nào có thể sử dụng, phần nào cần điều chỉnh và phần nào chưa nên đầu tư.")}</p>
            <ReferenceImage src="/images/reference/tnt-factory-consulting.webp" alt={t("Chuyên gia TNT cùng quản lý nhà máy trao đổi về giải pháp ERP")}/>
          </div>
          <div className="rf-fit-options">{t(content.fitStages.map((s, i) => <article key={s.label}>
              <span>
                <Icon name={fitIcons[i]}/>
              </span>
              <div>
                <h3>{t(s.label)}</h3>
                <p>{t(["Những nghiệp vụ TNM đã có thể áp dụng ngay hoặc chỉ cần cấu hình.", "Những nghiệp vụ cần mở rộng, tích hợp hoặc điều chỉnh để phù hợp với quy trình của nhà máy.", "Những hạng mục chưa nằm trong phạm vi và ngân sách đề xuất, để doanh nghiệp cân nhắc ở giai đoạn phù hợp."][i])}</p>
              </div>
              <div>
                <b>{t("Ví dụ")}</b>
                <p>{t(["Mua hàng, quản lý kho, bán hàng, báo cáo quản trị.", "Định mức và hao hụt, kiểm soát chất lượng, quản lý theo lô.", "Các yêu cầu đặc thù chưa đủ thông tin để đánh giá."][i])}</p>
              </div>
            </article>))}<strong className="rf-fit-conclusion">
              <Icon name="scan"/>{t(" Rõ chức năng. Rõ phần cần làm. Rõ phạm vi đầu tư.")}</strong>
          </div>
        </div>
      </section>
      <section className="rf-food-partnership">
        <div className="rf-container">
          <h2 className="tnt-section-title">{t("Vì sao doanh nghiệp làm việc với TNT?")}</h2>
          <p>{t("TNT không chỉ cung cấp phần mềm, mà còn là đối tác tư vấn và triển khai giải pháp phù hợp với đặc thù vận hành của từng doanh nghiệp.")}</p>
          <div className="rf-food-card-grid">{t(content.partnership.map((p, i) => <article key={p.title}>
              <span className="rf-food-partnership-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t(p.title)}</h3>
              <p>{t(p.description)}</p>
            </article>))}</div>
          <article className="rf-food-project">
            <ReferenceImage src={content.projectDisclosure.image} alt={t(content.projectDisclosure.imageAlt)}/>
            <div>
              <span className="rf-pill">{t("Case study mô phỏng")}</span>
              <h3>{t(content.projectDisclosure.title)}</h3>
              <p>{t(content.projectDisclosure.summary)}</p>

              <Link href={`/du-an/${seafoodProject.slug}`}>{t("Xem chi tiết dự án ")}<Icon name="arrowRight"/>
              </Link>
            </div>
          </article>
        </div>
      </section>
      <FoodImplementationSection>
        <div className="rf-container">
          <span className="rf-rule"/>
          <h2 className="tnt-section-title">{t("Quy trình đánh giá và triển khai")}</h2>
          <p>{t("Quy trình bài bản, minh bạch và bám sát thực tế vận hành của doanh nghiệp.")}</p>
          <ol className="rf-food-steps">{t(content.implementation.map((s, i) => <li key={s.title}>
              <Icon name={implementationIcons[i]} purpose="content" size={60}/>
              <h3>{t(s.title)}</h3>
              <p>{t(s.description)}</p>{t(i < 4 && <Icon className="rf-step-arrow" name="arrowRight"/>)}</li>))}</ol>
        </div>
      </FoodImplementationSection>
      <section className="wf-section wf-related-articles"><div className="rf-container">
        <WireframeHeading eyebrow="ĐỌC TIẾP" title="Bài viết liên quan" description="Những nội dung có thể bạn quan tâm." />
        <ArticleCards articles={articles.filter(article => ['quan-ly-kho', 'erp-du-lieu'].includes(article.slug))} />
      </div></section>
      <section className="rf-food-faq">
        <div className="rf-container">
          <div>
            <h2 className="tnt-section-title">{t("Câu hỏi thường gặp")}</h2>
            <div className="rf-faq-list">{content.faqs.map(f => <Accordion key={f.id} question={t(f.question)}><p>{t(f.answer)}</p></Accordion>)}</div>
          </div>
          <div id="food-contact">
            <LeadForm context="food" idPrefix="food-follow-up-contact" submitLabel={t("Nhận tư vấn ngay")} title={t("Bắt đầu từ bài toán vận hành của nhà máy bạn.")} description={t("Đăng ký tư vấn để đội ngũ TNT cùng bạn đánh giá nhu cầu, gợi ý phạm vi triển khai phù hợp và lộ trình thực hiện.")}/>
          </div>
        </div>
      </section>
    </main>
  </ReferenceFrame>;
}
