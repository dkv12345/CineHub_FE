import { useEffect, useRef, useState } from "react";
import { avatar, movies } from "../data";
import type { Movie } from "../data";
import { go, Link } from "../router";
import { useStore } from "../store";
import { Icon } from "./ui";

export function Header({ path }: { path: string }) {
  const { user, logout } = useStore();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const results = q.trim() ? movies.filter((m) => m.title.toLowerCase().includes(q.trim().toLowerCase())) : [];
  const nav = [["/home", "Phim"], ["/showtimes", "Lịch chiếu"], ["/my-tickets", "Vé của tôi"]];
  const on = (p: string) => path === p || (p === "/home" && path.startsWith("/movie"));

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-[rgba(15,23,42,0.62)] shadow-[0_10px_40px_rgba(0,0,0,0.16)] backdrop-blur-[20px] backdrop-saturate-150">
      <div className="mx-auto flex h-[74px] max-w-[1400px] items-center gap-4 px-5 md:gap-6 md:px-9">
        <button onClick={() => setMenu(!menu)} aria-label="Menu" className="rounded-full p-2 text-white/70 hover:bg-white/5 lg:hidden"><Icon name={menu ? "close" : "menu"} /></button>
        <Link to="/home" className="flex shrink-0 items-center gap-2.5" aria-label="CineHub trang chủ">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e50914] text-white shadow-[0_0_25px_rgba(229,9,20,.25)]"><Icon name="play" size={19} /></span>
          <span className="text-[21px] font-extrabold tracking-[-.04em]">CINE<span className="text-[#e50914]">HUB</span></span>
        </Link>
        <nav className="ml-4 hidden items-center gap-8 text-sm font-semibold lg:flex">
          {nav.map(([p, t]) => <Link key={p} to={p} className={on(p) ? "text-white" : "text-white/55 hover:text-white"}>{t}</Link>)}
        </nav>

        <div className="relative ml-auto hidden max-w-[360px] flex-1 sm:block">
          <div className="glass-control flex items-center gap-3 rounded-full px-4 py-2.5 text-white/55 focus-within:border-white/35">
            <Icon name="search" size={18} />
            <input aria-label="Tìm kiếm phim" value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 120)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Tìm phim, rạp chiếu..." />
          </div>
          {focus && q.trim() && (
            <div className="glass-panel absolute inset-x-0 top-[52px] overflow-hidden rounded-2xl shadow-2xl">
              {results.length === 0 && <p className="px-4 py-4 text-sm text-white/40">Không tìm thấy phim phù hợp.</p>}
              {results.map((m) => (
                <button key={m.id} onMouseDown={() => { setQ(""); go(`/movie/${m.id}`); }} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/5">
                  <img src={m.poster} alt="" className="h-12 w-8 rounded object-cover" />
                  <span><b className="block text-sm">{m.title}</b><small className="text-white/40">{m.genre}</small></span>
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="relative ml-auto sm:ml-0">
            <button onClick={() => setDrop(!drop)} aria-label="Tài khoản" className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/15">
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            </button>
            {drop && (
              <div className="glass-panel absolute right-0 top-12 w-56 overflow-hidden rounded-2xl shadow-2xl" onClick={() => setDrop(false)}>
                <div className="border-b border-white/8 px-4 py-3"><b className="block text-sm">{user.name}</b><small className="text-white/40">{user.email}</small></div>
                <Link to="/my-tickets" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5"><Icon name="ticket" size={17} /> Vé của tôi</Link>
                <button onClick={() => { logout(); go("/home"); }} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/5"><Icon name="logout" size={17} /> Đăng xuất</button>
              </div>
            )}
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <Link to="/register" className="hidden rounded-lg px-4 py-2.5 text-sm font-bold text-white/70 hover:text-white md:block">Đăng ký</Link>
            <Link to="/login" className="rounded-lg bg-[#e50914] px-5 py-2.5 text-sm font-extrabold hover:bg-[#ff101c]">Đăng nhập</Link>
          </div>
        )}
        <button onClick={() => window.dispatchEvent(new Event("cinehub:open-chat"))} aria-label="Hỏi CineBot AI" title="Hỏi CineBot AI" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[.06] text-white/70 transition hover:border-[#e50914]/60 hover:bg-[#e50914]/15 hover:text-white"><Icon name="chat" size={18} /></button>
      </div>
      {menu && (
        <nav className="border-t border-white/10 bg-[rgba(10,13,20,0.88)] px-5 py-3 backdrop-blur-2xl lg:hidden" onClick={() => setMenu(false)}>
          {nav.map(([p, t]) => <Link key={p} to={p} className="block py-3 text-sm font-semibold text-white/70">{t}</Link>)}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const cols: [string, string[]][] = [
    ["Khám phá", ["Phim đang chiếu", "Phim sắp chiếu", "Lịch chiếu", "Hệ thống rạp"]],
    ["Hỗ trợ", ["Trung tâm trợ giúp", "Chính sách hoàn vé", "Liên hệ", "Câu hỏi thường gặp"]],
    ["Về CineHub", ["Giới thiệu", "Điều khoản sử dụng", "Chính sách bảo mật", "Tuyển dụng"]],
  ];
  return (
    <footer className="mt-10 border-t border-white/15 bg-[rgba(8,10,14,0.62)] backdrop-blur-2xl">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-9">
        <div>
          <b className="text-xl">CINE<span className="text-[#e50914]">HUB</span></b>
          <p className="mt-3 max-w-[260px] text-sm leading-6 text-white/35">Đặt vé xem phim nhanh, chọn ghế trực tiếp, thanh toán trong một phút.</p>
        </div>
        {cols.map(([h, links]) => (
          <div key={h}>
            <h3 className="text-sm font-extrabold">{h}</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/40">{links.map((l) => <li key={l}><a href="#/home" className="hover:text-white">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/8 py-5 text-center text-xs text-white/25">© 2026 CineHub. Bảo lưu mọi quyền.</div>
    </footer>
  );
}

type Msg = { from: "bot" | "me"; text: string; recommendations?: Movie[] };
const answer = (t: string): Omit<Msg, "from"> => {
  const s = t.toLowerCase();
  if (/giá|bao nhiêu|vé/.test(s)) return { text: "Ghế thường 90.000₫, ghế VIP 120.000₫. Bạn có thể xem giá chính xác ở bước chọn ghế." };
  if (/hoàn|hủy|huỷ/.test(s)) return { text: "Vé đã thanh toán có thể hoàn trước giờ chiếu 2 tiếng. Bạn vào Vé của tôi để gửi yêu cầu." };
  if (/hot|gợi ý|phim|gia đình|bạo lực/.test(s)) return {
    text: "Mình chọn ra 3 phim đang được đánh giá cao. Chạm vào poster để xem chi tiết và lịch chiếu nhé.",
    recommendations: movies.filter((m) => m.status === "now").sort((a, b) => b.rating - a.rating).slice(0, 3),
  };
  if (/thanh toán|vnpay|zalo/.test(s)) return { text: "CineHub hỗ trợ VNPay và ZaloPay. Ghế được giữ 15 phút trong lúc bạn thanh toán." };
  return { text: "Mình chưa hiểu rõ ý bạn. Bạn thử hỏi về giá vé, phim hot, thanh toán hoặc hoàn vé nhé." };
};

export function Chatbot({ lift }: { lift?: boolean }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Xin chào, mình là CineBot. Mình có thể giúp gì cho bạn?" }]);
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, open]);
  useEffect(() => {
    const reveal = () => setOpen(true);
    window.addEventListener("cinehub:open-chat", reveal);
    return () => window.removeEventListener("cinehub:open-chat", reveal);
  }, []);
  const send = (t: string) => {
    if (!t.trim() || typing) return;
    setMsgs((m) => [...m, { from: "me", text: t }]); setText("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", ...answer(t) }]); setTyping(false); }, 600);
  };
  return (
    <div className={`fixed right-5 z-[60] ${lift ? "bottom-28" : "bottom-5"}`}>
      {open && (
        <div className="glass-panel chat-panel mb-3 flex h-[440px] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 bg-[#e50914] px-4 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><Icon name="chat" size={17} /></span>
            <div className="flex-1"><b className="block text-sm">CineBot</b><small className="text-white/75">Trợ lý AI · trả lời ngay</small></div>
            <button onClick={() => setOpen(false)} aria-label="Đóng chat" className="rounded-full p-1.5 hover:bg-white/15"><Icon name="close" size={18} /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${m.from === "me" ? "ml-auto rounded-br-sm bg-[#e50914]" : "rounded-bl-sm bg-white/8"}`}>{m.text}</div>
                {m.recommendations?.map((movie) => <Link key={movie.id} to={`/movie/${movie.id}`} className="mt-2 flex items-center gap-3 rounded-lg border border-white/8 bg-white/[.03] p-2.5 hover:border-white/20"><img src={movie.poster} alt="" className="h-14 w-10 rounded object-cover" /><span className="min-w-0"><b className="block truncate text-xs">{movie.title}</b><small className="text-[#f5b50a]">★ {movie.rating} · Đang chiếu</small><small className="mt-1 block text-[10px] text-white/40">{movie.genre}</small></span></Link>)}
              </div>
            ))}
            {typing && <div className="w-fit rounded-2xl rounded-bl-sm bg-white/8 px-4 py-3 text-xs text-white/50">CineBot đang tìm phim...</div>}
            <div ref={end} />
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {["Giá vé", "Phim hot", "Hoàn vé"].map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-semibold text-white/60 hover:bg-white/8">{c}</button>)}
          </div>
          <div className="flex gap-2 border-t border-white/8 p-3">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(text)} aria-label="Tin nhắn" placeholder="Nhập câu hỏi..." className="min-w-0 flex-1 rounded-full bg-white/6 px-4 py-2.5 text-sm outline-none placeholder:text-white/30" />
            <button onClick={() => send(text)} aria-label="Gửi" className="grid h-10 w-10 place-items-center rounded-full bg-[#e50914]"><Icon name="send" size={17} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Mở chatbot AI" className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-[#e50914] shadow-[0_12px_35px_rgba(229,9,20,.4)] transition hover:scale-105">
        <Icon name={open ? "close" : "chat"} size={24} />
      </button>
    </div>
  );
}

import { AIRecommendation } from '../data';

// State lưu danh sách gợi ý trong khung chat
const [aiRecommendations, setAiRecommendations] = useState([]);
