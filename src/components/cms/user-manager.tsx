"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { accountErrors, roles, type AccountInput, type CmsUser } from "@/lib/cms-contract";
import { errorsFrom, type Api } from "./api";
import { Choice, ConfirmDelete, Field, Modal, Notice, focusInvalid } from "./fields";

export function UserManager({api,user}:{api:Api;user:CmsUser}){
  const [items,setItems]=useState<CmsUser[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[message,setMessage]=useState("");
  const [editing,setEditing]=useState<CmsUser|"new"|null>(null),[deleting,setDeleting]=useState<CmsUser|null>(null);
  const load=useCallback(async(signal?:AbortSignal)=>{try{const result=await api<{items:CmsUser[]}>("users","GET",undefined,signal);if(!signal?.aborted){setItems(result.items);setError("");}}catch(error){if(!signal?.aborted)setError(errorsFrom(error).message);}finally{if(!signal?.aborted)setLoading(false);}},[api]);
  useEffect(()=>{
    const controller=new AbortController();
    api<{items:CmsUser[]}>("users","GET",undefined,controller.signal)
      .then(result=>{if(!controller.signal.aborted)setItems(result.items);})
      .catch(error=>{if(!controller.signal.aborted)setError(errorsFrom(error).message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[api]);
  return <><div className="cms-page-heading cms-heading-actions"><div><span className="cms-eyebrow">PHÂN QUYỀN TRUY CẬP</span><h1>Quản lý tài khoản</h1><p>Một admin cố hữu. Cấp quyền xử lý hoặc chỉ xem cho từng nhân viên.</p></div><button className="cms-button" onClick={()=>setEditing("new")}>+ Thêm tài khoản</button></div>
    <Notice message={message} success/><Notice message={error}/><section className="cms-panel"><div className="cms-panel-title"><h3>Danh sách tài khoản</h3><button className="cms-button cms-secondary" disabled={loading} onClick={()=>void load()}>Làm mới</button></div><div className="cms-table-scroll" aria-busy={loading}><table className="cms-table"><thead><tr><th>Tài khoản</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{items.map(account=><tr key={account.id}><td><strong>{account.displayName}</strong><span>{account.username}{account.id===user.id?" · Bạn":""}</span></td><td>{account.email}</td><td><span className="cms-badge">{roles[account.role]}</span></td><td><span className={`cms-badge ${account.active?"cms-status-closed":"cms-status-spam"}`}>{account.active?"Đang hoạt động":"Đã khóa"}</span></td><td>{account.role==="admin"?<span className="cms-hint">Admin cố hữu · Không thể xóa</span>:<div className="cms-row-actions"><button onClick={()=>setEditing(account)} disabled={loading}>Sửa</button><button className="cms-delete-link" disabled={loading||account.id===user.id} onClick={()=>setDeleting(account)}>Xóa</button></div>}</td></tr>)}{!items.length&&<tr><td colSpan={5} className="cms-empty">{loading?"Đang tải tài khoản…":"Không có dữ liệu."}</td></tr>}</tbody></table></div></section>
    {editing&&<AccountEditor api={api} account={editing==="new"?undefined:editing} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);setMessage("Đã lưu tài khoản.");void load();}}/>}
    {deleting&&<ConfirmDelete title="Xóa tài khoản?" description={`Xóa vĩnh viễn tài khoản ${deleting.username}. Tài khoản sẽ mất quyền truy cập ngay lập tức.`} onClose={()=>setDeleting(null)} onDelete={async()=>{await api(`users/${deleting.id}`,"DELETE",{version:deleting.version});setDeleting(null);setMessage("Đã xóa tài khoản.");await load();}}/>}
  </>;
}
function AccountEditor({api,account,onClose,onSaved}:{api:Api;account?:CmsUser;onClose:()=>void;onSaved:()=>void}){
  const [busy,setBusy]=useState(false),[error,setError]=useState({message:"",fields:{} as Record<string,string>});
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy)return;const form=event.currentTarget,data=new FormData(form),password=String(data.get("password")??"");
    const input:AccountInput={username:String(data.get("username")??"").trim(),displayName:String(data.get("displayName")??"").trim(),email:String(data.get("email")??"").trim(),role:String(data.get("role")) as AccountInput["role"],active:data.get("active")==="true",...(!account||password?{password}:{}),...(account?{version:account.version}:{})};
    const fields=accountErrors(input,Boolean(account));if(Object.keys(fields).length){setError({message:"Vui lòng kiểm tra lại thông tin.",fields});focusInvalid(form);return;}
    setBusy(true);setError({message:"",fields:{}});try{await api(account?`users/${account.id}`:"users",account?"PATCH":"POST",input);onSaved();}catch(error){setError(errorsFrom(error));focusInvalid(form);}finally{setBusy(false);}
  }
  return <Modal title={account?`Sửa tài khoản ${account.username}`:"Thêm tài khoản"} busy={busy} onClose={onClose}><form noValidate onSubmit={submit}><fieldset disabled={busy}><legend className="cms-sr-only">Thông tin tài khoản</legend><div className="cms-form-grid"><Field name="username" label="Tên đăng nhập" autoComplete="off" maxLength={50} required defaultValue={account?.username} hint="3–50 ký tự thường, số, dấu chấm, gạch dưới hoặc gạch ngang." error={error.fields.username}/><Field name="displayName" label="Họ và tên" maxLength={120} required defaultValue={account?.displayName} error={error.fields.displayName}/><Field name="email" label="Email" type="email" maxLength={254} required defaultValue={account?.email} error={error.fields.email}/><Choice name="role" label="Vai trò" defaultValue={account?.role??"editor"} required error={error.fields.role}><option value="editor">Nhân viên xử lý · CRUD yêu cầu</option><option value="viewer">Chỉ xem yêu cầu</option></Choice><Choice name="active" label="Trạng thái" defaultValue={String(account?.active??true)} required error={error.fields.active}><option value="true">Đang hoạt động</option><option value="false">Khóa tài khoản</option></Choice><Field name="password" label={account?"Đặt lại mật khẩu":"Mật khẩu ban đầu"} type="password" autoComplete="new-password" maxLength={72} required={!account} hint={account?"Để trống để giữ mật khẩu hiện tại. Mật khẩu mới cần 12–72 byte, có chữ và số.":"12–72 byte, gồm chữ và số."} error={error.fields.password}/></div></fieldset>{account&&<p className="cms-hint">Khi lưu thay đổi, các phiên đăng nhập hiện có của tài khoản này sẽ được thu hồi.</p>}<Notice message={error.message}/><div className="cms-actions"><button className="cms-button cms-secondary" type="button" disabled={busy} onClick={onClose}>Hủy</button><button className="cms-button" disabled={busy}>{busy?"Đang lưu…":"Lưu tài khoản"}</button></div></form></Modal>;
}
