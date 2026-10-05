import { lazy, Suspense, useState } from "react";
import { go } from "../router";
import { fmt, hash, movies, PRICE } from "../data";
import { ticketsTotal, useStore } from "../store";
import type { SeatZone } from "../store";
import { btnPrimary, HoldTimer, Icon, Modal, Steps } from "../components/ui";
import SeatMap2D, { layoutForCinema } from "../components/SeatMap2D";
import type { SeatCell } from "../components/SeatMap2D";
const SeatPOVScene = lazy(() => import("../components/SeatPOVScene"));

const MAX = 6;

export default function Seats() {
  const { booking, patch, reset } = useStore();
  const m = movies.find((v) => v.id === booking.movieId)!;
  const key = `${booking.movieId}${booking.cinema}${booking.dateLabel}${booking.time}`;
  const layout = layoutForCinema(booking.cinema);
  const [preview, setPreview] = useState<(SeatCell & { selectedAfterClick: boolean; limitReached: boolean }) | null>(null);
  const isSold = (id: string, r: number, c: number) => (hash(key + id) + r * 13 + c * 7) % 100 < 18;
  const sel = booking.seats;
  const total = ticketsTotal(booking);
  const seats = Array.from({ length: layout.rows }, (_, rowIndex) => {
    const row = String.fromCharCode(65 + rowIndex);
    return Array.from({ length: layout.columns }, (_, columnIndex) => {
      const id = `${row}${columnIndex + 1}`;
      const zone: SeatZone = rowIndex === layout.sweetbox.row && columnIndex + 1 >= layout.sweetbox.from && columnIndex + 1 <= layout.sweetbox.to
        ? "sweetbox" : rowIndex >= layout.vipFromRow ? "vip" : "normal";
      return { id, row, rowIndex, column: columnIndex, zone, sold: isSold(id, rowIndex, columnIndex), selected: sel.includes(id) };
    });
  }).flat();
  const chooseSeat = (seat: SeatCell) => {
    if (seat.sold) return;
    const wasSelected = sel.includes(seat.id);
    const limitReached = !wasSelected && sel.length >= MAX;
    if (!limitReached) {
      const seatTypes = { ...booking.seatTypes };
      if (wasSelected) delete seatTypes[seat.id];
      else seatTypes[seat.id] = seat.zone;
      patch({ seats: wasSelected ? sel.filter((id) => id !== seat.id) : [...sel, seat.id], seatTypes });
    }
    setPreview({ ...seat, selectedAfterClick: !wasSelected && !limitReached, limitReached });
  };

  return (
    <main>
      <HoldTimer />
      <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9">
        <button onClick={() => { reset(); go("/showtimes"); }} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/45 hover:text-white"><Icon name="back" size={17} /> Đổi suất chiếu</button>
        <Steps current={1} />
        <h1 className="text-3xl font-extrabold tracking-tight">Chọn ghế</h1>
        <p className="mt-2 text-sm text-white/45">{m.title} · {booking.cinema} · {booking.format} · {booking.time}, {booking.dateLabel}</p>

        <section className="mt-8 rounded-[28px] border border-white/65 bg-white/35 p-5 shadow-[0_24px_70px_rgba(83,72,54,.12)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#9b674a]">Sơ đồ chỗ ngồi</p><h2 className="mt-1 text-xl font-extrabold">{booking.cinema}</h2><p className="mt-1 text-xs text-[#77716a]">{layout.style}</p></div>
            <p className="text-xs font-semibold text-[#77716a]">Chọn ghế để xem góc nhìn tại vị trí đó</p>
          </div>
          <SeatMap2D layout={layout} seats={seats} onChoose={chooseSeat} />
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-[#6e675c]/15 pt-5 text-xs text-[#5c5954]">
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#7046c8] bg-[#8054d7]" />Thường {fmt(PRICE.normal)}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#c48848] bg-[#dca762]" />VIP {fmt(PRICE.vip)}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#cc5c89] bg-[#e589ae]" />Sweetbox {fmt(PRICE.sweetbox)}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#e50914] bg-[#e50914]" />Đang chọn</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#aaa7a0] bg-[#c5c2bb]" />Đã đặt</span>
          </div>
        </section>
      </div>

      {preview && (
        <Modal wide onClose={() => setPreview(null)}>
          <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
            <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#9b674a]">Góc nhìn tại ghế</p><h2 className="mt-1 text-xl font-extrabold">{preview.id} · {booking.cinema}</h2><p className="mt-1 text-xs text-[#77716a]">{preview.zone === "sweetbox" ? "Sweetbox" : preview.zone === "vip" ? "Ghế VIP" : "Ghế thường"} · {preview.limitReached ? `Đã đạt giới hạn ${MAX} ghế` : preview.selectedAfterClick ? "Đã thêm vào danh sách ghế" : "Đã bỏ khỏi danh sách ghế"}</p></div>
            <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-extrabold text-[#59544d]">POV · {preview.id}</span>
          </div>
          <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/60 bg-[#171315]">
            <Suspense fallback={<div className="grid h-[480px] place-items-center text-sm font-semibold text-white/70">Đang dựng góc nhìn rạp...</div>}>
              <SeatPOVScene seatId={preview.id} rowIndex={preview.rowIndex} columnIndex={preview.column} columns={layout.columns} zone={preview.zone} backdrop={m.backdrop} />
            </Suspense>
            <div className="pov-knees" aria-hidden="true"><span /><span /></div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4"><p className="text-xs text-[#77716a]">Góc nhìn mô phỏng từ vị trí ghế hướng về màn hình.</p><button onClick={() => setPreview(null)} className={btnPrimary}>Xong</button></div>
        </Modal>
      )}

      <div className="glass-panel sticky bottom-0 z-30 border-t border-white/15">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 md:px-9">
          <div className="min-w-0 flex-1"><small className="text-xs text-white/40">Ghế đã chọn ({sel.length}/{MAX})</small><b className="mt-0.5 block truncate text-sm text-[#f5b50a]">{sel.length ? sel.join(", ") : "Chưa chọn ghế nào"}</b></div>
          <div className="text-right"><small className="text-xs text-white/40">Tạm tính</small><b className="block text-xl tabular-nums">{fmt(total)}</b></div>
          <button disabled={!sel.length} onClick={() => go("/booking/concessions")} className={btnPrimary}>Tiếp tục <Icon name="arrow" size={17} /></button>
        </div>
      </div>
    </main>
  );
}

