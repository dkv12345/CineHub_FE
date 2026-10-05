import { useMemo, useState } from "react";
import { movies } from "../data";
import { Link } from "../router";
import { useStore } from "../store";
import type { Order } from "../store";
import { btnPrimary, Icon, Modal } from "../components/ui";
import { hash } from "../data";

function QR({ code }: { code: string }) {
  const N = 25;
  const cells = useMemo(() => {
    const finder = (r: number, c: number) => [[0, 0], [0, N - 7], [N - 7, 0]].some(([fr, fc]) => r >= fr && r < fr + 7 && c >= fc && c < fc + 7);
    const ring = (r: number, c: number) => [[0, 0], [0, N - 7], [N - 7, 0]].some(([fr, fc]) => {
      const a = r - fr, b = c - fc; if (a < 0 || b < 0 || a > 6 || b > 6) return false;
      return a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4);
    });
    return Array.from({ length: N * N }, (_, i) => { const r = Math.floor(i / N), c = i % N; return finder(r, c) ? ring(r, c) : (hash(code + i) >> 3) % 2 === 0; });
  }, [code]);
  return (
    <div className="mx-auto grid h-[220px] w-[220px] rounded-lg bg-white p-3" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }} role="img" aria-label={`Mã QR ${code}`}>
      {cells.map((on, i) => <i key={i} className={on ? "bg-black" : ""} />)}
    </div>
  );
}

function TicketCard({ o, onQR }: { o: Order; onQR: () => void }) {
  const m = movies.find((v) => v.id === o.movieId)!;
  const past = o.status === "past";
  return (
    <li className={`flex gap-5 rounded-2xl border border-white/8 bg-[#13151a] p-4 sm:p-5 ${past ? "opacity-70" : ""}`}>
      <img src={m.poster} alt={`Poster ${m.title}`} className="h-36 w-24 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-extrabold">{m.title}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/60"><Icon name="clock" size={15} /> {o.time} · {o.dateLabel} · {o.format}</p>
        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-white/60"><Icon name="pin" size={15} /> {o.cinema}</p>
        <p className="mt-2 text-sm">Ghế: <b className="text-[#f5b50a]">{o.seats.join(", ")}</b></p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <small className="truncate text-white/30">{o.code}</small>
          {past ? <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold text-white/45">Đã xem</span> : <button onClick={onQR} className="flex items-center gap-2 rounded-lg bg-[#e50914] px-4 py-2 text-xs font-extrabold hover:bg-[#ff101c]"><Icon name="qr" size={16} /> Xem mã QR</button>}
        </div>
      </div>
    </li>
  );
}

export default function MyTickets() {
  const { orders } = useStore();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [qr, setQr] = useState<Order | null>(null);
  const list = orders.filter((o) => o.status === tab);
  const qm = qr && movies.find((v) => v.id === qr.movieId)!;

  return (
    <main className="mx-auto max-w-[900px] px-5 py-10 md:px-9">
      <h1 className="text-3xl font-extrabold tracking-tight">Vé của tôi</h1>
      <div role="tablist" className="mt-7 flex gap-8 border-b border-white/10">
        {([["upcoming", "Vé sắp tới"], ["past", "Lịch sử vé"]] as const).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-3 text-sm font-extrabold ${tab === k ? "border-[#e50914]" : "border-transparent text-white/40 hover:text-white/70"}`}>{t} <span className="ml-1 text-white/30">{orders.filter((o) => o.status === k).length}</span></button>
        ))}
      </div>
      {list.length ? (
        <ul className="mt-6 space-y-4">{list.map((o) => <TicketCard key={o.code} o={o} onQR={() => setQr(o)} />)}</ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <p className="text-sm text-white/45">Bạn chưa có vé nào ở mục này.</p>
          <Link to="/showtimes" className={`${btnPrimary} mt-5`}>Đặt vé ngay</Link>
        </div>
      )}
      {qr && qm && (
        <Modal onClose={() => setQr(null)}>
          <div className="text-center">
            <h2 className="pr-6 text-lg font-extrabold">{qm.title}</h2>
            <p className="mt-1 text-xs text-white/45">{qr.time} · {qr.dateLabel} · Ghế {qr.seats.join(", ")}</p>
            <div className="mt-5"><QR code={qr.code} /></div>
            <b className="mt-4 block tracking-wider">{qr.code}</b>
            <p className="mt-2 text-xs text-white/35">Đưa mã này cho nhân viên soát vé tại {qr.cinema}.</p>
          </div>
        </Modal>
      )}
    </main>
  );
}
