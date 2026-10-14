import { Link } from "../router";
import { useStore } from "../store";
import { Icon } from "../components/ui";
import { avatar } from "../data";

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

      <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Tổng quan tài khoản">
        {[
          { label: "Phim đã lưu", value: collections.length, icon: "heart" },
          { label: "Phim đã xem", value: recentMovies.length, icon: "clock" },
          { label: "Vé của tôi", value: orders.length, icon: "ticket" },
        ].map((item) => (
          <div key={item.label} className="glass-panel rounded-2xl p-5">
            <Icon name={item.icon} size={20} />
            <p className="mt-4 text-2xl font-extrabold">{item.value}</p>
            <p className="mt-1 text-sm text-[#61594e]">{item.label}</p>
          </div>
        ))}
      </section>

      <nav className="mt-6 flex flex-wrap gap-3">
        <Link to="/my-tickets" className="inline-flex items-center gap-2 rounded-xl bg-[#e50914] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#ff101c]"><Icon name="ticket" size={17} /> Xem vé của tôi</Link>
        <Link to="/home" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/55 px-5 py-3 text-sm font-bold hover:bg-white/80"><Icon name="chevronL" size={17} /> Về trang chủ</Link>
      </nav>
      <p className="mt-5 text-xs leading-5 text-[#61594e]">Thông tin hồ sơ được lấy từ tài khoản Google. Thư viện và lịch sử trên thiết bị này được lưu riêng theo tài khoản CineHub.</p>
    </main>
  );
}
