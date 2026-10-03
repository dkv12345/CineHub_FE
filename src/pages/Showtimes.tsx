import { useState } from "react";
import { cinemas, dayInfo, getShows, movies } from "../data";
import { go } from "../router";
import { useStore } from "../store";
import { Icon } from "../components/ui";

const days = Array.from({ length: 7 }, (_, i) => dayInfo(i));
const chip = (on: boolean) => `rounded-full border px-4 py-2 text-xs font-bold transition ${on ? "border-[#e50914] bg-[#e50914]" : "border-white/12 bg-white/[.03] text-white/60 hover:border-white/30"}`;

export default function Showtimes({ movieId }: { movieId: number | null }) {
  const { user, startBooking } = useStore();
  const [day, setDay] = useState(0);
  const [brand, setBrand] = useState("Tất cả");
  const [fmtF, setFmtF] = useState("Tất cả");
  const [mid, setMid] = useState<number | null>(movieId);

  const now = movies.filter((m) => m.status === "now");
  const shown = now.filter((m) => mid === null || m.id === mid);

  const pick = (m: (typeof now)[number], c: (typeof cinemas)[number], time: string, format: string) => {
    startBooking({ movieId: m.id, cinema: c.name, format, time, dateLabel: days[day].label });
    go(user ? "/booking/seats" : `/login?next=${encodeURIComponent("/booking/seats")}`);
  };

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-9">
      <h1 className="text-3xl font-extrabold tracking-tight">Lịch chiếu</h1>
      <p className="mt-2 text-sm text-white/40">Chọn ngày, rạp và suất chiếu phù hợp với bạn.</p>

      <div className="scrollbar-hide mt-7 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Chọn ngày">
        {days.map((d, i) => (
          <button key={d.offset} role="tab" aria-selected={day === i} onClick={() => setDay(i)} className={`min-w-[84px] rounded-lg border px-4 py-3 text-center transition ${day === i ? "border-[#e50914] bg-[#e50914]" : "border-white/10 bg-white/[.025] text-white/55 hover:border-white/25"}`}>
            <small className="block text-[11px] font-bold">{d.short}</small><b className="mt-1 block text-lg">{d.num}</b>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 rounded-xl border border-white/8 bg-[#111319] p-5 md:grid-cols-3">
        <div><span className="mb-2 block text-xs font-semibold text-white/40">Phim</span>
          <select value={mid ?? ""} onChange={(e) => setMid(e.target.value ? Number(e.target.value) : null)} className="w-full rounded-lg border border-white/10 bg-[#0e1014] px-3 py-2.5 text-sm outline-none focus:border-[#e50914]">
            <option value="">Tất cả phim</option>{now.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select></div>
        <div><span className="mb-2 block text-xs font-semibold text-white/40">Rạp</span>
          <div className="flex flex-wrap gap-2">{["Tất cả", "CGV", "Lotte"].map((b) => <button key={b} onClick={() => setBrand(b)} aria-pressed={brand === b} className={chip(brand === b)}>{b}</button>)}</div></div>
        <div><span className="mb-2 block text-xs font-semibold text-white/40">Định dạng</span>
          <div className="flex flex-wrap gap-2">{["Tất cả", "2D", "3D"].map((f) => <button key={f} onClick={() => setFmtF(f)} aria-pressed={fmtF === f} className={chip(fmtF === f)}>{f}</button>)}</div></div>
      </div>

      <div className="mt-8 space-y-6">
        {cinemas.map((c, ci) => {
          if (brand !== "Tất cả" && c.brand !== brand) return null;
          const rows = shown.map((m) => ({ m, shows: getShows(m.id, ci, day).filter((s) => fmtF === "Tất cả" || s.format === fmtF) })).filter((r) => r.shows.length);
          if (!rows.length) return null;
          return (
            <section key={c.id} className="overflow-hidden rounded-xl border border-white/8 bg-[#13151a]">
              <header className="flex items-center gap-4 border-b border-white/8 px-5 py-4">
                <span className="text-[#e50914]"><Icon name="pin" size={20} /></span>
                <div><h2 className="font-extrabold">{c.name}</h2><p className="text-xs text-white/35">{c.area} · cách bạn {c.dist}</p></div>
              </header>
              {rows.map(({ m, shows }) => (
                <div key={m.id} className="flex flex-col gap-4 border-b border-white/5 px-5 py-5 last:border-0 md:flex-row md:items-center md:gap-8">
                  <button onClick={() => go(`/movie/${m.id}`)} className="flex min-w-[260px] items-center gap-4 text-left">
                    <img src={m.poster} alt="" className="h-20 w-14 rounded-md object-cover" />
                    <span><b className="block text-sm">{m.title}</b><small className="text-white/35">{m.genre} · {m.duration}</small></span>
                  </button>
                  <div className="flex flex-wrap gap-3">
                    {shows.map((s) => (
                      <button key={s.time + s.format} onClick={() => pick(m, c, s.time, s.format)} className="rounded-lg border border-white/12 bg-white/[.03] px-4 py-2 text-center transition hover:border-[#e50914] hover:bg-[#e50914]/10">
                        <b className="block text-sm tabular-nums">{s.time}</b><small className="text-[10px] font-bold text-[#f5b50a]">{s.format}</small>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
        {cinemas.every((c, ci) => (brand !== "Tất cả" && c.brand !== brand) || !shown.some((m) => getShows(m.id, ci, day).some((s) => fmtF === "Tất cả" || s.format === fmtF))) && (
          <p className="rounded-xl border border-dashed border-white/15 px-6 py-14 text-center text-sm text-white/45">Không có suất chiếu phù hợp. Hãy thử đổi ngày, rạp hoặc định dạng.</p>
        )}
      </div>
    </main>
  );
}

// Ví dụ State lọc 
const [selectedCinema, setSelectedCinema] = useState('All');
const [selectedFormat, setSelectedFormat] = useState('All');

const filteredShowtimes = showtimes.filter(s => 
  (selectedCinema === 'All' || s.cinemaBrand === selectedCinema) &&
  (selectedFormat === 'All' || s.format === selectedFormat)
);
