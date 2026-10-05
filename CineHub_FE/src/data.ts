const U = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const ids = {
  hero: "photo-1546803413-57dae5ac538c",
  eclipse: "photo-1752439910625-437e68217c37",
  redEye: "photo-1546803073-23568b8c98e6",
  rocket: "photo-1660232784887-a5dc140fb0b9",
  noir: "photo-1554875032-2de0215e64c5",
  portrait: "photo-1615454138525-01a2abbf5437",
  shadow: "photo-1678918549313-cbaf32e5a1c5",
};

export const avatar = U(ids.portrait, 200);

export type Movie = {
  id: number; title: string; genre: string; duration: string; director: string; cast: string;
  age: string; rating: number; votes: number; poster: string; backdrop: string;
  status: "now" | "soon"; release: string; synopsis: string;
};

export const movies: Movie[] = [
  { id: 1, title: "Crimson Orbit", genre: "Khoa học viễn tưởng, Giật gân", duration: "2h 18m", director: "Nolan Reyes", cast: "Mara Voss, Ian Cole", age: "T16", rating: 8.7, votes: 1284, poster: U(ids.eclipse), backdrop: U(ids.hero, 1800), status: "now", release: "Đang chiếu", synopsis: "Một nhà du hành nhận được tín hiệu từ rìa Hệ Mặt Trời, thứ vốn không bao giờ được phép chạm tới Trái Đất. Cô phải chọn giữa quay về nhà hoặc lần theo tín hiệu vào bóng tối." },
  { id: 2, title: "Red Horizon", genre: "Hành động, Chính kịch", duration: "2h 05m", director: "Elena Marsh", cast: "Jack Doran, Lin Tao", age: "T18", rating: 8.4, votes: 962, poster: U(ids.redEye), backdrop: U(ids.redEye, 1800), status: "now", release: "Đang chiếu", synopsis: "Một cựu đặc vụ buộc phải quay lại chiến trường khi người cuối cùng cô tin tưởng bị bắt cóc giữa cuộc đảo chính." },
  { id: 3, title: "Beyond Earth", genre: "Phiêu lưu, Khoa học viễn tưởng", duration: "1h 58m", director: "Sam Okafor", cast: "Ava Lin, Tom Reid", age: "P", rating: 8.1, votes: 730, poster: U(ids.rocket), backdrop: U(ids.rocket, 1800), status: "now", release: "Đang chiếu", synopsis: "Một nhóm học sinh trúng chuyến bay thử nghiệm lên quỹ đạo và phát hiện trạm vũ trụ bỏ hoang không hề trống rỗng." },
  { id: 4, title: "The Last Signal", genre: "Bí ẩn, Giật gân", duration: "1h 52m", director: "Iris Vale", cast: "Noah Park, Sara Bui", age: "T16", rating: 7.9, votes: 511, poster: U(ids.noir), backdrop: U(ids.noir, 1800), status: "now", release: "Đang chiếu", synopsis: "Đêm cuối cùng của một đài phát thanh cũ, người dẫn chương trình nhận cuộc gọi báo trước một vụ án chưa xảy ra." },
  { id: 5, title: "Lost in Silence", genre: "Chính kịch, Bí ẩn", duration: "2h 01m", director: "Hana Ito", cast: "Yuki Mori, Leo Tran", age: "T13", rating: 7.8, votes: 402, poster: U(ids.portrait), backdrop: U(ids.portrait, 1800), status: "now", release: "Đang chiếu", synopsis: "Sau tai nạn, một nghệ sĩ dương cầm mất thính giác và dần nhận ra căn nhà của mình còn giữ những âm thanh mà cô không thể nghe." },
  { id: 6, title: "Shadow Protocol", genre: "Hành động, Giật gân", duration: "2h 10m", director: "Marco Diaz", cast: "Rin Kato, Ben Ford", age: "T16", rating: 0, votes: 0, poster: U(ids.shadow), backdrop: U(ids.shadow, 1800), status: "soon", release: "16/10/2026", synopsis: "Một đội điệp viên phát hiện tổ chức của họ đang bị điều khiển bởi chính kẻ thù họ săn đuổi suốt mười năm." },
  { id: 7, title: "Midnight Frequency", genre: "Kinh dị, Bí ẩn", duration: "1h 47m", director: "Lucia Ferro", cast: "Zoe Hart, Kim Ngo", age: "T18", rating: 0, votes: 0, poster: U(ids.hero), backdrop: U(ids.hero, 1800), status: "soon", release: "23/10/2026", synopsis: "Mỗi đêm lúc 00:00, một tần số lạ phát ra từ chiếc radio hỏng. Càng nghe, người ta càng thấy những điều không nên thấy." },
  { id: 8, title: "Ember Coast", genre: "Chính kịch, Lãng mạn", duration: "2h 12m", director: "Aiko Sato", cast: "Mia Tan, Owen Lee", age: "T13", rating: 0, votes: 0, poster: U(ids.eclipse), backdrop: U(ids.eclipse, 1800), status: "soon", release: "30/10/2026", synopsis: "Hai người xa lạ bị mắc kẹt ở một thị trấn ven biển trong mùa cháy rừng và học cách đối diện với điều họ đã bỏ lại." },
];

