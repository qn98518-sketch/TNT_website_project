"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { loginErrors, passwordError, roles, type SessionResult, type CmsUser } from "@/lib/cms-contract";
import { createCmsApi, errorsFrom, type Api } from "./api";
import { Field, Notice, focusInvalid } from "./fields";
import { LeadInbox } from "./lead-inbox";
import { UserManager } from "./user-manager";
import "./cms.css";

export function CmsApp() {
  const [user, setUser] = useState<CmsUser | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [tab, setTab] = useState<"leads" | "users" | "password">("leads");
  const [api] = useState<Api>(() => createCmsApi({
    expired: () => { setLoading(true); setUser(null); setTab("leads"); },
    refreshed: error => { if (error) setError(error); setLoading(false); },
  }));
  const acceptSession = useCallback((session: SessionResult) => { setUser(session.user); }, []);
  const reload = useCallback(async (signal?: AbortSignal) => {
    try { acceptSession(await api<SessionResult>("session", "GET", undefined, signal)); }
    catch (error) { if (!signal?.aborted) setError(errorsFrom(error).message); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [api, acceptSession]);
  useEffect(() => {
    const controller = new AbortController();
    api<SessionResult>("session", "GET", undefined, controller.signal)
      .then(session => { if (!controller.signal.aborted) acceptSession(session); })
      .catch(error => { if (!controller.signal.aborted) setError(errorsFrom(error).message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [api, acceptSession]);
  async function logout() { setError(""); try { acceptSession(await api<SessionResult>("logout", "POST", {})); setTab("leads"); } catch (error) { setError(errorsFrom(error).message); } }
  return <div className="cms-app">
    {!user ? <main className="cms-login-layout"><aside className="cms-login-brand"><Link href="/" className="cms-brand">TNT<span>TRÍ NGHĨA TECH</span></Link><div><span className="cms-eyebrow">KHÔNG GIAN QUẢN TRỊ</span><h1>Kết nối nhu cầu.<br />Theo sát từng yêu cầu.</h1><p>Tiếp nhận và quản lý thông tin khách hàng từ tất cả biểu mẫu trên website TNT.</p><div className="cms-security-note"><Icon name="shield" size={22} />Dữ liệu chỉ dành cho tài khoản được cấp quyền.</div></div><small>© TNT · Trí Nghĩa Tech</small></aside><section className="cms-login-panel">
      {loading ? <p role="status">Đang kiểm tra phiên đăng nhập…</p> : error ? <div><h2>Chưa thể kết nối CMS</h2><Notice message={error} /><button className="cms-button" onClick={() => { setLoading(true); setError(""); void reload(); }}>Thử kết nối lại</button><Link className="cms-back" href="/">Về website TNT</Link></div> : <Login api={api} onLogin={acceptSession} />}
    </section></main> : <div className="cms-shell">
      <aside className="cms-sidebar"><Link className="cms-brand" href="/">TNT<span>QUẢN TRỊ WEBSITE</span></Link><nav aria-label="Quản trị"><button aria-current={tab === "leads" ? "page" : undefined} onClick={() => setTab("leads")}><Icon name="messageText" size={20} />Yêu cầu từ biểu mẫu</button>{user.role === "admin" && <button aria-current={tab === "users" ? "page" : undefined} onClick={() => setTab("users")}><Icon name="people" size={20} />Quản lý tài khoản</button>}<button aria-current={tab === "password" ? "page" : undefined} onClick={() => setTab("password")}><Icon name="shield" size={20} />Đổi mật khẩu</button></nav><Link href="/" className="cms-website-link">← Về website TNT</Link></aside>
      <div className="cms-workspace"><header className="cms-topbar"><span>CMS / {tab === "leads" ? "Yêu cầu" : tab === "users" ? "Tài khoản" : "Mật khẩu"}</span><div><span><strong>{user.displayName}</strong><small>{roles[user.role]}</small></span><button className="cms-button cms-secondary" onClick={() => void logout()}>Đăng xuất</button></div></header><main className="cms-main"><Notice message={error} />{tab === "leads" ? <LeadInbox api={api} user={user} /> : tab === "users" && user.role === "admin" ? <UserManager api={api} user={user} /> : <PasswordForm api={api} onChange={acceptSession} />}</main></div>
    </div>}
  </div>;
}
function Login({ api, onLogin }: { api: Api; onLogin: (session: SessionResult) => void }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState({ message: "", fields: {} as Record<string, string> });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; const form=event.currentTarget, data=new FormData(form);
    const username=String(data.get("username") ?? "").trim(), password=String(data.get("password") ?? "");
    const fields=loginErrors(username,password); if (Object.keys(fields).length) { setError({message:"Vui lòng kiểm tra thông tin đăng nhập.",fields}); focusInvalid(form); return; }
    setBusy(true); setError({message:"",fields:{}});
    try { onLogin(await api<SessionResult>("login", "POST", {username,password})); }
    catch (error) { setError(errorsFrom(error)); focusInvalid(form); } finally { setBusy(false); }
  }
  return <div className="cms-login-card"><span className="cms-eyebrow">TNT CMS</span><h2>Đăng nhập</h2><p>Chào mừng bạn quay lại trang quản trị.</p><form onSubmit={submit} noValidate><fieldset disabled={busy}><legend className="cms-sr-only">Thông tin đăng nhập</legend><Field label="Tên đăng nhập" name="username" autoComplete="username" required maxLength={50} error={error.fields.username} /><Field label="Mật khẩu" name="password" type="password" autoComplete="current-password" required maxLength={72} error={error.fields.password} /><Notice message={error.message} /><button className="cms-button cms-login-submit" disabled={busy}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}<Icon name="arrowRight" size={18} /></button></fieldset></form><p className="cms-hint">Liên hệ admin nếu bạn cần được cấp tài khoản hoặc đặt lại mật khẩu.</p><Link className="cms-back" href="/">← Về website TNT</Link></div>;
}
function PasswordForm({ api, onChange }: { api: Api; onChange: (session: SessionResult) => void }) {
  const [busy,setBusy]=useState(false), [success,setSuccess]=useState(""), [error,setError]=useState({message:"",fields:{} as Record<string,string>});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; const form=event.currentTarget, data=new FormData(form);
    const currentPassword=String(data.get("currentPassword") ?? ""), newPassword=String(data.get("newPassword") ?? ""), confirmPassword=String(data.get("confirmPassword") ?? "");
    const fields: Record<string,string>={}; if (!currentPassword || new TextEncoder().encode(currentPassword).length>72) fields.currentPassword="Vui lòng nhập mật khẩu hiện tại hợp lệ.";
    const passwordValidation=passwordError(newPassword); if(passwordValidation) fields.newPassword=passwordValidation;
    if(newPassword===currentPassword) fields.newPassword="Mật khẩu mới phải khác mật khẩu hiện tại.";
    if(newPassword!==confirmPassword) fields.confirmPassword="Mật khẩu xác nhận không khớp.";
    setSuccess(""); if(Object.keys(fields).length){setError({message:"Vui lòng kiểm tra lại thông tin.",fields});focusInvalid(form);return;}
    setBusy(true);setError({message:"",fields:{}});
    try {onChange(await api<SessionResult>("password","POST",{currentPassword,newPassword,confirmPassword}));form.reset();setSuccess("Đã đổi mật khẩu. Các phiên đăng nhập khác đã được thu hồi.");}
    catch(error){setError(errorsFrom(error));focusInvalid(form);}finally{setBusy(false);}
  }
  return <><div className="cms-page-heading"><span className="cms-eyebrow">TÀI KHOẢN CÁ NHÂN</span><h1>Đổi mật khẩu</h1><p>Bảo vệ quyền truy cập của bạn bằng mật khẩu riêng.</p></div><form className="cms-panel cms-password-form" noValidate onSubmit={submit}><h3>Mật khẩu đăng nhập</h3><fieldset disabled={busy}><legend className="cms-sr-only">Đổi mật khẩu</legend><Field label="Mật khẩu hiện tại" name="currentPassword" type="password" autoComplete="current-password" maxLength={72} required error={error.fields.currentPassword} /><Field label="Mật khẩu mới" name="newPassword" type="password" autoComplete="new-password" maxLength={72} required hint="Từ 12–72 byte, gồm chữ và số. Ký tự tiếng Việt có thể chiếm nhiều byte." error={error.fields.newPassword} /><Field label="Nhập lại mật khẩu mới" name="confirmPassword" type="password" autoComplete="new-password" maxLength={72} required error={error.fields.confirmPassword} /><Notice message={error.message} /><Notice message={success} success /><button className="cms-button" disabled={busy}>{busy?"Đang lưu…":"Cập nhật mật khẩu"}</button></fieldset></form></>;
}
