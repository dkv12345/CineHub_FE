import { fmt, movies } from "../data";
import { go, Link } from "../router";
import { useStore } from "../store";
import { btnGhost, btnPrimary, Icon } from "../components/ui";

export function Success() {
  const { lastOrder, orders } = useStore();
  const o = lastOrder ?? orders[0];
  const m = movies.find((v) => v.id === o.movieId)!;
  return (
    <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(35,173,104,.12),transparent_40%)] px-5 py-12">
      <div className="w-full max-w-[520px] text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#23ad68]/15 text-[#46d38a]"><Icon name="check" size={32} /></div>
        <h1 className="mt-6 text-3xl font-extrabold">Cảm ơn bạn đã đặt vé!</h1>
        <p className="mt-2 text-sm text-white/45">Vé đã được gửi tới email của bạn và lưu trong mục Vé của tôi.</p>
        <div className="mt-8 rounded-2xl border border-white/8 bg-[#15171c] p-6 text-left">
          <small className="text-xs text-white/40">Mã đơn hàng</small>
          <b className="mt-1 block text-2xl tracking-wider text-[#f5b50a]">{o.code}</b>
          <dl className="mt-5 space-y-3 border-t border-white/8 pt-5 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-white/40">Phim</dt><dd className="font-bold">{m.title}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-white/40">Suất chiếu</dt><dd className="text-right font-bold">{o.time} · {o.dateLabel}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-white/40">Rạp</dt><dd className="text-right font-bold">{o.cinema}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-white/40">Ghế</dt><dd className="font-bold">{o.seats.join(", ")}</dd></div>
            <div className="flex justify-between gap-4 border-t border-white/8 pt-3"><dt className="text-white/40">Đã thanh toán ({o.method})</dt><dd className="font-extrabold">{fmt(o.total)}</dd></div>
          </dl>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={() => go("/my-tickets")} className={btnPrimary}><Icon name="ticket" size={18} /> Xem vé của tôi</button>
          <Link to="/home" className={btnGhost}>Về trang chủ</Link>
        </div>
      </div>
    </main>
  );
}

export function Failed({ reason }: { reason: string }) {
  const { booking } = useStore();
  const cancel = reason === "cancel";
  const canRetry = !!booking.movieId && !!booking.expiresAt && booking.expiresAt > Date.now();
  return (
    <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,.14),transparent_40%)] px-5 py-12">
      <div className="w-full max-w-[460px] text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e50914]/15 text-[#ff3540]"><Icon name="alert" size={32} /></div>
        <h1 className="mt-6 text-3xl font-extrabold">{cancel ? "Bạn đã hủy thanh toán" : "Thanh toán không thành công"}</h1>
        <p className="mt-3 text-sm leading-6 text-white/50">
          {cancel ? "Đơn hàng chưa được tạo và bạn chưa bị trừ tiền." : "Giao dịch bị từ chối hoặc gián đoạn. Tiền chưa bị trừ, hoặc sẽ được hoàn trong 3–5 ngày làm việc."}
          {canRetry ? " Ghế của bạn vẫn đang được giữ, hãy thử lại trước khi hết giờ." : " Ghế đã hết thời gian giữ, bạn cần chọn lại suất chiếu."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => go(canRetry ? "/booking/checkout" : "/showtimes")} className={btnPrimary}>{canRetry ? "Thử lại" : "Chọn lại suất chiếu"}</button>
          <Link to="/home" className={btnGhost}>Về trang chủ</Link>
        </div>
      </div>
    </main>
  );
}
