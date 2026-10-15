import { Link } from "../router";
import { useStore } from "../store";
import { Icon } from "../components/ui";
import { avatar, fmt, movies } from "../data";

export default function Profile() {
  const { user, collections, recentMovies, orders } = useStore();
  if (!user) return null;

  return (
    <main className="mx-auto min-h-[calc(100vh-74px)] max-w-[1000px] px-5 py-12 md:px-9">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#e0b968]">Tài khoản CineHub</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Hồ sơ của tôi</h1>
      <section className="glass-panel mt-8 flex flex-col gap-6 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
        <img src={user.photoURL || avatar} alt={`Ảnh đại diện ${user.name}`} referrerPolicy="no-referrer" className="h-24 w-24 rounded-full border-4 border-white/70 object-cover shadow-lg" />
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-2xl font-extrabold">{user.name}</h2>
          <p className="mt-1 break-all text-sm text-[#61594e]">{user.email}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-bold text-[#393630]">
            {user.provider === "google" ? (
              <>
                <svg aria-hidden="true" viewBox="0 0 48 48" className="h-4 w-4">
                  <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
                  <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                  <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z" />
                  <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
                </svg>
                Đã kết nối với Google
              </>
            ) : "Tài khoản CineHub"}
          </span>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Tổng quan tài khoản">
        {[
          { label: "Phim đã lưu", value: collections.length, icon: "heart" },
          { label: "Phim đã xem", value: recentMovies.length, icon: "clock" },
          { label: "Giao dịch thành công", value: orders.length, icon: "ticket" },
          { label: "Tổng chi tiêu", value: fmt(orders.reduce((total, order) => total + order.total, 0)), icon: "sparkles" },
        ].map((item) => (
          <div key={item.label} className="glass-panel rounded-2xl p-5">
            <Icon name={item.icon} size={20} />
            <p className="mt-4 text-2xl font-extrabold">{item.value}</p>
            <p className="mt-1 text-sm text-[#61594e]">{item.label}</p>
          </div>
        ))}
      </section>

      <section id="transactions" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#a47b2c]">Lịch sử tài khoản</p>
            <h2 className="mt-1 text-2xl font-extrabold">Lịch sử giao dịch</h2>
          </div>
          <Link to="/my-tickets" className="text-sm font-bold text-[#a3262e] hover:underline">Quản lý vé của tôi</Link>
        </div>

        {orders.length ? (
          <ul className="mt-5 space-y-4">
            {orders.map((order) => {
              const movie = movies.find((item) => String(item.id) === String(order.movieId));
              const title = movie?.title || order.movieTitle || "Phim đã đặt";
              const purchasedAt = typeof order.purchasedAt === "number" && Number.isFinite(order.purchasedAt)
                ? new Date(order.purchasedAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
                : "Chưa lưu thời gian giao dịch";

              return (
                <li key={order.code} className="glass-panel rounded-2xl p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {movie?.poster && <img src={movie.poster} alt={`Poster ${title}`} className="h-28 w-20 rounded-lg object-cover" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-extrabold">{title}</h3>
                          <p className="mt-1 text-xs text-[#61594e]">Mã giao dịch: <span className="font-bold">{order.code}</span></p>
                        </div>
                        <span className="rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-bold text-emerald-800">Thanh toán thành công</span>
                      </div>
                      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                        <div><dt className="text-xs text-[#61594e]">Thời gian giao dịch</dt><dd className="mt-0.5 font-semibold">{purchasedAt}</dd></div>
                        <div><dt className="text-xs text-[#61594e]">Suất chiếu</dt><dd className="mt-0.5 font-semibold">{order.time} · {order.dateLabel}</dd></div>
                        <div><dt className="text-xs text-[#61594e]">Rạp · Ghế</dt><dd className="mt-0.5 font-semibold">{order.cinema} · {order.seats.join(", ")}</dd></div>
                        <div><dt className="text-xs text-[#61594e]">Phương thức</dt><dd className="mt-0.5 font-semibold">{order.method}</dd></div>
                      </dl>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-4">
                        <span className="text-xs font-semibold text-[#61594e]">{order.status === "past" ? "Vé đã sử dụng" : "Vé sắp tới"}</span>
                        <strong className="text-lg">{fmt(order.total)}</strong>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="glass-panel mt-5 rounded-2xl px-6 py-12 text-center">
            <Icon name="ticket" size={26} />
            <p className="mt-3 font-bold">Chưa có giao dịch nào</p>
            <p className="mt-1 text-sm text-[#61594e]">Các giao dịch hoàn tất bằng tài khoản này sẽ được lưu ở đây.</p>
            <Link to="/showtimes" className="mt-4 inline-flex rounded-xl bg-[#e50914] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#ff101c]">Chọn phim</Link>
          </div>
        )}
      </section>

      <nav className="mt-6 flex flex-wrap gap-3">
        <Link to="/my-tickets" className="inline-flex items-center gap-2 rounded-xl bg-[#e50914] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#ff101c]"><Icon name="ticket" size={17} /> Xem vé của tôi</Link>
        <Link to="/home" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/55 px-5 py-3 text-sm font-bold hover:bg-white/80"><Icon name="chevronL" size={17} /> Về trang chủ</Link>
      </nav>
      <p className="mt-5 text-xs leading-5 text-[#61594e]">Thông tin hồ sơ được lấy từ tài khoản Google. Thư viện và lịch sử giao dịch được lưu riêng theo tài khoản CineHub trên trình duyệt này.</p>
    </main>
  );
}
