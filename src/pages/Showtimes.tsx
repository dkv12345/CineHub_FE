import { useEffect, useMemo, useState } from "react";
import { dayInfo } from "../data";
import { go } from "../router";
import { useStore } from "../store";
import { Icon, Modal, btnPrimary } from "../components/ui";
import {
  fetchGalaxySessions,
  getDistinctCities,
  getDistinctCinemas,
  getDistinctMovies,
  getYouTubeEmbedUrl,
  type GalaxyApiResponse,
  type GalaxyCinema,
  type GalaxyMovie,
  type GalaxySession,
} from "../services/sessionsApi";

const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-xs font-bold transition duration-200 cursor-pointer ${
    on
      ? "film-accent-bg film-accent-border text-white shadow-[0_2px_12px_rgba(229,9,20,0.3)]"
      : "border-white/12 bg-white/[.04] text-white/70 hover:border-white/30 hover:bg-white/[.08]"
  }`;

export default function Showtimes({
  movieId,
  initialDay = 0,
  initialCinema = null,
}: {
  movieId: number | string | null;
  initialDay?: number;
  initialCinema?: string | null;
}) {
  const { user, startBooking, trackMovie } = useStore();

  // API State
  const [apiData, setApiData] = useState<GalaxyApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Filters State
  const [day, setDay] = useState(Math.min(6, Math.max(0, initialDay)));
  const [cityId, setCityId] = useState<string>("all");
  const [cinemaId, setCinemaId] = useState<string>(initialCinema || "all");
  const [selectedMovieId, setSelectedMovieId] = useState<string | number | null>(movieId);
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [captionFilter, setCaptionFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cinema" | "movie">("cinema");

  // Modal State
  const [galleryCinema, setGalleryCinema] = useState<GalaxyCinema | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [trailerMovie, setTrailerMovie] = useState<GalaxyMovie | null>(null);

  // Load sessions from API / Fallback
  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await fetchGalaxySessions();
      setApiData(res);
      setLastUpdated(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch {
      // Handled in service fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // 7 days timeline
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const info = dayInfo(i);
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    return { ...info, dateStr };
  }), []);

  const activeDateStr = days[day]?.dateStr || days[0].dateStr;

  const allSessions = apiData?.data?.result || [];

  // Distinct lists for filters
  const cities = useMemo(() => getDistinctCities(allSessions), [allSessions]);
  const distinctCinemas = useMemo(() => getDistinctCinemas(allSessions), [allSessions]);
  const distinctMovies = useMemo(() => getDistinctMovies(allSessions), [allSessions]);

  // Available formats, captions, and versions
  const availableFormats = useMemo(() => {
    const set = new Set<string>();
    allSessions.forEach((s) => s.movieFormat && set.add(s.movieFormat));
    return ["all", ...Array.from(set)];
  }, [allSessions]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return allSessions.filter((s) => {
      // Filter by Day
      if (s.showDate !== activeDateStr) return false;

      // Filter by City
      if (cityId !== "all" && s.cinema.cityId !== cityId) return false;

      // Filter by Cinema
      if (cinemaId !== "all" && s.cinema.id !== cinemaId && s.cinema.code !== cinemaId) return false;

      // Filter by Movie
      if (selectedMovieId !== null && selectedMovieId !== "" && s.movie.id !== String(selectedMovieId)) return false;

      // Filter by Format (e.g. 2D Phụ Đề, 2D Lồng Tiếng)
      if (formatFilter !== "all" && s.movieFormat !== formatFilter) return false;

      // Filter by Caption
      if (captionFilter !== "all" && s.caption !== captionFilter) return false;

      // Filter by Version
      if (versionFilter !== "all" && s.version.toLowerCase() !== versionFilter.toLowerCase()) return false;

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMovie = s.movie.name.toLowerCase().includes(q) || s.movie.slug.toLowerCase().includes(q);
        const matchCinema = s.cinema.name.toLowerCase().includes(q) || s.cinema.address.toLowerCase().includes(q);
        const matchScreen = s.screenName.toLowerCase().includes(q);
        if (!matchMovie && !matchCinema && !matchScreen) return false;
      }

      return true;
    });
  }, [allSessions, activeDateStr, cityId, cinemaId, selectedMovieId, formatFilter, captionFilter, versionFilter, searchQuery]);

  // Grouping by Cinema
  const groupedByCinema = useMemo(() => {
    const map = new Map<string, { cinema: GalaxyCinema; movieMap: Map<string, { movie: GalaxyMovie; sessions: GalaxySession[] }> }>();

    filteredSessions.forEach((s) => {
      if (!map.has(s.cinema.id)) {
        map.set(s.cinema.id, { cinema: s.cinema, movieMap: new Map() });
      }
      const entry = map.get(s.cinema.id)!;
      if (!entry.movieMap.has(s.movie.id)) {
        entry.movieMap.set(s.movie.id, { movie: s.movie, sessions: [] });
      }
      entry.movieMap.get(s.movie.id)!.sessions.push(s);
    });

    return Array.from(map.values()).map((c) => ({
      cinema: c.cinema,
      movies: Array.from(c.movieMap.values()).map((m) => ({
        movie: m.movie,
        sessions: m.sessions.sort((a, b) => a.showTime.localeCompare(b.showTime)),
      })),
    }));
  }, [filteredSessions]);

  // Grouping by Movie
  const groupedByMovie = useMemo(() => {
    const map = new Map<string, { movie: GalaxyMovie; cinemaMap: Map<string, { cinema: GalaxyCinema; sessions: GalaxySession[] }> }>();

    filteredSessions.forEach((s) => {
      if (!map.has(s.movie.id)) {
        map.set(s.movie.id, { movie: s.movie, cinemaMap: new Map() });
      }
      const entry = map.get(s.movie.id)!;
      if (!entry.cinemaMap.has(s.cinema.id)) {
        entry.cinemaMap.set(s.cinema.id, { cinema: s.cinema, sessions: [] });
      }
      entry.cinemaMap.get(s.cinema.id)!.sessions.push(s);
    });

    return Array.from(map.values()).map((m) => ({
      movie: m.movie,
      cinemas: Array.from(m.cinemaMap.values()).map((c) => ({
        cinema: c.cinema,
        sessions: c.sessions.sort((a, b) => a.showTime.localeCompare(b.showTime)),
      })),
    }));
  }, [filteredSessions]);

  // Handle slot pick
  const pickSession = (session: GalaxySession) => {
    trackMovie(Number(session.movie.id) || 1);
    startBooking({
      movieId: session.movie.id,
      movieTitle: session.movie.name,
      movieAge: session.movie.age,
      movieDuration: session.movie.duration,
      moviePoster: session.movie.imagePortrait,
      cinema: session.cinema.name,
      cinemaCode: session.cinema.code,
      cinemaAddress: session.cinema.address,
      cinemaPhone: session.cinema.phone,
      format: session.movieFormat,
      caption: session.caption,
      version: session.version,
      screenName: session.screenName,
      sessionId: session.id,
      time: session.showTime,
      dateLabel: `${days[day].label} (${session.showDate})`,
    });
    go(user ? "/booking/seats" : `/login?next=${encodeURIComponent("/booking/seats")}`);
  };

  const getAgeBadgeColor = (age: string) => {
    if (age === "18" || age === "T18") return "bg-[#e50914] text-white";
    if (age === "16" || age === "T16") return "bg-[#ff7a00] text-white";
    if (age === "13" || age === "T13") return "bg-[#f5b50a] text-black font-bold";
    return "bg-[#10b981] text-white";
  };

  const formatAgeLabel = (age: string) => {
    if (age.startsWith("T") || age.startsWith("P")) return age;
    return `T${age}`;
  };

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-9">
      {/* Header with Title & API metadata badge */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Lịch chiếu phim</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#46d38a]/30 bg-[#46d38a]/10 px-3 py-0.5 text-xs font-semibold text-[#46d38a]">
              <span className="h-2 w-2 rounded-full bg-[#46d38a] animate-pulse" />
              Galaxy API Mobile v2
            </span>
          </div>
          <p className="mt-2 text-sm text-white/50">
            Tra cứu toàn bộ {apiData?.data?.total ? `${apiData.data.total.toLocaleString("vi-VN")} suất chiếu` : "suất chiếu"} tại các cụm rạp toàn quốc.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-white/40">Cập nhật lúc: <b className="text-white/70">{lastUpdated}</b></span>
          )}
          <button
            onClick={loadSessions}
            disabled={loading}
            title="Tải lại lịch chiếu"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.04] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}><Icon name="refresh" size={15} /></span>
            {loading ? "Đang đồng bộ..." : "Làm mới"}
          </button>
        </div>
      </div>

      {/* Date Picker Bar */}
      <div className="scrollbar-hide mt-6 flex gap-2.5 overflow-x-auto pb-2" role="tablist" aria-label="Chọn ngày chiếu">
        {days.map((d, i) => (
          <button
            key={d.offset}
            role="tab"
            aria-selected={day === i}
            onClick={() => setDay(i)}
            className={`min-w-[96px] rounded-2xl border px-4 py-3.5 text-center backdrop-blur-xl transition duration-200 cursor-pointer ${
              day === i
                ? "film-accent-bg film-accent-border text-white shadow-[0_8px_20px_rgba(229,9,20,0.3)] scale-[1.02]"
                : "border-white/12 bg-white/[.04] text-white/65 hover:border-white/30 hover:bg-white/[.08]"
            }`}
          >
            <small className="block text-[11px] font-bold uppercase tracking-wider opacity-80">{d.short}</small>
            <b className="mt-1 block text-xl font-black">{d.num}</b>
            <span className="mt-0.5 block text-[10px] text-white/40">{d.dateStr.slice(5)}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filter Panel */}
      <div className="glass-panel mt-6 rounded-2xl p-5 shadow-xl">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Movie Filter */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/50">Phim</label>
            <select
              value={selectedMovieId ?? "all"}
              onChange={(e) => setSelectedMovieId(e.target.value === "all" ? null : e.target.value)}
              className="glass-control w-full rounded-xl px-3.5 py-3 text-sm font-semibold text-white outline-none focus:border-[#e50914]"
            >
              <option value="all">Tất cả phim ({distinctMovies.length})</option>
              {distinctMovies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({formatAgeLabel(m.age)} · {m.duration}p)
                </option>
              ))}
            </select>
          </div>

          {/* City / Province Filter */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/50">Thành phố / Khu vực</label>
            <select
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value);
                setCinemaId("all");
              }}
              className="glass-control w-full rounded-xl px-3.5 py-3 text-sm font-semibold text-white outline-none focus:border-[#e50914]"
            >
              <option value="all">Tất cả khu vực ({cities.length})</option>
              {cities.map((c) => (
                <option key={c.cityId} value={c.cityId}>
                  {c.name} ({c.count} suất)
                </option>
              ))}
            </select>
          </div>

          {/* Cinema Filter */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/50">Cụm rạp</label>
            <select
              value={cinemaId}
              onChange={(e) => setCinemaId(e.target.value)}
              className="glass-control w-full rounded-xl px-3.5 py-3 text-sm font-semibold text-white outline-none focus:border-[#e50914]"
            >
              <option value="all">Tất cả cụm rạp ({distinctCinemas.length})</option>
              {distinctCinemas
                .filter((c) => cityId === "all" || c.cityId === cityId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/50">Tìm nhanh</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tên phim, rạp, phòng chiếu..."
                className="glass-control w-full rounded-xl pl-9 pr-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/30 focus:border-[#e50914]"
              />
              <span className="absolute left-3 top-3.5 text-white/40">
                <Icon name="search" size={16} />
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3.5 text-white/40 hover:text-white"
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Format, Caption, Version & View Mode Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-white/40">Định dạng:</span>
            <div className="flex flex-wrap gap-2">
              {availableFormats.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormatFilter(f)}
                  aria-pressed={formatFilter === f}
                  className={chip(formatFilter === f)}
                >
                  {f === "all" ? "Tất cả" : f}
                </button>
              ))}
            </div>

            <span className="ml-2 text-xs font-bold text-white/40">Thuyết minh / Phụ đề:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tất cả" },
                { id: "sub", label: "Phụ đề" },
                { id: "voice", label: "Lồng tiếng" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCaptionFilter(c.id)}
                  aria-pressed={captionFilter === c.id}
                  className={chip(captionFilter === c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-white/12 bg-white/[.03] p-1 text-xs font-bold">
            <button
              onClick={() => setViewMode("cinema")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "cinema" ? "film-accent-bg text-white shadow-sm" : "text-white/50 hover:text-white"
              }`}
            >
              Theo cụm rạp
            </button>
            <button
              onClick={() => setViewMode("movie")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "movie" ? "film-accent-bg text-white shadow-sm" : "text-white/50 hover:text-white"
              }`}
            >
              Theo phim
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="mt-6 flex items-center justify-between text-xs text-white/45">
        <span>
          Hiển thị <b className="text-white">{filteredSessions.length}</b> suất chiếu vào ngày{" "}
          <b className="text-[#f5b50a]">{days[day]?.label}</b>
        </span>
        {(cityId !== "all" || cinemaId !== "all" || selectedMovieId !== null || formatFilter !== "all" || captionFilter !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setCityId("all");
              setCinemaId("all");
              setSelectedMovieId(null);
              setFormatFilter("all");
              setCaptionFilter("all");
              setVersionFilter("all");
              setSearchQuery("");
            }}
            className="font-bold text-[#e50914] hover:underline"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mt-6 space-y-7">
        {loading && filteredSessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#e50914] border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-white/60">Đang tải dữ liệu suất chiếu Galaxy Cinema...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.02] px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/5 text-white/40">
              <Icon name="calendar" size={26} />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Không có suất chiếu phù hợp</h3>
            <p className="mt-2 text-xs text-white/40 max-w-[420px] mx-auto">
              Không tìm thấy suất chiếu nào theo bộ lọc đã chọn. Hãy thử chọn ngày khác, đổi cụm rạp hoặc xóa từ khóa tìm kiếm.
            </p>
          </div>
        ) : viewMode === "cinema" ? (
          /* Grouped by Cinema View */
          groupedByCinema.map(({ cinema, movies: cinemaMovies }) => (
            <section key={cinema.id} className="glass-panel overflow-hidden rounded-2xl shadow-xl transition hover:border-white/20">
              {/* Cinema Header Details */}
              <header className="flex flex-col gap-4 border-b border-white/10 bg-white/[.03] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e50914]/15 text-[#e50914] border border-[#e50914]/25">
                    <Icon name="pin" size={20} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black tracking-tight text-white">{cinema.name}</h2>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-extrabold text-white/70">
                        Mã: {cinema.code}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
                      {cinema.address}
                    </p>
                  </div>
                </div>

                {/* Cinema Actions: Call, Maps & Photos */}
                <div className="flex flex-wrap items-center gap-2 sm:self-center">
                  {cinema.phone && (
                    <a
                      href={`tel:${cinema.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[.04] px-3 py-2 text-xs font-bold text-white/80 transition hover:border-white/30 hover:bg-white/10"
                    >
                      <Icon name="phone" size={14} />
                      <span>{cinema.phone}</span>
                    </a>
                  )}

                  {cinema.latitude && cinema.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${cinema.latitude},${cinema.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[.04] px-3 py-2 text-xs font-bold text-white/80 transition hover:border-[#e50914] hover:text-[#e50914]"
                    >
                      <Icon name="map" size={14} />
                      <span>Chỉ đường</span>
                    </a>
                  )}

                  {cinema.imageUrls && cinema.imageUrls.length > 0 && (
                    <button
                      onClick={() => {
                        setGalleryCinema(cinema);
                        setActivePhotoIdx(0);
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[.04] px-3 py-2 text-xs font-bold text-white/80 transition hover:border-white/30 hover:bg-white/10"
                    >
                      <Icon name="camera" size={14} />
                      <span>Ảnh rạp ({cinema.imageUrls.length})</span>
                    </button>
                  )}
                </div>
              </header>

              {/* Movies in this Cinema */}
              <div className="divide-y divide-white/5">
                {cinemaMovies.map(({ movie, sessions }) => (
                  <div key={movie.id} className="p-5 md:p-6 transition hover:bg-white/[.01]">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                      {/* Movie Info Card */}
                      <div className="flex min-w-[280px] max-w-[360px] gap-4">
                        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-black/40 shadow-md">
                          <img
                            src={movie.imagePortrait || movie.imageLandscape}
                            alt={movie.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <span
                            className={`absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-black ${getAgeBadgeColor(
                              movie.age
                            )}`}
                          >
                            {formatAgeLabel(movie.age)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <b className="block text-base font-extrabold leading-tight text-white hover:text-[#e50914] transition cursor-pointer" onClick={() => go(`/movie/${movie.id}`)}>
                            {movie.name}
                          </b>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-white/50">
                            <span>{movie.duration} phút</span>
                            {movie.rate > 0 && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1 font-bold text-[#f5b50a]">
                                  ★ {movie.rate.toFixed(1)} <small className="font-normal text-white/35">({movie.totalVotes})</small>
                                </span>
                              </>
                            )}
                          </div>
                          {movie.startDate && (
                            <p className="mt-1 text-[11px] text-white/35">
                              Khởi chiếu: {movie.startDate.slice(0, 10)}
                            </p>
                          )}
                          <div className="mt-2.5 flex items-center gap-2">
                            {movie.trailer && (
                              <button
                                onClick={() => setTrailerMovie(movie)}
                                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#e50914]"
                              >
                                <Icon name="play" size={12} /> Trailer
                              </button>
                            )}
                            <button
                              onClick={() => go(`/movie/${movie.id}`)}
                              className="text-[11px] font-semibold text-white/40 hover:text-white"
                            >
                              Chi tiết phim →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sessions Slots Grid */}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-3">
                          {sessions.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => pickSession(s)}
                              className="group relative flex flex-col items-center justify-center rounded-xl border border-white/12 bg-white/[.03] px-4 py-3 text-center transition duration-200 hover:scale-[1.03] hover:border-[#e50914] hover:bg-[#e50914]/15 hover:shadow-[0_4px_16px_rgba(229,9,20,0.25)]"
                            >
                              <div className="flex items-baseline gap-1">
                                <b className="text-base font-black tabular-nums tracking-tight text-white group-hover:text-[#ff4d57]">
                                  {s.showTime}
                                </b>
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] font-black text-[#f5b50a]">
                                  {s.movieFormat}
                                </span>
                              </div>
                              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/70">
                                {s.screenName}
                              </span>
                              {s.totalSeat > 0 && (
                                <small className="mt-0.5 block text-[9px] text-white/35">
                                  {s.bookedSeat > 0 ? `Còn ${s.totalSeat - s.bookedSeat}/${s.totalSeat} ghế` : `${s.totalSeat} ghế`}
                                </small>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          /* Grouped by Movie View */
          groupedByMovie.map(({ movie, cinemas: movieCinemas }) => (
            <section key={movie.id} className="glass-panel overflow-hidden rounded-2xl shadow-xl transition hover:border-white/20">
              {/* Movie Header */}
              <header className="flex flex-col gap-4 border-b border-white/10 bg-white/[.03] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-black/40 shadow-md">
                    <img
                      src={movie.imagePortrait || movie.imageLandscape}
                      alt={movie.name}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute left-1 top-1 rounded px-1 py-0.5 text-[8px] font-black ${getAgeBadgeColor(
                        movie.age
                      )}`}
                    >
                      {formatAgeLabel(movie.age)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white">{movie.name}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                      <span>{movie.duration} phút</span>
                      <span>·</span>
                      <span>Độ tuổi: {formatAgeLabel(movie.age)}</span>
                      {movie.rate > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-bold text-[#f5b50a]">★ {movie.rate.toFixed(1)}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {movie.trailer && (
                    <button
                      onClick={() => setTrailerMovie(movie)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[.04] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#e50914]"
                    >
                      <Icon name="play" size={14} /> Xem trailer
                    </button>
                  )}
                  <button
                    onClick={() => go(`/movie/${movie.id}`)}
                    className={btnPrimary}
                  >
                    Chi tiết phim
                  </button>
                </div>
              </header>

              {/* Cinemas playing this movie */}
              <div className="divide-y divide-white/5">
                {movieCinemas.map(({ cinema, sessions }) => (
                  <div key={cinema.id} className="p-5 md:p-6 transition hover:bg-white/[.01]">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                      <div className="min-w-[280px] max-w-[340px]">
                        <div className="flex items-center gap-2">
                          <span className="text-[#e50914]"><Icon name="pin" size={16} /></span>
                          <b className="text-sm font-bold text-white">{cinema.name}</b>
                        </div>
                        <p className="mt-1 text-xs text-white/45 pl-6">{cinema.address}</p>
                        {cinema.phone && (
                          <p className="mt-1 text-[11px] text-white/35 pl-6">Hotline: {cinema.phone}</p>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-3">
                          {sessions.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => pickSession(s)}
                              className="group relative flex flex-col items-center justify-center rounded-xl border border-white/12 bg-white/[.03] px-4 py-3 text-center transition duration-200 hover:scale-[1.03] hover:border-[#e50914] hover:bg-[#e50914]/15 hover:shadow-[0_4px_16px_rgba(229,9,20,0.25)]"
                            >
                              <b className="text-base font-black tabular-nums tracking-tight text-white group-hover:text-[#ff4d57]">
                                {s.showTime}
                              </b>
                              <span className="mt-1 rounded bg-white/8 px-1.5 py-0.5 text-[10px] font-black text-[#f5b50a]">
                                {s.movieFormat}
                              </span>
                              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/70">
                                {s.screenName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Cinema Facility Photo Gallery Modal */}
      {galleryCinema && (
        <Modal wide onClose={() => setGalleryCinema(null)}>
          <div className="flex items-start justify-between pr-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#f5b50a]">Hình ảnh cụm rạp</span>
              <h2 className="mt-1 text-xl font-black text-white">{galleryCinema.name}</h2>
              <p className="mt-1 text-xs text-white/50">{galleryCinema.address}</p>
            </div>
          </div>

          <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl bg-black">
            <img
              src={galleryCinema.imageUrls[activePhotoIdx] || galleryCinema.imageLandscape || galleryCinema.imagePortrait}
              alt={`${galleryCinema.name} photo ${activePhotoIdx + 1}`}
              className="h-full w-full object-cover"
            />
            {galleryCinema.imageUrls.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoIdx((p) => (p - 1 + galleryCinema.imageUrls.length) % galleryCinema.imageUrls.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-[#e50914]"
                >
                  <Icon name="chevronL" size={20} />
                </button>
                <button
                  onClick={() => setActivePhotoIdx((p) => (p + 1) % galleryCinema.imageUrls.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-[#e50914]"
                >
                  <Icon name="chevron" size={20} />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {activePhotoIdx + 1} / {galleryCinema.imageUrls.length}
            </div>
          </div>

          {/* Thumbnails list */}
          {galleryCinema.imageUrls.length > 1 && (
            <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
              {galleryCinema.imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activePhotoIdx === idx ? "border-[#e50914] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* YouTube Video Trailer Modal */}
      {trailerMovie && (
        <Modal wide onClose={() => setTrailerMovie(null)}>
          <div className="pr-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#f5b50a]">Official Trailer</span>
            <h2 className="mt-1 text-xl font-black text-white">{trailerMovie.name}</h2>
          </div>

          <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
            {getYouTubeEmbedUrl(trailerMovie.trailer) ? (
              <iframe
                src={getYouTubeEmbedUrl(trailerMovie.trailer)!}
                title={`Trailer ${trailerMovie.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <div className="grid h-full place-items-center p-6 text-center text-sm text-white/60">
                Không thể tải video trailer. Bạn có thể mở trực tiếp tại:
                <a
                  href={trailerMovie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-[#ff4d57] underline"
                >
                  {trailerMovie.trailer}
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
}
