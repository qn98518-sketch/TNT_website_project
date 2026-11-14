"use client";
import { useI18n } from "@/i18n/provider";
import { useRef, useState, type FormEvent } from "react";
import { validateLeadSubmission, type LeadContext, type LeadSubmission } from "@/server/leads/contract";
import { contextDetailKeys, detailLabels, detailOptions, interestsFor } from "@/lib/lead-options";
import { Icon } from "@/components/ui/icon";
import { SelectBox } from "@/components/select-box";

type LeadFormProps = { context: "general" | "food"; leadContext?: LeadContext; pagePath?: string; title?: string; description?: string; idPrefix?: string; submitLabel?: string };
type Status = { state: "idle" | "submitting" | "success" } | { state: "error"; message: string; fields?: Record<string, string> };
export function LeadForm({ context, leadContext = context === "food" ? "food-processing" : "general", pagePath = "/", title = "Cùng trao đổi về bài toán của bạn", description = "Chia sẻ nhu cầu để xác định hướng trao đổi phù hợp.", idPrefix = "contact", submitLabel = "Gửi yêu cầu" }: LeadFormProps) {
  const { t } = useI18n();
  const isFoodForm = context === "food";
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const submissionRef = useRef<{ body: string; key: string } | null>(null);
  const submitting = useRef(false);
  const fields = status.state === "error" ? status.fields ?? {} : {};
  const id = (name: string) => `${idPrefix}-${name}`;
  function error(name: string) { return fields[name] ? <span className="form-input-error" id={`${id(name)}-error`}>{t(fields[name])}</span> : null; }
  function invalid(name: string) { return { "aria-invalid": Boolean(fields[name]) || undefined, "aria-describedby": fields[name] ? `${id(name)}-error` : undefined }; }
  function showErrors(form: HTMLFormElement, message: string, errors: Record<string, string> = {}) {
    setStatus({ state: "error", message, fields: errors });
    requestAnimationFrame(() => {
      const first = Object.keys(errors)[0];
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    });
  }
  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitting.current) return;
    const form = event.currentTarget, data = new FormData(form);
    const submission: LeadSubmission = {
      name: String(data.get("name") ?? ""), emailOrPhone: String(data.get("emailOrPhone") ?? ""), company: String(data.get("company") ?? ""),
      interest: String(data.get("interest") ?? ""), industry: String(data.get("industry") ?? ""), companySize: String(data.get("companySize") ?? ""), message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on", context: leadContext, source: window.location.pathname || pagePath,
      details: Object.fromEntries(Object.keys(detailOptions).map(key => [key, String(data.get(key) ?? "")]).filter(([, value]) => value !== "")),
    };
    const validation = validateLeadSubmission(submission);
    if (!validation.success) { showErrors(form, "Vui lòng kiểm tra lại thông tin.", validation.fieldErrors); return; }
    const body = JSON.stringify(validation.data);
    if (submissionRef.current?.body !== body) submissionRef.current = { body, key: crypto.randomUUID() };
    submitting.current = true; setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json", "X-Submission-Id": submissionRef.current.key }, body, signal: AbortSignal.timeout(16000) });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) {
        const errors = Object.fromEntries(Object.entries(result.error?.fields ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
        showErrors(form, typeof result.error?.message === "string" ? result.error.message : "Không thể gửi yêu cầu. Vui lòng thử lại sau.", errors);
        return;
      }
      setStatus({ state: "success" }); form.reset(); submissionRef.current = null;
    } catch { showErrors(form, "Không thể gửi yêu cầu. Vui lòng kiểm tra kết nối và thử lại."); }
    finally { submitting.current = false; }
  }
  function input(name: string, label: string, placeholder: string, maxLength: number, required = false, autoComplete?: string) {
    return <label htmlFor={id(name)}><span className="form-label">{t(label)}{required && <span className="required-mark"> *</span>}</span><input id={id(name)} name={name} autoComplete={autoComplete} maxLength={maxLength} placeholder={t(placeholder)} required={required} {...invalid(name)} />{error(name)}</label>;
  }
  function select(name: string, label: string, options: readonly string[], required = false) {
    return <div className="form-select-field" key={name}><label className="form-label" htmlFor={id(name)}>{t(label)}{required && <span className="required-mark"> *</span>}</label><SelectBox id={id(name)} name={name} required={required} disabled={status.state === "submitting"} label={t(label)} errorMessage={fields[name]} options={[{ value: "", label: t(required ? "Chọn một nội dung" : "Chọn nội dung (không bắt buộc)"), disabled: required }, ...options.map(value => ({ value, label: t(value) }))]} /></div>;
  }
  return <section aria-labelledby={`${idPrefix}-title`} className="lead-card" id={idPrefix}>
    <div className="lead-card-heading"><span className="eyebrow">{t("KẾT NỐI VỚI TNT")}</span><h3 id={`${idPrefix}-title`}>{t(title)}</h3><p>{t(description)}</p></div>
    <form className="lead-form" noValidate onSubmit={submitLead}>
      <fieldset disabled={status.state === "submitting"}><legend className="visually-hidden">{t("Thông tin liên hệ")}</legend>
        <div className="form-grid">
          {input("name", "Họ và tên", "Tên của bạn", 120, true, "name")}
          {input("company", "Công ty", "Tên doanh nghiệp", 160, true, "organization")}
          {input("emailOrPhone", "Email hoặc số điện thoại", "Email hoặc số điện thoại", 254, true, "email")}
          {select("interest", isFoodForm ? "Ưu tiên cần trao đổi" : "Lĩnh vực quan tâm", interestsFor(leadContext), true)}
          {contextDetailKeys[leadContext].filter(key => key !== "foodPriority").map(key => select(key, detailLabels[key], detailOptions[key]))}
          {!isFoodForm && <>
            {input("industry", "Ngành nghề", "Ngành nghề hoạt động", 160)}
            <div className="form-select-field"><label className="form-label" htmlFor={id("companySize")}>{t("Quy mô công ty")}</label><SelectBox id={id("companySize")} name="companySize" label={t("Quy mô công ty")} disabled={status.state === "submitting"} errorMessage={fields.companySize} options={[
              {value:"",label:t("Chọn quy mô (không bắt buộc)")}, {value:"1-50",label:t("1–50 nhân sự")}, {value:"51-200",label:t("51–200 nhân sự")}, {value:"201-500",label:t("201–500 nhân sự")}, {value:"500+",label:t("Trên 500 nhân sự")},
            ]} /></div>
            <label className="form-full" htmlFor={id("message")}><span className="form-label">{t("Nội dung cần trao đổi")}</span><textarea id={id("message")} name="message" maxLength={4000} placeholder={t("Mô tả ngắn về nhu cầu của bạn")} rows={4} {...invalid("message")} />{error("message")}</label>
          </>}
        </div>
        <label className="consent-label"><input id={id("consent")} name="consent" required type="checkbox" {...invalid("consent")} /><span>{t("Tôi đồng ý để TNT liên hệ về yêu cầu này.")}</span></label>{error("consent")}
        <button className="button button-primary" disabled={status.state === "submitting"} type="submit">{t(status.state === "submitting" ? "Đang gửi..." : submitLabel)} <Icon name="arrowUp" size={17} /></button>
        <p aria-live="polite" className={`form-feedback ${status.state === "error" ? "form-feedback-error" : status.state === "success" ? "form-feedback-success" : ""}`} role={status.state === "error" ? "alert" : "status"}>
          {status.state === "error" ? t(status.message) : status.state === "success" ? t("Yêu cầu đã được dịch vụ tiếp nhận xác nhận.") : ""}
        </p>
        {fields.form && <p className="form-input-error">{t(fields.form)}</p>}
      </fieldset>
    </form>
  </section>;
}
