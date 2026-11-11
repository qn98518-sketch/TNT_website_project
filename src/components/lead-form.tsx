"use client";

import { useState, type FormEvent } from "react";
import type { LeadContext, LeadSubmission } from "@/server/leads/contract";
import { Icon } from "@/components/ui/icon";

type LeadFormProps = {
  context: "general" | "food";
  leadContext?: LeadContext;
  pagePath?: string;
  title?: string;
  description?: string;
  idPrefix?: string;
};

export function LeadForm({
  context,
  leadContext = context === "food" ? "food-processing" : "general",
  pagePath = context === "food" ? "/giai-phap-nganh-thuc-pham" : "/",
  title = "Cùng trao đổi về bài toán của bạn",
  description = "Chia sẻ nhu cầu để xác định hướng trao đổi phù hợp.",
  idPrefix = "contact",
}: LeadFormProps) {
  const isFoodForm = context === "food";
  const serviceOptions =
    leadContext === "erp"
      ? ["TNM ERP"]
      : leadContext === "outsourcing"
        ? ["Phát triển phần mềm"]
        : leadContext === "body-shop"
          ? ["Nhân lực công nghệ"]
          : ["TNM ERP", "Phát triển phần mềm", "Nhân lực công nghệ", "Khác"];
  const detailFields =
    leadContext === "erp"
      ? [
          {
            name: "erpNeed",
            label: "Nhu cầu ERP",
            options: [
              "Đánh giá mức độ phù hợp",
              "Kết nối dữ liệu",
              "Làm rõ phạm vi mở rộng",
              "Khác",
            ],
          },
        ]
      : leadContext === "outsourcing"
        ? [
            {
              name: "projectType",
              label: "Loại dự án",
              options: [
                "Phần mềm mới",
                "Mở rộng hệ thống hiện có",
                "Tích hợp hệ thống",
                "Khác",
              ],
            },
            {
              name: "estimatedTiming",
              label: "Thời điểm dự kiến",
              options: [
                "Đang tìm hiểu",
                "Trong 1–3 tháng",
                "Sau 3 tháng",
                "Chưa xác định",
              ],
            },
          ]
        : leadContext === "body-shop"
          ? [
              {
                name: "role",
                label: "Vai trò cần trao đổi",
                options: ["Developer", "QA / Tester", "Business Analyst", "Khác"],
              },
              {
                name: "headcount",
                label: "Số lượng dự kiến",
                options: ["1", "2–3", "4–5", "Chưa xác định"],
              },
            ]
          : [];
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "submitting" }
    | { state: "success" }
    | { state: "error"; message: string; fields?: Record<string, string> }
  >({ state: "idle" });

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ state: "submitting" });

    const formData = new FormData(form);
    const submission: LeadSubmission = {
      name: String(formData.get("name") ?? ""),
      emailOrPhone: String(formData.get("emailOrPhone") ?? ""),
      company: String(formData.get("company") ?? ""),
      interest: String(formData.get("interest") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      companySize: String(formData.get("companySize") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: formData.get("consent") === "on",
      context: leadContext,
      source: pagePath,
      details: Object.fromEntries(
        ["erpNeed", "projectType", "estimatedTiming", "role", "headcount", "foodPriority"]
          .map((key) => [key, String(formData.get(key) ?? "")])
          .filter(([, value]) => value !== ""),
      ),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const errorResult =
          typeof result === "object" && result !== null && "error" in result
            ? result.error
            : null;
        const message =
          typeof errorResult === "object" &&
          errorResult !== null &&
          "message" in errorResult &&
          typeof errorResult.message === "string"
            ? errorResult.message
            : "Không thể gửi yêu cầu. Vui lòng thử lại sau.";
        const fields =
          typeof errorResult === "object" &&
          errorResult !== null &&
          "fields" in errorResult &&
          typeof errorResult.fields === "object" &&
          errorResult.fields !== null
            ? Object.fromEntries(
                Object.entries(errorResult.fields).filter(
                  ([, value]) => typeof value === "string",
                ),
              )
            : undefined;

        setStatus({ state: "error", message, fields });
        return;
      }

      setStatus({ state: "success" });
      form.reset();
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? `Không thể hoàn tất yêu cầu: ${error.message}`
            : "Không thể hoàn tất yêu cầu. Yêu cầu chưa được xác nhận.",
      });
    }
  }

  return (
    <section
      aria-labelledby={`${idPrefix}-title`}
      className="lead-card"
      id={idPrefix}
    >
      <div className="lead-card-heading">
        <span className="eyebrow">KẾT NỐI VỚI TNT</span>
        <h2 id={`${idPrefix}-title`}>{title}</h2>
        <p>{description}</p>
      </div>

      <p className="form-notice" id={`${idPrefix}-notice`} role="note">
        Kênh tiếp nhận và nội dung quyền riêng tư đang chờ TNT xác nhận. Yêu cầu
        sẽ không được lưu khi chưa cấu hình dịch vụ gửi.
      </p>

      <form className="lead-form" onSubmit={submitLead}>
        <fieldset disabled={status.state === "submitting"}>
          <legend className="visually-hidden">Thông tin liên hệ</legend>
          <div className="form-grid">
            <label>
              <span className="form-label">
                Họ và tên <span className="required-mark">*</span>
              </span>
              <input autoComplete="name" name="name" placeholder="Tên của bạn" required />
            </label>
            <label>
              <span className="form-label">
                Công ty <span className="required-mark">*</span>
              </span>
              <input
                autoComplete="organization"
                name="company"
                placeholder="Tên doanh nghiệp"
                required
              />
            </label>
            <label>
              <span className="form-label">
                Email hoặc số điện thoại <span className="required-mark">*</span>
              </span>
              <input
                autoComplete="email"
                name="emailOrPhone"
                placeholder="Email hoặc số điện thoại"
                required
              />
            </label>
            <label>
              <span className="form-label">
                {isFoodForm ? "Ưu tiên cần trao đổi" : "Lĩnh vực quan tâm"}
              </span>
              <select defaultValue="" name="interest" required>
                <option disabled value="">
                  Chọn một nội dung
                </option>
                {(isFoodForm
                  ? [
                      "Nguyên vật liệu và tồn kho",
                      "Tiến độ sản xuất",
                      "Hao hụt và chi phí",
                      "Chất lượng và truy xuất lô",
                      "Chưa xác định",
                    ]
                  : serviceOptions
                ).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {detailFields.map((field) => (
              <label key={field.name}>
                <span className="form-label">{field.label}</span>
                <select defaultValue="" name={field.name}>
                  <option value="">Chọn nội dung (không bắt buộc)</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            {!isFoodForm && (
              <>
                <label>
                  <span className="form-label">Ngành nghề</span>
                  <input name="industry" placeholder="Ngành nghề hoạt động" />
                </label>
                <label>
                  <span className="form-label">Quy mô công ty</span>
                  <select defaultValue="" name="companySize">
                    <option value="">Chọn quy mô (không bắt buộc)</option>
                    <option value="1-50">1–50 nhân sự</option>
                    <option value="51-200">51–200 nhân sự</option>
                    <option value="201-500">201–500 nhân sự</option>
                    <option value="500+">Trên 500 nhân sự</option>
                  </select>
                </label>
                <label className="form-full">
                  <span className="form-label">Nội dung cần trao đổi</span>
                  <textarea
                    name="message"
                    placeholder="Mô tả ngắn về nhu cầu của bạn"
                    rows={4}
                  />
                </label>
              </>
            )}
          </div>
          <label className="consent-label">
            <input name="consent" required type="checkbox" />
            <span>
              Tôi đồng ý để TNT liên hệ về yêu cầu này. Nội dung xác nhận đang
              chờ TNT phê duyệt.
            </span>
          </label>
          <button
            className="button button-primary"
            disabled={status.state === "submitting"}
            type="submit"
          >
            {status.state === "submitting" ? "Đang gửi..." : "Gửi yêu cầu"}{" "}
            <Icon name="arrowUp" size={17} />
          </button>
          <p
            aria-live="polite"
            className={`form-feedback ${
              status.state === "error"
                ? "form-feedback-error"
                : status.state === "success"
                  ? "form-feedback-success"
                  : ""
            }`}
            role={status.state === "error" ? "alert" : "status"}
          >
            {status.state === "error" && status.message}
            {status.state === "success" &&
              "Yêu cầu đã được dịch vụ tiếp nhận xác nhận."}
          </p>
          {status.state === "error" &&
            status.fields &&
            Object.keys(status.fields).length > 0 && (
              <ul className="form-field-errors">
                {Object.entries(status.fields).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
        </fieldset>
      </form>
    </section>
  );
}
