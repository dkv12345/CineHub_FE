import { useState } from "react";
import { movies, seedReviews } from "../data";
import { go } from "../router";
import { useStore } from "../store";
import { btnGhost, btnPrimary, Icon, Modal, Stars } from "../components/ui";
import { Link } from "../router";

export default function MovieDetail({ id }: { id: number }) {
  const m = movies.find((x) => x.id === id);
  const { user, notified, toggleNotify } = useStore();
  const [tab, setTab] = useState<"info" | "reviews">("info");
  const [trailer, setTrailer] = useState(false);
  const [reviews, setReviews] = useState(seedReviews);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  if (!m) return <main className="grid min-h-[60vh] place-items-center text-white/50">Không tìm thấy phim. <Link to="/home" className="ml-2 font-bold text-[#ff4d57]">Về trang chủ</Link></main>;
  const soon = m.status === "soon";
  const list = soon ? [] : reviews;
  const avg = list.length ? list.reduce((s, r) => s + r.stars, 0) / list.length : 0;
  const isNotified = notified.includes(m.id);

  const submit = () => {
    if (!stars) return setMsg("Hãy chọn số sao trước khi gửi.");
    if (text.trim().length < 10) return setMsg("Nội dung đánh giá cần ít nhất 10 ký tự.");
    setReviews([{ name: user!.name, stars, text: text.trim(), when: "Vừa xong" }, ...reviews]);
    setStars(0); setText(""); setMsg("");
  };

  return (
    <main>
      <section className="relative min-h-[480px] overflow-hidden">
        <img src={m.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d11_4%,rgba(11,13,17,.7)_42%,transparent),linear-gradient(0deg,#0b0d11_0%,transparent_70%)]" />
        <button onClick={() => setTrailer(true)} aria-label="Xem trailer" className="absolute left-[72%] top-1/2 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 backdrop-blur transition hover:scale-105 hover:bg-[#e50914] md:grid"><span className="ml-1"><Icon name="play" size={30} /></span></button>
        <div className="relative mx-auto flex min-h-[480px] max-w-[1400px] items-end px-5 pb-12 md:px-9">
          <div className="max-w-[700px]">
            <p className="mb-3 text-sm font-semibold text-white/60">{m.genre}</p>
            <h1 className="display text-6xl leading-none md:text-8xl">{m.title.toUpperCase()}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/65">
              <span className="rounded bg-[#f5b50a] px-1.5 py-0.5 text-[10px] font-black text-black">{m.age}</span><span>{m.duration}</span><span>Đạo diễn: <b className="text-white">{m.director}</b></span>
              {!soon && <span className="font-bold text-white"><b className="text-[#f5b50a]">★</b> {m.rating}</span>}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => setTrailer(true)} className={btnGhost}><Icon name="play" size={17} /> Xem trailer</button>
              {soon ? (
                <button onClick={() => toggleNotify(m.id)} aria-pressed={isNotified} className={isNotified ? `${btnGhost} border-[#46d38a]/40 text-[#46d38a]` : btnPrimary}>
                  <Icon name={isNotified ? "check" : "bell"} size={18} /> {isNotified ? "Đã đăng ký nhận thông báo" : "Nhận thông báo"}
                </button>
              ) : (
                <button onClick={() => go(`/showtimes?movie=${m.id}`)} className={btnPrimary}>Đặt vé <Icon name="arrow" size={18} /></button>
              )}
            </div>
            {soon && <p className="mt-3 text-xs text-white/45">Khởi chiếu {m.release}. Chúng tôi sẽ báo cho bạn khi mở bán vé.</p>}
          </div>
        </div>
      </section>

      <div className="border-b border-white/8">
        <div role="tablist" className="mx-auto flex max-w-[1400px] gap-8 px-5 md:px-9">
          <button role="tab" aria-selected={tab === "info"} onClick={() => setTab("info")} className={`-mb-px border-b-2 py-4 text-sm font-extrabold ${tab === "info" ? "border-[#e50914]" : "border-transparent text-white/45"}`}>Thông tin</button>
          <button role="tab" aria-selected="false" onClick={() => go(`/showtimes?movie=${m.id}`)} disabled={soon} className="-mb-px flex items-center gap-1.5 border-b-2 border-transparent py-4 text-sm font-extrabold text-white/45 hover:text-white disabled:opacity-40">Lịch chiếu <Icon name="chevron" size={14} /></button>
          <button role="tab" aria-selected={tab === "reviews"} onClick={() => setTab("reviews")} className={`-mb-px border-b-2 py-4 text-sm font-extrabold ${tab === "reviews" ? "border-[#e50914]" : "border-transparent text-white/45"}`}>Đánh giá</button>
        </div>
      </div>

      {tab === "info" ? (
        <section className="mx-auto max-w-[1400px] px-5 py-10 md:px-9">
          <p className="max-w-[760px] text-[15px] leading-7 text-white/60">{m.synopsis}</p>
          <dl className="mt-8 grid max-w-[780px] gap-5 border-t border-white/8 pt-6 text-sm sm:grid-cols-3">
            <div><dt className="text-xs text-white/35">Đạo diễn</dt><dd className="mt-1 font-bold">{m.director}</dd></div>
            <div><dt className="text-xs text-white/35">Diễn viên</dt><dd className="mt-1 font-bold">{m.cast}</dd></div>
            <div><dt className="text-xs text-white/35">Thời lượng</dt><dd className="mt-1 font-bold">{m.duration}</dd></div>
          </dl>
        </section>
      ) : (
        <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-10 md:px-9 lg:grid-cols-[320px_1fr]">
          <div className="h-fit rounded-xl border border-white/8 bg-[#13151a] p-6 text-center">
            {list.length ? <><b className="text-5xl">{avg.toFixed(1)}</b><div className="mt-2"><Stars value={avg} size={22} /></div><p className="mt-2 text-xs text-white/40">{list.length} đánh giá</p></> : <p className="text-sm text-white/45">Phim chưa khởi chiếu nên chưa có đánh giá.</p>}
          </div>
          <div>
            {!soon && (
              <div className="rounded-xl border border-white/8 bg-[#13151a] p-6">
                <h2 className="text-lg font-extrabold">Viết đánh giá của bạn</h2>
                {user ? (
                  <>
                    <div className="mt-4 flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
                      {[1, 2, 3, 4, 5].map((n) => <button key={n} role="radio" aria-checked={stars === n} aria-label={`${n} sao`} onClick={() => setStars(n)} className={`text-3xl transition hover:scale-110 ${n <= stars ? "text-[#f5b50a]" : "text-white/15"}`}>★</button>)}
                    </div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Bạn thấy bộ phim này thế nào?" className="mt-4 w-full resize-none rounded-lg border border-white/10 bg-[#0e1014] p-4 text-sm outline-none placeholder:text-white/25 focus:border-[#e50914]" />
                    {msg && <p role="alert" className="mt-2 text-xs text-[#ff5a63]">{msg}</p>}
                    <button onClick={submit} className={`${btnPrimary} mt-4`}>Gửi đánh giá</button>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-white/50">Bạn cần <Link to={`/login?next=${encodeURIComponent(`/movie/${m.id}`)}`} className="font-bold text-[#ff4d57] hover:underline">đăng nhập</Link> để viết đánh giá.</p>
                )}
              </div>
            )}
            <ul className="mt-6 space-y-4">
              {list.map((r, i) => (
                <li key={i} className="rounded-xl border border-white/8 bg-[#111319] p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-bold">{r.name[0]}</span>
                    <div className="flex-1"><b className="text-sm">{r.name}</b><div><Stars value={r.stars} size={13} /></div></div>
                    <small className="text-white/30">{r.when}</small>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/60">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {trailer && (
        <Modal wide onClose={() => setTrailer(false)}>
          <h2 className="mb-4 pr-8 text-lg font-extrabold">Trailer · {m.title}</h2>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <img src={m.backdrop} alt="" className="h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 grid place-items-center"><span className="grid h-20 w-20 place-items-center rounded-full bg-[#e50914] pl-1"><Icon name="play" size={32} /></span></div>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/15"><div className="h-full w-1/3 bg-[#e50914]" /></div>
          </div>
          <p className="mt-3 text-xs text-white/35">Khung video mẫu. Thay bằng link YouTube hoặc file video của phim khi làm bản thật.</p>
        </Modal>
      )}
    </main>
  );
}
