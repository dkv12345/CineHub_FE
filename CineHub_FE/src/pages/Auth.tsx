import { useState } from "react";
import { go, Link } from "../router";
import { useStore } from "../store";
import { btnPrimary, Field } from "../components/ui";
import { movies } from "../data";

const emailOk = (s: string) => /^\S+@\S+\.\S+$/.test(s);

export default function Auth({ mode, next }: { mode: "login" | "register"; next: string }) {
  const { login } = useStore();
  const isLogin = mode === "login";
  const [f, setF] = useState({ name: "", email: "", pw: "", pw2: "" });
  const [err, setErr] = useState<Record<string, string>>({});
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

  return (
    <main className="mx-auto grid min-h-[calc(100vh-74px)] max-w-[1400px] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <img src={movies[0].backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#0b0d11_5%,transparent_70%),linear-gradient(90deg,transparent_60%,#0b0d11)]" />
        <div className="absolute bottom-16 left-12 max-w-[420px]">
          <h2 className="display text-6xl leading-[.95]">MỖI CÂU CHUYỆN HAY<br />ĐÁNG ĐƯỢC XEM<br />TRÊN MÀN ẢNH LỚN</h2>
          <p className="mt-4 text-sm leading-6 text-white/50">Đăng nhập để lưu vé, nhận thông báo phim sắp chiếu và đặt ghế nhanh hơn.</p>
        </div>
      </section>
      <section className="grid place-items-center px-5 py-12">
        <form onSubmit={submit} noValidate className="w-full max-w-[420px]">
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
          {isLogin && <div className="mt-3 text-right"><a href="#/login" className="text-xs font-semibold text-white/40 hover:text-white">Quên mật khẩu?</a></div>}
          <button type="submit" className={`${btnPrimary} mt-7 w-full`}>{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
        </form>
      </section>
    </main>
  );
}
// Thêm logic chuyển tab Login/Register trong src/pages/Auth.tsx
const [isRegister, setIsRegister] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

// Cập nhật router dẫn tới /login và /register trong src/router.tsx
