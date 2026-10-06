import type { SeatZone } from "../store";

export type SeatLayout = {
  rows: number;
  columns: number;
  aislesAfter: number[];
  vipFromRow: number;
  sweetbox: { row: number; from: number; to: number };
  style: string;
};

export type SeatCell = {
  id: string;
  row: string;
  rowIndex: number;
  column: number;
  zone: SeatZone;
  sold: boolean;
  selected: boolean;
};

export function layoutForCinema(cinema: string): SeatLayout {
  if (/galaxy/i.test(cinema)) return { rows: 10, columns: 16, aislesAfter: [4, 12], vipFromRow: 4, sweetbox: { row: 9, from: 6, to: 11 }, style: "Galaxy Cinema · Âm thanh Dolby 7.1 · Sảnh Laser" };
  if (/lotte/i.test(cinema)) return { rows: 9, columns: 15, aislesAfter: [5, 10], vipFromRow: 5, sweetbox: { row: 7, from: 7, to: 10 }, style: "Lotte · 3 khu ghế · lối đi đôi" };
  if (/bhd/i.test(cinema)) return { rows: 8, columns: 18, aislesAfter: [6, 12], vipFromRow: 4, sweetbox: { row: 6, from: 8, to: 11 }, style: "BHD Star · 3 khu ghế · sảnh rộng" };
  return { rows: 10, columns: 16, aislesAfter: [8], vipFromRow: 6, sweetbox: { row: 4, from: 7, to: 10 }, style: "CGV · 2 khu ghế · lối đi trung tâm" };
}

type Props = {
  layout: SeatLayout;
  seats: SeatCell[];
  onChoose: (seat: SeatCell) => void;
};

export default function SeatMap2D({ layout, seats, onChoose }: Props) {
  const tracks = layout.columns + layout.aislesAfter.length;
  const byId = new Map(seats.map((seat) => [seat.id, seat]));

  return (
    <div className="seat-map-2d overflow-x-auto rounded-2xl border border-[#d9d4cb] bg-[#f7f5f0] px-4 py-7 sm:px-7">
      <div className="mx-auto w-fit min-w-max">
        <div className="mx-auto mb-2 h-1.5 w-[58%] rounded-full bg-[#3a3835] shadow-[0_4px_16px_rgba(32,30,27,.2)]" />
        <p className="mb-7 text-center text-[11px] font-black tracking-[.18em] text-[#4f4b44]">MÀN HÌNH</p>
        <div className="space-y-2">
          {Array.from({ length: layout.rows }, (_, rowIndex) => {
            const row = String.fromCharCode(65 + rowIndex);
            return (
              <div key={row} className="grid items-center gap-x-1.5" style={{ gridTemplateColumns: `22px repeat(${tracks}, minmax(30px, 38px))` }}>
                <span className="text-xs font-black text-[#888176]">{row}</span>
                {Array.from({ length: layout.columns }, (_, columnIndex) => {
                  const number = columnIndex + 1;
                  const zone: SeatZone = rowIndex === layout.sweetbox.row && number >= layout.sweetbox.from && number <= layout.sweetbox.to
                    ? "sweetbox"
                    : rowIndex >= layout.vipFromRow ? "vip" : "normal";
                  const id = `${row}${number}`;
                  const seat = byId.get(id) || { id, row, rowIndex, column: columnIndex, zone, sold: false, selected: false };
                  const track = columnIndex + 1 + layout.aislesAfter.filter((after) => columnIndex >= after).length;
                  const color = seat.sold ? "border-[#aaa7a0] bg-[#c5c2bb] text-[#817d75]" : seat.selected ? "film-accent-bg film-accent-border text-white shadow-[0_5px_12px_color-mix(in_srgb,var(--film-accent)_28%,transparent)]" : zone === "vip" ? "border-[#c48848] bg-[#dca762] text-[#3b2b18]" : zone === "sweetbox" ? "border-[#cc5c89] bg-[#e589ae] text-[#4d1930]" : "border-[#7046c8] bg-[#8054d7] text-white";
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={seat.sold}
                      aria-label={`Ghế ${id}, ${zone === "vip" ? "VIP" : zone === "sweetbox" ? "Sweetbox" : "thường"}, ${seat.sold ? "đã đặt" : seat.selected ? "đang chọn" : "trống"}`}
                      aria-pressed={seat.selected}
                      onClick={() => onChoose(seat)}
                      className={`seat-cell aspect-square min-w-[30px] rounded-[7px] border text-[10px] font-extrabold transition duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e50914] disabled:cursor-not-allowed disabled:opacity-70 ${color}`}
                      style={{ gridColumn: track + 2 }}
                    >{id}</button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-[10px] font-semibold text-[#8b857a]">{layout.style}</p>
      </div>
    </div>
  );
}