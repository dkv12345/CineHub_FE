import { useEffect, useState } from "react";
import { movies } from "../data";
import type { Movie } from "../data";
import { go, Link } from "../router";
import { btnGhost, btnPrimary, Icon } from "../components/ui";

const slides = movies.slice(0, 3);

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused]);
  const step = (d: number) => setI((x) => (x + d + slides.length) % slides.length);
  return (
    <section className="relative mx-auto min-h-[600px] max-w-[1600px] overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Phim nổi bật">
      {slides.map((m, n) => (
        <div key={m.id} aria-hidden={n !== i} className={`absolute inset-0 transition-opacity duration-700 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <img src={m.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d11_0%,rgba(11,13,17,.75)_37%,rgba(11,13,17,.1)_72%),linear-gradient(0deg,#0b0d11_0%,transparent_45%)]" />
          <div className="relative mx-auto flex min-h-[600px] max-w-[1400px] items-center px-5 pb-24 pt-16 md:px-9">
            <div className="max-w-[660px]">
              <div className="mb-5 flex items-center gap-3 text-sm font-bold text-[#f5b50a]"><span className="h-px w-8 bg-[#f5b50a]" /> Phim hot tuần này</div>
              <h1 className="display text-6xl leading-[.9] sm:text-7xl md:text-[96px]">{m.title.toUpperCase()}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/70">
                <span className="rounded bg-white px-1.5 py-0.5 text-xs text-black">{m.age}</span><span>{m.duration}</span><span>{m.genre}</span>
                <span className="text-white"><b className="text-[#f5b50a]">★</b> {m.rating}</span>
              </div>
              <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-white/55">{m.synopsis}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => go(`/showtimes?movie=${m.id}`)} className={btnPrimary}>Đặt vé <Icon name="arrow" size={18} /></button>
                <button onClick={() => go(`/movie/${m.id}`)} className={btnGhost}><Icon name="play" size={17} /> Xem chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 right-5 z-10 flex items-center gap-3 md:right-9">
        <button onClick={() => step(-1)} aria-label="Slide trước" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 hover:bg-white/10"><Icon name="chevronL" size={18} /></button>
        <div className="flex gap-2">{slides.map((m, n) => <button key={m.id} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-[#e50914]" : "w-3 bg-white/30"}`} />)}</div>
        <button onClick={() => step(1)} aria-label="Slide sau" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 hover:bg-white/10"><Icon name="chevron" size={18} /></button>
      </div>
    </section>
  );
}

function Card({ m }: { m: Movie }) {
  const now = m.status === "now";
  return (
    <article className="group">
      <Link to={`/movie/${m.id}`} className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-[#17191f]">
        <img src={m.poster} alt={`Poster ${m.title}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
        <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-[10px] font-black text-black">{m.age}</span>
        <span className="absolute bottom-3 left-3 text-xs font-bold">{now ? <><b className="text-[#f5b50a]">★</b> {m.rating}</> : `Khởi chiếu ${m.release}`}</span>
      </Link>
      <div className="pt-4">
        <h3 className="truncate text-base font-extrabold">{m.title}</h3>
        <p className="mt-1 truncate text-xs text-white/40">{m.genre}</p>
        <button onClick={() => go(now ? `/showtimes?movie=${m.id}` : `/movie/${m.id}`)} className={`mt-3 w-full rounded-lg py-2.5 text-sm font-extrabold transition ${now ? "bg-[#e50914] hover:bg-[#ff101c]" : "border border-white/20 hover:bg-white/8"}`}>{now ? "Đặt vé" : "Xem chi tiết"}</button>
      </div>
    </article>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"now" | "soon">("now");
  const list = movies.filter((m) => m.status === tab);
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-9">
        <div role="tablist" className="mb-8 flex gap-8 border-b border-white/10">
          {([["now", "Phim đang chiếu"], ["soon", "Phim sắp chiếu"]] as const).map(([k, t]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-4 text-lg font-extrabold transition ${tab === k ? "border-[#e50914] text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{list.map((m) => <Card key={m.id} m={m} />)}</div>
      </section>
    </main>
  );
}

import { AIRecommendation } from '../data';

// Mock dữ liệu AI trả về khi người dùng tìm kiếm câu hỏi tự nhiên
const mockAIResults: AIRecommendation[] = [
  {
    movieId: 'm1',
    title: 'Kẻ Trộm Mặt Trăng 4',
    rating: 8.4,
    matchReason: ['Nội dung gia đình hài hước', 'Không có yếu tố bạo lực'],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'
  },
  // ... 2 phim tiếp theo
];