export const cinemas = [
  { id: "cgv-l81", brand: "CGV", name: "CGV Vincom Landmark 81", area: "Bình Thạnh", dist: "1,2 km" },
  { id: "lotte-nz", brand: "Lotte", name: "Lotte Cinema Nowzone", area: "Quận 5", dist: "3,4 km" },
  { id: "cgv-aeon", brand: "CGV", name: "CGV Aeon Tân Phú", area: "Tân Phú", dist: "7,9 km" },
  { id: "lotte-gv", brand: "Lotte", name: "Lotte Cinema Gò Vấp", area: "Gò Vấp", dist: "6,1 km" },
];

export const combos = [
  { id: "c1", name: "Combo Solo", desc: "1 bắp vừa + 1 nước 22oz", price: 79000, emoji: "🍿" },
  { id: "c2", name: "Combo Đôi", desc: "1 bắp lớn + 2 nước 22oz", price: 129000, emoji: "🥤" },
  { id: "c3", name: "Combo Gia đình", desc: "2 bắp lớn + 3 nước + 1 snack", price: 189000, emoji: "🎬" },
  { id: "c4", name: "Hotdog phô mai", desc: "Xúc xích Đức, sốt phô mai", price: 45000, emoji: "🌭" },
  { id: "c5", name: "Nachos", desc: "Nachos giòn kèm sốt phô mai", price: 59000, emoji: "🧀" },
  { id: "c6", name: "Nước suối", desc: "Chai 500ml", price: 20000, emoji: "💧" },
];

export const PRICE = { normal: 90000, vip: 120000 };
export const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

const WD = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const pad = (n: number) => String(n).padStart(2, "0");
export function dayInfo(offset: number) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  const short = offset === 0 ? "Hôm nay" : offset === 1 ? "Ngày mai" : WD[d.getDay()].replace("Thứ ", "T").replace("Chủ nhật", "CN");
  return { offset, short, num: pad(d.getDate()), label: `${WD[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}` };
}

export function hash(s: string) { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

export function getShows(movieId: number, cinemaIdx: number, dayOffset: number) {
  const seed = movieId * 7 + cinemaIdx * 3 + dayOffset;
  const base = ["10:00", "13:15", "16:20", "19:45", "22:10"];
  const t2 = base.filter((_, i) => (i + seed) % 3 !== 0).map((time) => ({ time, format: "2D" }));
  const t3 = (seed % 2 === 0 ? ["18:00", "21:00"] : ["20:30"]).map((time) => ({ time, format: "3D" }));
  return [...t2, ...t3].sort((a, b) => a.time.localeCompare(b.time));
}

export const seedReviews = [
  { name: "Minh Anh", stars: 5, text: "Hình ảnh và âm thanh quá đỉnh, xem IMAX là đáng tiền nhất. Cái kết làm mình ngồi lại đến hết credit.", when: "2 ngày trước" },
  { name: "Quốc Bảo", stars: 4, text: "Kịch bản chặt, diễn xuất tốt. Đoạn giữa hơi chậm nhưng bù lại phần cuối rất cuốn.", when: "4 ngày trước" },
  { name: "Thu Hà", stars: 4, text: "Nhạc phim hay, đặt ghế VIP hàng giữa xem rất đã. Sẽ rủ bạn đi lần nữa.", when: "1 tuần trước" },
];

export interface AIRecommendation {
  movieId: string;
  title: string;
  rating: number;
  matchReason: string[]; // Ví dụ: ["Nội dung hài hước", "Định dạng IMAX 3D"]
  posterUrl?: string;    // Bổ sung thêm ảnh poster để render card đẹp hơn
}
