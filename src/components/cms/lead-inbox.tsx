"use client";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { companySizes, contextDetailKeys, detailLabels, detailOptions, interestsFor, leadContextLabels, leadContexts } from "@/lib/lead-options";
import { validateLeadSubmission, type LeadContext, type LeadSubmission } from "@/server/leads/contract";
import { statuses, type CmsLead, type CmsUser } from "@/lib/cms-contract";
import { errorsFrom, type Api } from "./api";
import { Choice, ConfirmDelete, Field, Modal, Notice, Textarea, focusInvalid } from "./fields";

type Result = { items: CmsLead[]; total: number; page: number; perPage: number; stats: Partial<Record<keyof typeof statuses, number>> };
const refreshInterval = 3000;
const date = (value: string) => new Date(value).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
export function LeadInbox({ api, user }: { api: Api; user: CmsUser }) {
  const [filters,setFilters]=useState({q:"",context:"",status:"",from:"",to:"",page:1});
  const [result,setResult]=useState<Result>({items:[],total:0,page:1,perPage:15,stats:{}}), [loading,setLoading]=useState(true), [message,setMessage]=useState(""), [error,setError]=useState("");
  const [editing,setEditing]=useState<CmsLead | "new" | null>(null), [deleting,setDeleting]=useState<CmsLead | null>(null), [opening,setOpening]=useState(false);
  const canWrite=user.role!=="viewer";
  const activeRequest=useRef<AbortController | null>(null);
  const load=useCallback(async (signal?: AbortSignal, background=false) => {
    if(signal?.aborted||(background&&activeRequest.current))return;
    // A new filter or manual refresh takes priority over older responses.
    activeRequest.current?.abort();
    const controller=new AbortController();activeRequest.current=controller;
    const requestSignal=AbortSignal.any([controller.signal,AbortSignal.timeout(16000),...(signal?[signal]:[])]);
    if(!background)setLoading(true);
    const query=new URLSearchParams({...filters,page:String(filters.page),perPage:"15"});
    try { const data=await api<Result>(`leads?${query}`,"GET",undefined,requestSignal); if(!controller.signal.aborted&&!signal?.aborted){setResult(data);setError("");const last=Math.max(1,Math.ceil(data.total/data.perPage));if(filters.page>last)setFilters(current=>({...current,page:last}));} }
    catch(error){if(!controller.signal.aborted&&!signal?.aborted)setError(errorsFrom(error).message);}finally{if(activeRequest.current===controller){activeRequest.current=null;if(!controller.signal.aborted&&!signal?.aborted)setLoading(false);}}
  },[api,filters]);
  useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>void load(controller.signal),250);return()=>{clearTimeout(timer);controller.abort();};},[load]);
  useEffect(()=>{
    const controller=new AbortController();
    const refresh=()=>{if(document.visibilityState==="visible")void load(controller.signal,true);};
    const timer=setInterval(refresh,refreshInterval);
    document.addEventListener("visibilitychange",refresh);
    window.addEventListener("focus",refresh);
    window.addEventListener("online",refresh);
    return()=>{clearInterval(timer);controller.abort();document.removeEventListener("visibilitychange",refresh);window.removeEventListener("focus",refresh);window.removeEventListener("online",refresh);};
  },[load]);
  useEffect(()=>()=>activeRequest.current?.abort(),[]);
  function filter(key: keyof typeof filters,value: string){setFilters(current=>({...current,[key]:value,page:1}));}
  async function open(lead: CmsLead){setOpening(true);setError("");try{setEditing((await api<{lead:CmsLead}>(`leads/${lead.id}`)).lead);}catch(error){setError(errorsFrom(error).message);}finally{setOpening(false);}}
  const totalStats=Object.values(result.stats).reduce<number>((sum,n)=>sum+Number(n),0);
  return <>
    <div className="cms-page-heading cms-heading-actions"><div><span className="cms-eyebrow">KẾT NỐI KHÁCH HÀNG</span><h1>Yêu cầu từ biểu mẫu</h1><p>Tập trung thông tin từ tất cả trang và dịch vụ của TNT. Tự động cập nhật mỗi 3 giây.</p></div>{canWrite&&<button className="cms-button" onClick={()=>{setMessage("");setEditing("new");}}>+ Thêm yêu cầu</button>}</div>
    <div className="cms-stats" aria-label="Tổng quan yêu cầu">{[["Tổng yêu cầu",totalStats],["Mới tiếp nhận",Number(result.stats.new??0)],["Đang xử lý",Number(result.stats.in_progress??0)],["Hoàn tất",Number(result.stats.closed??0)]].map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <Notice message={message} success/><Notice message={error}/>
    <section className="cms-panel"><div className="cms-panel-title"><h3>Hộp thư yêu cầu</h3><button className="cms-button cms-secondary" onClick={()=>void load()} disabled={loading}>Làm mới</button></div>
      <form className="cms-filters" onSubmit={event=>{event.preventDefault();void load();}}>
        <Field label="Tìm kiếm" name="q" placeholder="Tên, công ty, email / điện thoại" type="search" maxLength={160} value={filters.q} onChange={event=>filter("q",event.target.value)}/>
        <Choice label="Biểu mẫu / dịch vụ" name="context" value={filters.context} onChange={event=>filter("context",event.target.value)}><option value="">Tất cả biểu mẫu</option>{leadContexts.map(value=><option value={value} key={value}>{leadContextLabels[value]}</option>)}</Choice>
        <Choice label="Trạng thái" name="status" value={filters.status} onChange={event=>filter("status",event.target.value)}><option value="">Tất cả trạng thái</option>{Object.entries(statuses).map(([value,label])=><option value={value} key={value}>{label}</option>)}</Choice>
        <Field label="Từ ngày (UTC)" name="from" type="date" max={filters.to||undefined} value={filters.from} onChange={event=>filter("from",event.target.value)}/>
        <Field label="Đến ngày (UTC)" name="to" type="date" min={filters.from||undefined} value={filters.to} onChange={event=>filter("to",event.target.value)}/>
      </form>
      <div className="cms-table-scroll" aria-busy={loading}><table className="cms-table"><thead><tr><th>Người liên hệ</th><th>Công ty / Nhu cầu</th><th>Nguồn biểu mẫu</th><th>Trạng thái</th><th>Tiếp nhận</th><th>Thao tác</th></tr></thead><tbody>
        {result.items.map(lead=><tr key={lead.id}><td><strong>{lead.name}</strong><span>{lead.emailOrPhone}</span></td><td><strong>{lead.company}</strong><span>{lead.interest}</span></td><td>{leadContextLabels[lead.context]}<small>{lead.source}</small></td><td><span className={`cms-badge cms-status-${lead.status}`}>{statuses[lead.status]}</span></td><td className="cms-nowrap">{date(lead.createdAt)}</td><td><div className="cms-row-actions"><button disabled={opening||loading} onClick={()=>void open(lead)}>{canWrite?"Xem / sửa":"Xem chi tiết"}</button>{canWrite&&<button className="cms-delete-link" disabled={loading} onClick={()=>setDeleting(lead)}>Xóa</button>}</div></td></tr>)}
        {!result.items.length&&<tr><td colSpan={6} className="cms-empty">{loading?"Đang tải yêu cầu…":error?"Không thể tải dữ liệu. Hãy thử làm mới.":"Chưa có yêu cầu phù hợp với bộ lọc."}</td></tr>}
      </tbody></table></div>
      <div className="cms-pagination"><span>{loading?"Đang tải…":`${result.total} yêu cầu phù hợp`}</span><div><button className="cms-button cms-secondary" disabled={loading||filters.page===1} onClick={()=>setFilters(current=>({...current,page:current.page-1}))}>Trước</button><span>Trang {filters.page} / {Math.max(1,Math.ceil(result.total/result.perPage))}</span><button className="cms-button cms-secondary" disabled={loading||filters.page*result.perPage>=result.total} onClick={()=>setFilters(current=>({...current,page:current.page+1}))}>Sau</button></div></div>
    </section>
    {editing&&<LeadEditor key={editing==="new"?"new":editing.id} api={api} lead={editing==="new"?undefined:editing} readOnly={!canWrite} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);setMessage("Đã lưu yêu cầu.");void load();}}/>}
    {deleting&&<ConfirmDelete title="Xóa yêu cầu?" description={`Xóa vĩnh viễn yêu cầu của ${deleting.name} (${deleting.company}). Thao tác này không thể hoàn tác.`} onClose={()=>setDeleting(null)} onDelete={async()=>{await api(`leads/${deleting.id}`,"DELETE",{version:deleting.version});setDeleting(null);setMessage("Đã xóa yêu cầu.");await load();}}/>}
  </>;
}
function LeadEditor({api,lead,readOnly,onClose,onSaved}:{api:Api;lead?:CmsLead;readOnly:boolean;onClose:()=>void;onSaved:()=>void}) {
  const [context,setContext]=useState<LeadContext>(lead?.context??"general"), [interest,setInterest]=useState(lead?.interest??"");
  const [busy,setBusy]=useState(false), [error,setError]=useState({message:"",fields:{} as Record<string,string>});
  const consentId=useId();
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy||readOnly)return;const form=event.currentTarget,data=new FormData(form);
    const submission:LeadSubmission={name:String(data.get("name")??""),company:String(data.get("company")??""),emailOrPhone:String(data.get("emailOrPhone")??""),interest,context,industry:String(data.get("industry")??""),companySize:String(data.get("companySize")??""),message:String(data.get("message")??""),source:String(data.get("source")??""),consent:data.get("consent")==="on",details:Object.fromEntries(contextDetailKeys[context].map(key=>[key,String(data.get(key)??"")]).filter(([,value])=>value!==""))};
    const validation=validateLeadSubmission(submission);const fields:Record<string,string>=validation.success?{}:{...validation.fieldErrors};
    const status=String(data.get("status")??"") as keyof typeof statuses,notes=String(data.get("notes")??"").trim();
    if(!Object.hasOwn(statuses,status))fields.status="Trạng thái không hợp lệ.";
    if(Array.from(notes).length>4000)fields.notes="Ghi chú tối đa 4.000 ký tự.";
    if(Object.keys(fields).length||!validation.success){setError({message:"Vui lòng kiểm tra lại thông tin.",fields});focusInvalid(form);return;}
    setBusy(true);setError({message:"",fields:{}});
    try{await api(lead?`leads/${lead.id}`:"leads",lead?"PATCH":"POST",{...validation.data,status,notes,...(lead?{version:lead.version}:{})});onSaved();}
    catch(error){setError(errorsFrom(error));focusInvalid(form);}finally{setBusy(false);}
  }
  return <Modal title={lead?`Yêu cầu #${lead.id}`:"Thêm yêu cầu"} busy={busy} onClose={onClose}>
    {lead&&<p className="cms-modal-description">Tiếp nhận: {date(lead.createdAt)} · Cập nhật: {date(lead.updatedAt)}</p>}
    <form noValidate onSubmit={submit}><fieldset disabled={busy||readOnly}><legend className="cms-sr-only">Thông tin yêu cầu</legend><div className="cms-form-grid">
      <Field name="name" label="Họ và tên" maxLength={120} defaultValue={lead?.name} required error={error.fields.name}/>
      <Field name="company" label="Công ty" maxLength={160} defaultValue={lead?.company} required error={error.fields.company}/>
      <Field name="emailOrPhone" label="Email hoặc số điện thoại" maxLength={254} defaultValue={lead?.emailOrPhone} required error={error.fields.emailOrPhone}/>
      <Choice name="context" label="Biểu mẫu / dịch vụ" value={context} onChange={event=>{setContext(event.target.value as LeadContext);setInterest("");}} required error={error.fields.context}>{leadContexts.map(value=><option key={value} value={value}>{leadContextLabels[value]}</option>)}</Choice>
      <Choice name="interest" label="Lĩnh vực quan tâm" value={interest} onChange={event=>setInterest(event.target.value)} required error={error.fields.interest}><option value="">Chọn lĩnh vực</option>{interestsFor(context).map(value=><option key={value} value={value}>{value}</option>)}</Choice>
      <Field name="industry" label="Ngành nghề" maxLength={160} defaultValue={lead?.industry} error={error.fields.industry}/>
      <Choice name="companySize" label="Quy mô công ty" defaultValue={lead?.companySize??""} error={error.fields.companySize}><option value="">Chưa cung cấp</option>{companySizes.map(value=><option key={value} value={value}>{value} nhân sự</option>)}</Choice>
      <Field name="source" label="Trang gửi yêu cầu" maxLength={300} defaultValue={lead?.source??"/"} required error={error.fields.source}/>
      {contextDetailKeys[context].map(key=><Choice key={`${context}-${key}`} name={key} label={detailLabels[key]} defaultValue={lead?.context===context?lead.details[key]??"":""} error={error.fields.details}><option value="">Chưa cung cấp</option>{detailOptions[key].map(value=><option key={value} value={value}>{value}</option>)}</Choice>)}
      <Textarea name="message" label="Nội dung khách hàng gửi" maxLength={4000} rows={5} defaultValue={lead?.message} error={error.fields.message}/>
      <Choice name="status" label="Trạng thái xử lý" defaultValue={lead?.status??"new"} required error={error.fields.status}>{Object.entries(statuses).map(([value,label])=><option value={value} key={value}>{label}</option>)}</Choice>
      <Textarea name="notes" label="Ghi chú nội bộ" maxLength={4000} rows={4} defaultValue={lead?.notes} error={error.fields.notes}/>
    </div><label className="cms-checkbox" htmlFor={consentId}><input type="checkbox" id={consentId} name="consent" defaultChecked={lead?.consent??false} required aria-invalid={Boolean(error.fields.consent)||undefined} aria-describedby={error.fields.consent?`${consentId}-error`:undefined}/>Khách hàng đã đồng ý để TNT liên hệ về yêu cầu này.</label>{error.fields.consent&&<p className="cms-field-error" id={`${consentId}-error`}>{error.fields.consent}</p>}</fieldset>
    <Notice message={error.message}/><div className="cms-actions"><button type="button" className="cms-button cms-secondary" onClick={onClose} disabled={busy}>Đóng</button>{!readOnly&&<button className="cms-button" disabled={busy}>{busy?"Đang lưu…":"Lưu yêu cầu"}</button>}</div></form>
  </Modal>;
}
