import { useState } from "react";
import { go, Link } from "../router";
import { useStore } from "../store";
import { signInWithGoogle } from "../services/firebaseAuth";
import { btnPrimary, Field, Modal } from "../components/ui";
import { movies } from "../data";

const emailOk = (s: string) => /^\S+@\S+\.\S+$/.test(s);

export default function Auth({ mode, next }: { mode: "login" | "register"; next: string }) {
  const { login } = useStore();
  const isLogin = mode === "login";
  const [f, setF] = useState({ name: "", email: "", pw: "", pw2: "" });
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!isLogin && !f.name.trim()) er.name = "Vui lòng nhập họ tên.";
    if (!emailOk(f.email)) er.email = "Email chưa đúng định dạng, ví dụ ten@email.com.";
    if (f.pw.length < 6) er.pw = "Mật khẩu cần ít nhất 6 ký tự.";
    if (!isLogin && f.pw2 !== f.pw) er.pw2 = "Mật khẩu xác nhận không khớp.";
    setErr(er);
    if (Object.keys(er).length) return;
    const name = isLogin ? f.email.split("@")[0].replace(/^./, (c) => c.toUpperCase()) : f.name.trim();
    login({ name, email: f.email });
    go(next);
  };

  const submitGoogle = async () => {
    setGoogleError("");
    setGoogleBusy(true);
    try {
      const user = await signInWithGoogle();
      login(user);
      go(next);
    } catch (error) {
      setGoogleError(error instanceof Error ? error.message : "Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    } finally {
      setGoogleBusy(false);
    }
  };

  const submitReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk(forgotEmail)) return setForgotError("Nhập email đúng định dạng để tiếp tục.");
    setForgotError("");
    setResetSent(true);
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-74px)] max-w-[1400px] lg:grid-cols-2">
      <section className="dark-film-content relative hidden overflow-hidden lg:block">
        <img src={movies[0].backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#0b0d11_5%,transparent_70%),linear-gradient(90deg,transparent_60%,#0b0d11)]" />
        <div className="absolute bottom-16 left-12 max-w-[420px]">
          <h2 className="display text-6xl leading-[.95]">MỖI CÂU CHUYỆN HAY<br />ĐÁNG ĐƯỢC XEM<br />TRÊN MÀN ẢNH LỚN</h2>
          <p className="mt-4 text-sm leading-6 text-white/50">Đăng nhập để lưu vé, nhận thông báo phim sắp chiếu và đặt ghế nhanh hơn.</p>
        </div>
      </section>
      <section className="grid place-items-center px-5 py-12">
        <form onSubmit={submit} noValidate className="glass-panel w-full max-w-[420px] rounded-3xl p-7 sm:p-9">
          <h1 className="text-3xl font-extrabold tracking-tight">{isLogin ? "Đăng nhập" : "Tạo tài khoản"}</h1>
          <p className="mt-2 text-sm text-white/40">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <Link to={isLogin ? `/register?next=${encodeURIComponent(next)}` : `/login?next=${encodeURIComponent(next)}`} className="font-bold text-[#ff4d57] hover:underline">{isLogin ? "Đăng ký ngay" : "Đăng nhập"}</Link>
          </p>
          <div className="mt-8 space-y-5">
            {!isLogin && <Field label="Họ và tên" value={f.name} onChange={set("name")} error={err.name} placeholder="Nguyễn Văn A" autoComplete="name" />}
            <Field label="Email" type="email" value={f.email} onChange={set("email")} error={err.email} placeholder="ten@email.com" autoComplete="email" />
            <Field label="Mật khẩu" type="password" value={f.pw} onChange={set("pw")} error={err.pw} placeholder="Ít nhất 6 ký tự" autoComplete={isLogin ? "current-password" : "new-password"} />
            {!isLogin && <Field label="Xác nhận mật khẩu" type="password" value={f.pw2} onChange={set("pw2")} error={err.pw2} placeholder="Nhập lại mật khẩu" autoComplete="new-password" />}
          </div>
          {isLogin && <div className="mt-3 text-right"><button type="button" onClick={() => { setForgotOpen(true); setForgotEmail(f.email); setResetSent(false); }} className="text-xs font-semibold text-white/40 hover:text-white">Quên mật khẩu?</button></div>}
          <button type="submit" className={`${btnPrimary} mt-7 w-full`}>{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
          {isLogin && (
            <>
              <div className="my-6 flex items-center gap-3 text-[11px] font-semibold text-white/35">
                <span className="h-px flex-1 bg-black/10" /> HOẶC ĐĂNG NHẬP BẰNG <span className="h-px flex-1 bg-black/10" />
              </div>
              <button type="button" onClick={submitGoogle} disabled={googleBusy} className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[#25272a] shadow-sm transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60">
                <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
                  <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
                  <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                  <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z" />
                  <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
                </svg>
                {googleBusy ? "Đang kết nối Google..." : "Đăng nhập bằng Google"}
              </button>
              {googleError && <p role="alert" className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-700">{googleError}</p>}
            </>
          )}
        </form>
      </section>
      {forgotOpen && (
        <Modal onClose={() => setForgotOpen(false)}>
          {resetSent ? (
            <div className="pt-3 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#46d38a]/15 text-[#46d38a]">✓</div>
              <h2 className="mt-4 text-xl font-extrabold">Kiểm tra hộp thư của bạn</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">Nếu tài khoản khớp với email này, hướng dẫn đặt lại mật khẩu sẽ được gửi đến bạn.</p>
              <button onClick={() => setForgotOpen(false)} className={`${btnPrimary} mt-6 w-full`}>Đã hiểu</button>
            </div>
          ) : (
            <form onSubmit={submitReset}>
              <h2 className="pr-8 text-xl font-extrabold">Đặt lại mật khẩu</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">Nhập email đã đăng ký để nhận hướng dẫn khôi phục tài khoản.</p>
              <div className="mt-5"><Field label="Email" type="email" value={forgotEmail} onChange={setForgotEmail} error={forgotError} placeholder="ten@email.com" autoComplete="email" /></div>
              <button type="submit" className={`${btnPrimary} mt-5 w-full`}>Gửi hướng dẫn</button>
            </form>
          )}
        </Modal>
      )}
    </main>
  );
}
