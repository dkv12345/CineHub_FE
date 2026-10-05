import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { go } from "../router";
import { useStore } from "../store";

const paths: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  chevronL: <path d="m15 18-6-6 6-6" />,
  play: <path d="m9 7 8 5-8 5Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  back: <path d="M19 12H5m5-5-5 5 5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  ticket: <><path d="M3 7a2 2 0 0 0 0 4v6h18v-6a2 2 0 0 0 0-4V5H3Z" /><path d="M13 8h4M13 12h4" /></>,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  bell: <><path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  logout: <><path d="M9 4H5v16h4" /><path d="M16 8l4 4-4 4M20 12H9" /></>,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></>,
  qr: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14ZM5 2l.8 1.8L8 5l-2.2 1.2L5 8l-.8-1.8L2 5l2.2-1.2L5 2Z" /></>,
};

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: size }} className={i <= Math.round(value) ? "text-[#f5b50a]" : "text-white/15"}>★</span>
      ))}
    </span>
  );
}

export function Modal({ onClose, children, wide }: { onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={onClose}>
        <div role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()} className={`glass-panel relative w-full ${wide ? "max-w-[860px]" : "max-w-[400px]"} rounded-3xl p-6 shadow-2xl`}>
        <button onClick={onClose} aria-label="Đóng" className="absolute right-3 top-3 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"><Icon name="close" size={18} /></button>
        {children}
      </div>
    </div>
  );
}

export const btnPrimary = "btn-primary inline-flex items-center justify-center gap-3 rounded-lg bg-[var(--film-accent)] px-6 py-3.5 text-sm font-extrabold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10";

export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const items = ["Chọn ghế", "Bắp nước", "Thanh toán"];
  return (
    <ol className="mb-8 flex items-center gap-3 text-xs font-bold">
      {items.map((t, i) => (
        <li key={t} className="flex items-center gap-3">
          <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${i + 1 <= current ? "film-accent-bg text-white" : "bg-white/10 text-white/40"}`}>{i + 1}</span>
          <span className={i + 1 === current ? "text-white" : "text-white/40"}>{t}</span>
          {i < 2 && <span className="h-px w-6 bg-white/15 sm:w-12" />}
        </li>
      ))}
    </ol>
  );
}

/** Đồng hồ đếm ngược giữ ghế 15:00, dùng chung cho các bước đặt vé */
export function HoldTimer() {
  const { booking, reset } = useStore();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!booking.expiresAt) return null;
  const left = Math.max(0, booking.expiresAt - now);
  const s = Math.ceil(left / 1000);
  const text = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const urgent = s < 120;
  return (
    <>
      <div className={`sticky top-[74px] z-40 border-b px-5 py-2.5 text-center text-xs font-semibold backdrop-blur-2xl ${urgent ? "border-[#e50914]/35 bg-[#e50914] text-white" : "border-white/75 bg-white/55 text-[#61594e] shadow-sm"}`}>
        <span className="mr-2 inline-flex align-middle text-[#ff3540]"><Icon name="clock" size={15} /></span>
        Ghế của bạn được giữ trong <b className="ml-1 text-base tabular-nums text-white" aria-live="off">{text}</b>
      </div>
      {left === 0 && (
        <Modal onClose={() => { reset(); go("/showtimes"); }}>
          <div className="pt-2 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e50914]/15 text-[#ff3540]"><Icon name="clock" size={28} /></div>
            <h2 className="mt-4 text-xl font-extrabold">Hết thời gian giữ ghế</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">Ghế đã được nhả lại cho người khác. Hãy chọn lại suất chiếu để tiếp tục đặt vé.</p>
            <button onClick={() => { reset(); go("/showtimes"); }} className={`${btnPrimary} mt-6 w-full`}>Chọn lại suất chiếu</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export function Field({ label, type = "text", value, onChange, error, placeholder, autoComplete }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block text-xs font-semibold text-white/50">
      {label}
      <div className="relative mt-2">
        <input
          type={isPw && show ? "text" : type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}
          className={`glass-control w-full rounded-xl border px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#e50914] ${error ? "border-[#ff5a63]" : "border-white/10"}`}
        />
        {isPw && <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/35 hover:text-white"><Icon name="eye" size={18} /></button>}
      </div>
      {error && <span role="alert" className="mt-1.5 block text-[11px] font-medium text-[#ff5a63]">{error}</span>}
    </label>
  );
}
