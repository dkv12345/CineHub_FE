import { useEffect, useState } from "react";
import { cinemas, dayInfo, movies, movieThemes } from "../data";
import type { Movie } from "../data";
import type { CSSProperties } from "react";
import { go, Link } from "../router";
import { btnGhost, btnPrimary, Icon } from "../components/ui";
import { useStore } from "../store";

const slides = movies.slice(0, 3);

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { trackMovie } = useStore();
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused]);
  const step = (d: number) => setI((x) => (x + d + slides.length) % slides.length);
  return (
    <section className="relative mx-auto min-h-[600px] max-w-[1600px] overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Phim nổi bật">
      {slides.map((m, n) => (
        <div key={m.id} aria-hidden={n !== i} style={{ "--film-accent": movieThemes[m.themeKey || "space"].accent, "--film-highlight": movieThemes[m.themeKey || "space"].highlight, "--film-display": movieThemes[m.themeKey || "space"].fontFamily } as CSSProperties} className={`absolute inset-0 transition-opacity duration-700 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <img src={m.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d11_0%,rgba(11,13,17,.75)_37%,rgba(11,13,17,.1)_72%),linear-gradient(0deg,#0b0d11_0%,transparent_45%)]" />
          <div className="dark-film-content relative mx-auto flex min-h-[600px] max-w-[1400px] items-center px-5 pb-24 pt-16 md:px-9">
            <div className="max-w-[660px]">
              <div className="mb-5 flex items-center gap-3 text-sm font-bold film-highlight"><span className="h-px w-8 bg-[var(--film-highlight)]" /> {m.studio || m.country || "Phim hot tuần này"}</div>
              <h1 className="film-title text-6xl sm:text-7xl md:text-[96px]">{m.title.toUpperCase()}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
                <span className="rounded bg-white px-1.5 py-0.5 text-xs text-black">{m.age}</span><span>2026</span><span>{m.duration}</span><span>{m.genre}</span>
                <span className="text-white"><b className="film-highlight">★</b> {m.rating}/10</span>
              </div>
              <p className="mt-3 text-xs font-semibold text-white/55">Đạo diễn <b className="text-white/80">{m.director}</b><span className="mx-2 text-white/20">·</span>Diễn viên <b className="text-white/80">{m.cast}</b></p>
              <p className="mt-2 text-xs font-bold text-white/55">{m.country || "Quốc tế"}{m.studio ? ` · ${m.studio}` : ""}</p>
              <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-white/55">{m.synopsis}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => { trackMovie(m.id); go(`/showtimes?movie=${m.id}`); }} className={btnPrimary}>Đặt vé <Icon name="arrow" size={18} /></button>
                <button onClick={() => { trackMovie(m.id, 34); go(`/movie/${m.id}?trailer=1`); }} className={btnGhost}><Icon name="play" size={17} /> Xem trailer</button>
                <button onClick={() => go(`/movie/${m.id}`)} className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-black/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Xem chi tiết</button>
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

function QuickBooking() {
  const showings = movies.filter((m) => m.status === "now");
  const days = Array.from({ length: 7 }, (_, i) => dayInfo(i));
  const [movieId, setMovieId] = useState(String(showings[0].id));
  const [day, setDay] = useState(0);
  const [cinemaId, setCinemaId] = useState(cinemas[0].id);

  return (
    <section className="glass-panel grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_1fr_1.3fr_auto] md:items-end md:p-5" aria-label="Đặt vé nhanh">
      <label className="min-w-0 text-xs font-bold text-white/45">Chọn phim
        <select value={movieId} onChange={(e) => setMovieId(e.target.value)} className="glass-control mt-2 block w-full rounded-xl px-3 py-3 text-sm font-semibold text-white outline-none focus:border-[#e50914]">
          {showings.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      </label>
      <label className="min-w-0 text-xs font-bold text-white/45">Chọn ngày
        <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="glass-control mt-2 block w-full rounded-xl px-3 py-3 text-sm font-semibold text-white outline-none focus:border-[#e50914]">
          {days.map((d, i) => <option key={d.offset} value={i}>{d.short} · {d.num}</option>)}
        </select>
      </label>
      <label className="min-w-0 text-xs font-bold text-white/45">Chọn rạp
        <select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)} className="glass-control mt-2 block w-full rounded-xl px-3 py-3 text-sm font-semibold text-white outline-none focus:border-[#e50914]">
          {cinemas.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <button onClick={() => go(`/showtimes?movie=${movieId}&day=${day}&cinema=${cinemaId}`)} className={`${btnPrimary} w-full md:w-auto`}><Icon name="search" size={17} /> Tìm suất chiếu</button>
    </section>
  );
}

function Card({ m, favorite, onFavorite, onOpen }: { m: Movie; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  const now = m.status === "now";
  const theme = movieThemes[m.themeKey || "space"];
  const themeStyle = { "--film-accent": theme.accent, "--film-highlight": theme.highlight, "--film-display": theme.fontFamily } as CSSProperties;
  return (
    <article className="glass-card group overflow-hidden rounded-2xl p-2" style={themeStyle}>
      <div className="relative">
        <Link to={`/movie/${m.id}`} onClick={onOpen} className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-[#17191f]">
          <img src={m.poster} alt={`Poster ${m.title}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="poster-art absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
          <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-[10px] font-black text-black">{m.age}</span>
          {m.studio && <span className="absolute right-3 top-3 max-w-[70%] truncate rounded-full border border-white/35 bg-black/35 px-2.5 py-1 text-[9px] font-extrabold text-white backdrop-blur">{m.studio}</span>}
          <div className="poster-art absolute inset-x-0 bottom-0 px-3 pb-3 pt-12 text-white">
            <span className="film-title block text-[25px] text-white">{m.title}</span>
            <span className="mt-1 block text-[10px] font-bold text-white/80">{now ? <><b className="film-highlight">★</b> {m.rating}/10 · {m.country || "Quốc tế"}</> : `${m.country || "Quốc tế"} · ${m.release}`}</span>
          </div>
        </Link>
        <button onClick={onFavorite} aria-label={favorite ? `Bỏ yêu thích ${m.title}` : `Yêu thích ${m.title}`} aria-pressed={favorite} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/55 backdrop-blur transition hover:scale-105 ${favorite ? "text-[#e50914]" : "text-white"}`}><Icon name="heart" size={18} /></button>
      </div>
      <div className="pt-4">
        <p className="truncate text-xs text-white/45">{m.genre}</p>
        <button onClick={() => go(now ? `/showtimes?movie=${m.id}` : `/movie/${m.id}`)} className={`mt-3 w-full rounded-lg py-2.5 text-sm font-extrabold transition ${now ? "film-accent-bg text-white hover:brightness-110" : "border border-white/30 bg-white/35 hover:bg-white/70"}`}>{now ? "Đặt vé" : "Xem chi tiết"}</button>
      </div>
    </article>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"now" | "soon">("now");
  const [catalogFilter, setCatalogFilter] = useState("all");
  const [shelf, setShelf] = useState<"history" | "collection" | "trending">("history");
  const { user, collections, toggleCollection, recentMovies, watchProgress, trackMovie } = useStore();
  const filterOptions = [
    ["all", "Tất cả"], ["ghibli", "Studio Ghibli"], ["conan", "Conan"], ["doraemon", "Doraemon"],
    ["western", "US / UK"], ["china", "Trung Quốc"], ["korea", "Hàn Quốc"],
  ];
  const matchesCatalog = (m: Movie) => catalogFilter === "all"
    || (catalogFilter === "ghibli" && m.studio === "Studio Ghibli")
    || (catalogFilter === "conan" && m.studio === "Detective Conan")
    || (catalogFilter === "doraemon" && m.studio === "Doraemon")
    || (catalogFilter === "western" && ["Mỹ", "Anh"].includes(m.country || ""))
    || (catalogFilter === "china" && m.country === "Trung Quốc")
    || (catalogFilter === "korea" && m.country === "Hàn Quốc");
  const list = movies.filter((m) => m.status === tab && matchesCatalog(m));
  const trending = [...movies].filter((m) => m.status === "now").sort((a, b) => b.rating - a.rating).slice(0, 10);
  const recommended = trending.slice(0, 3);
  const shelfMovies = shelf === "collection" ? collections : shelf === "history" ? recentMovies : trending.map((m) => m.id);
  const shelfItems = shelfMovies.map((id) => movies.find((m) => m.id === id)).filter((m): m is Movie => !!m);

  return (
    <main>
      <div className="relative">
        <Hero />
        <div className="relative z-20 mx-auto -mt-12 max-w-[1400px] px-5 md:px-9"><QuickBooking /></div>
      </div>
      <section className="mx-auto max-w-[1400px] px-5 pt-16 md:px-9">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-xs font-extrabold uppercase text-[#f5b50a]">Được khán giả lựa chọn</p><h2 className="mt-2 text-2xl font-extrabold">Top thịnh hành</h2></div>
          <Link to="/showtimes" className="text-xs font-bold text-white/45 hover:text-white">Xem lịch chiếu <Icon name="chevron" size={14} /></Link>
        </div>
        <div className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
          {trending.map((m, i) => (
            <Link key={m.id} to={`/movie/${m.id}`} onClick={() => trackMovie(m.id)} style={{ "--film-accent": movieThemes[m.themeKey || "space"].accent, "--film-highlight": movieThemes[m.themeKey || "space"].highlight } as CSSProperties} className="glass-card group relative w-[190px] shrink-0 snap-start rounded-2xl p-2 pt-3 sm:w-[220px]">
              <span className="display text-stroke absolute bottom-0 left-0 z-10 text-[112px] leading-[.78] transition group-hover:text-white">{i + 1}</span>
              <div className="ml-10 overflow-hidden rounded-lg bg-[#17191f]">
                <img src={m.poster} alt={`Poster ${m.title}`} className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <span className="mt-3 block truncate pl-10 text-sm font-extrabold">{m.title}</span>
              <span className="film-highlight block pl-10 text-xs">★ {m.rating} · {m.country || "Quốc tế"}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 border-y border-white/12 bg-white/[.025] backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-[.8fr_2fr] md:items-center md:px-9">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase film-highlight"><Icon name="sparkles" size={16} /> CineHub AI</p>
            <h2 className="mt-2 text-2xl font-extrabold">Dành riêng cho bạn</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/45">{user ? `Gợi ý tuần này dành cho ${user.name}.` : "Khám phá những bộ phim hợp gu của bạn."}</p>
            {!user && <Link to={`/login?next=${encodeURIComponent("/home")}`} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff4d57] hover:text-white">Đăng nhập để nhận gợi ý chuẩn gu <Icon name="arrow" size={16} /></Link>}
          </div>
          {user ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {recommended.map((m) => (
                <article key={m.id} className="flex min-w-0 gap-3 border-l border-white/10 pl-4">
                  <img src={m.poster} alt={`Poster ${m.title}`} className="h-24 w-16 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 py-1"><h3 className="line-clamp-2 text-sm font-extrabold">{m.title}</h3><p className="mt-1 text-xs film-highlight">★ {m.rating} · {m.country || "Quốc tế"}</p><Link to={`/movie/${m.id}`} className="mt-3 inline-block text-xs font-bold text-white/50 hover:text-white">Xem gợi ý <Icon name="chevron" size={12} /></Link></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">{recommended.map((m) => <span key={m.id} className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/50">{m.genre.split(",")[0]}</span>)}</div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-5 px-5 py-14 md:px-9 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="glass-panel h-fit rounded-2xl p-3">
          <p className="px-3 pb-3 pt-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-white/35">Thư viện của bạn</p>
          {([ ["history", "Lịch sử / Xem tiếp", "clock"], ["collection", "Bộ sưu tập", "heart"], ["trending", "Đang thịnh hành", "sparkles"] ] as const).map(([key, title, icon]) => (
            <button key={key} onClick={() => setShelf(key)} aria-pressed={shelf === key} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${shelf === key ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5 hover:text-white/80"}`}><Icon name={icon} size={17} />{title}{key === "collection" && <span className="ml-auto text-xs text-white/35">{collections.length}</span>}</button>
          ))}
        </aside>
        <div className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-extrabold uppercase text-[#f5b50a]">CineHub của bạn</p><h2 className="mt-1 text-2xl font-extrabold">{shelf === "history" ? "Xem tiếp" : shelf === "collection" ? "Bộ sưu tập của tôi" : "People also liked"}</h2></div>
            <span className="text-xs text-white/35">{shelfItems.length} phim</span>
          </div>
          {shelfItems.length ? (
            <div className="scrollbar-hide -mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-3">
              {shelfItems.map((m) => (
                <article key={m.id} className="glass-card group w-[150px] shrink-0 snap-start overflow-hidden rounded-2xl p-2 sm:w-[170px]">
                  <Link to={`/movie/${m.id}`} onClick={() => trackMovie(m.id)} className="relative block aspect-[2/3] overflow-hidden rounded-xl">
                    <img src={m.poster} alt={`Poster ${m.title}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-extrabold text-[#f5b50a] backdrop-blur">★ {m.rating || "Mới"}</span>
                    {shelf === "history" && <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20"><span className="block h-full bg-[#e50914] transition-all" style={{ width: `${watchProgress[m.id] || 8}%` }} /></span>}
                  </Link>
                  <h3 className="mt-3 truncate px-1 text-xs font-extrabold">{m.title}</h3>
                  <div className="mt-2 flex items-center justify-between px-1 pb-1 text-[10px] text-white/40"><span>{shelf === "history" ? `${watchProgress[m.id] || 8}% đã xem` : m.genre.split(",")[0]}</span><button onClick={() => toggleCollection(m.id)} aria-label={collections.includes(m.id) ? `Bỏ lưu ${m.title}` : `Lưu ${m.title}`} className={collections.includes(m.id) ? "text-[#ff4d57]" : "hover:text-white"}><Icon name="heart" size={15} /></button></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="glass-panel flex min-h-48 flex-col items-start justify-center rounded-2xl px-6 py-8">
              <p className="text-sm font-bold">{shelf === "collection" ? "Bộ sưu tập đang trống" : "Chưa có hoạt động gần đây"}</p>
              <p className="mt-2 max-w-lg text-xs leading-5 text-white/40">{shelf === "collection" ? "Lưu phim yêu thích từ poster để xem lại tại đây." : "Mở chi tiết phim hoặc xem trailer để tiếp tục theo dõi từ đây."}</p>
              <button onClick={() => setShelf("trending")} className="mt-4 text-xs font-extrabold text-[#ff4d57] hover:text-white">Khám phá phim <Icon name="arrow" size={14} /></button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-9">
        <div role="tablist" className="mb-8 flex gap-8 border-b border-white/10">
          {([["now", "Phim đang chiếu"], ["soon", "Phim sắp chiếu"]] as const).map(([k, t]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-4 text-lg font-extrabold transition ${tab === k ? "border-[#e50914] text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>{t}</button>
          ))}
        </div>
        <div className="scrollbar-hide mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Lọc theo quốc gia hoặc studio">
          {filterOptions.map(([key, label]) => <button key={key} onClick={() => setCatalogFilter(key)} aria-pressed={catalogFilter === key} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-extrabold transition ${catalogFilter === key ? "film-accent-bg text-white" : "border-[#82796d]/20 bg-white/35 text-[#686157] hover:bg-white/70"}`}>{label}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{list.map((m) => <Card key={m.id} m={m} favorite={collections.includes(m.id)} onFavorite={() => toggleCollection(m.id)} onOpen={() => trackMovie(m.id)} />)}</div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-14 md:px-9">
        <div className="glass-panel flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-xs font-extrabold uppercase text-[#f5b50a]">Ưu đãi thành viên</p><h2 className="mt-2 text-2xl font-extrabold">Một vé hay, thêm một niềm vui</h2><p className="mt-2 text-sm text-white/45">Nhập mã <b className="text-white">CINEHUB20</b> để nhận ưu đãi 20.000₫ cho vé tiếp theo.</p></div>
          <button onClick={() => go("/showtimes")} className={btnPrimary}>Khám phá suất chiếu <Icon name="arrow" size={17} /></button>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-10 md:px-9">
        <div className="flex flex-col gap-5 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-extrabold">Đối tác rạp chiếu</h2><p className="mt-1 text-xs text-white/35">Nhiều cụm rạp, một điểm đến.</p></div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-4">
            {["CGV", "LOTTE CINEMA", "BHD STAR", "GALAXY CINEMA"].map((name) => <span key={name} className="text-center text-sm font-black tracking-wide text-white/45">{name}</span>)}
          </div>
        </div>
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
