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
  themeKey?: MovieThemeKey; country?: string; studio?: string;
};

export type MovieThemeKey = "space" | "scarlet" | "ocean" | "noir" | "earth" | "ghibli" | "conan" | "doraemon" | "western" | "china" | "korea";

export const movieThemes: Record<MovieThemeKey, { accent: string; highlight: string; wash: string; fontFamily: string }> = {
  space: { accent: "#5d86c7", highlight: "#e0b968", wash: "rgba(75, 115, 177, .13)", fontFamily: "'Barlow Condensed', sans-serif" },
  scarlet: { accent: "#b94b56", highlight: "#edbb75", wash: "rgba(185, 75, 86, .14)", fontFamily: "'Oswald', sans-serif" },
  ocean: { accent: "#3299b9", highlight: "#e4b768", wash: "rgba(50, 153, 185, .14)", fontFamily: "'Space Grotesk', sans-serif" },
  noir: { accent: "#7667a8", highlight: "#e1b95f", wash: "rgba(118, 103, 168, .14)", fontFamily: "'DM Serif Display', serif" },
  earth: { accent: "#ad7953", highlight: "#d4a85e", wash: "rgba(173, 121, 83, .13)", fontFamily: "'Cormorant Garamond', serif" },
  ghibli: { accent: "#548b60", highlight: "#dbb957", wash: "rgba(84, 139, 96, .15)", fontFamily: "'Cormorant Garamond', serif" },
  conan: { accent: "#3867a8", highlight: "#c94d58", wash: "rgba(56, 103, 168, .15)", fontFamily: "'Barlow Condensed', sans-serif" },
  doraemon: { accent: "#309bbf", highlight: "#ef866d", wash: "rgba(48, 155, 191, .15)", fontFamily: "'Fredoka', sans-serif" },
  western: { accent: "#a66b4e", highlight: "#d5b060", wash: "rgba(166, 107, 78, .14)", fontFamily: "'Playfair Display', serif" },
  china: { accent: "#a94e48", highlight: "#c9a557", wash: "rgba(169, 78, 72, .15)", fontFamily: "'Noto Serif SC', serif" },
  korea: { accent: "#a6537b", highlight: "#d5ae70", wash: "rgba(166, 83, 123, .14)", fontFamily: "'Gowun Dodum', sans-serif" },
};

export const movies: Movie[] = [
  { id: 1, title: "Crimson Orbit", genre: "Khoa học viễn tưởng, Giật gân", duration: "2h 18m", director: "Nolan Reyes", cast: "Mara Voss, Ian Cole", age: "T16", rating: 8.7, votes: 1284, poster: U(ids.eclipse), backdrop: U(ids.hero, 1800), status: "now", release: "Đang chiếu", themeKey: "space", country: "Mỹ", synopsis: "Một nhà du hành nhận được tín hiệu từ rìa Hệ Mặt Trời, thứ vốn không bao giờ được phép chạm tới Trái Đất. Cô phải chọn giữa quay về nhà hoặc lần theo tín hiệu vào bóng tối." },
  { id: 2, title: "Red Horizon", genre: "Hành động, Chính kịch", duration: "2h 05m", director: "Elena Marsh", cast: "Jack Doran, Lin Tao", age: "T18", rating: 8.4, votes: 962, poster: U(ids.redEye), backdrop: U(ids.redEye, 1800), status: "now", release: "Đang chiếu", themeKey: "scarlet", country: "Mỹ", synopsis: "Một cựu đặc vụ buộc phải quay lại chiến trường khi người cuối cùng cô tin tưởng bị bắt cóc giữa cuộc đảo chính." },
  { id: 3, title: "Beyond Earth", genre: "Phiêu lưu, Khoa học viễn tưởng", duration: "1h 58m", director: "Sam Okafor", cast: "Ava Lin, Tom Reid", age: "P", rating: 8.1, votes: 730, poster: U(ids.rocket), backdrop: U(ids.rocket, 1800), status: "now", release: "Đang chiếu", themeKey: "ocean", country: "Anh", synopsis: "Một nhóm học sinh trúng chuyến bay thử nghiệm lên quỹ đạo và phát hiện trạm vũ trụ bỏ hoang không hề trống rỗng." },
  { id: 4, title: "The Last Signal", genre: "Bí ẩn, Giật gân", duration: "1h 52m", director: "Iris Vale", cast: "Noah Park, Sara Bui", age: "T16", rating: 7.9, votes: 511, poster: U(ids.noir), backdrop: U(ids.noir, 1800), status: "now", release: "Đang chiếu", themeKey: "noir", country: "Mỹ", synopsis: "Đêm cuối cùng của một đài phát thanh cũ, người dẫn chương trình nhận cuộc gọi báo trước một vụ án chưa xảy ra." },
  { id: 5, title: "Lost in Silence", genre: "Chính kịch, Bí ẩn", duration: "2h 01m", director: "Hana Ito", cast: "Yuki Mori, Leo Tran", age: "T13", rating: 7.8, votes: 402, poster: U(ids.portrait), backdrop: U(ids.portrait, 1800), status: "now", release: "Đang chiếu", themeKey: "earth", country: "Nhật Bản", synopsis: "Sau tai nạn, một nghệ sĩ dương cầm mất thính giác và dần nhận ra căn nhà của mình còn giữ những âm thanh mà cô không thể nghe." },
  { id: 6, title: "Shadow Protocol", genre: "Hành động, Giật gân", duration: "2h 10m", director: "Marco Diaz", cast: "Rin Kato, Ben Ford", age: "T16", rating: 0, votes: 0, poster: U(ids.shadow), backdrop: U(ids.shadow, 1800), status: "soon", release: "16/10/2026", themeKey: "noir", country: "Mỹ", synopsis: "Một đội điệp viên phát hiện tổ chức của họ đang bị điều khiển bởi chính kẻ thù họ săn đuổi suốt mười năm." },
  { id: 7, title: "Midnight Frequency", genre: "Kinh dị, Bí ẩn", duration: "1h 47m", director: "Lucia Ferro", cast: "Zoe Hart, Kim Ngo", age: "T18", rating: 0, votes: 0, poster: U(ids.hero), backdrop: U(ids.hero, 1800), status: "soon", release: "23/10/2026", themeKey: "noir", country: "Anh", synopsis: "Mỗi đêm lúc 00:00, một tần số lạ phát ra từ chiếc radio hỏng. Càng nghe, người ta càng thấy những điều không nên thấy." },
  { id: 8, title: "Ember Coast", genre: "Chính kịch, Lãng mạn", duration: "2h 12m", director: "Aiko Sato", cast: "Mia Tan, Owen Lee", age: "T13", rating: 0, votes: 0, poster: U(ids.eclipse), backdrop: U(ids.eclipse, 1800), status: "soon", release: "30/10/2026", themeKey: "earth", country: "Nhật Bản", synopsis: "Hai người xa lạ bị mắc kẹt ở một thị trấn ven biển trong mùa cháy rừng và học cách đối diện với điều họ đã bỏ lại." },
  { id: 9, title: "Neon Divide", genre: "Hành động, Khoa học viễn tưởng", duration: "2h 03m", director: "Kai Mercer", cast: "Nia Park, Eli Stone", age: "T16", rating: 8.0, votes: 638, poster: U("photo-1489599849927-2ee91cede3ba"), backdrop: U("photo-1489599849927-2ee91cede3ba", 1800), status: "now", release: "Đang chiếu", themeKey: "western", country: "Mỹ", synopsis: "Một kỹ sư thành phố phải tìm cách tắt mạng lưới điều khiển trước khi nó khóa toàn bộ cư dân bên trong." },
  { id: 10, title: "A Quiet Summer", genre: "Chính kịch, Gia đình", duration: "1h 49m", director: "Lena Brooks", cast: "Mai Nguyen, Theo James", age: "P", rating: 7.6, votes: 384, poster: U("photo-1517604931442-7e0c8ed2963c"), backdrop: U("photo-1517604931442-7e0c8ed2963c", 1800), status: "now", release: "Đang chiếu", themeKey: "earth", country: "Anh", synopsis: "Một gia đình trở về căn nhà ven biển cũ và tìm thấy những bức thư giúp họ nhìn lại mùa hè đã thay đổi tất cả." },
  { id: 11, title: "My Neighbor Totoro", genre: "Hoạt hình, Gia đình", duration: "1h 26m", director: "Hayao Miyazaki", cast: "Noriko Hidaka, Chika Sakamoto", age: "P", rating: 9.1, votes: 2480, poster: U("photo-1470252649378-9c29740c9fa8"), backdrop: U("photo-1470252649378-9c29740c9fa8", 1800), status: "now", release: "Đang chiếu", themeKey: "ghibli", country: "Nhật Bản", studio: "Studio Ghibli", synopsis: "Hai chị em chuyển về vùng quê và khám phá những người bạn kỳ diệu sống giữa khu rừng xanh." },
  { id: 12, title: "Spirited Away", genre: "Hoạt hình, Phiêu lưu", duration: "2h 05m", director: "Hayao Miyazaki", cast: "Rumi Hiiragi, Miyu Irino", age: "T13", rating: 9.0, votes: 2312, poster: U("photo-1511497584788-876760111969"), backdrop: U("photo-1511497584788-876760111969", 1800), status: "now", release: "Đang chiếu", themeKey: "ghibli", country: "Nhật Bản", studio: "Studio Ghibli", synopsis: "Trong một thế giới linh hồn, cô bé Chihiro tìm cách giải cứu cha mẹ và tìm lại tên mình." },
  { id: 13, title: "Howl's Moving Castle", genre: "Hoạt hình, Kỳ ảo", duration: "1h 59m", director: "Hayao Miyazaki", cast: "Chieko Baisho, Takuya Kimura", age: "P", rating: 8.9, votes: 1940, poster: U("photo-1448375240586-882707db888b"), backdrop: U("photo-1448375240586-882707db888b", 1800), status: "soon", release: "18/10/2026", themeKey: "ghibli", country: "Nhật Bản", studio: "Studio Ghibli", synopsis: "Một cô gái trẻ bước vào lâu đài biết đi và chuyến phiêu lưu làm thay đổi định mệnh của cả vùng đất." },
  { id: 14, title: "Detective Conan: The Phantom of Baker Street", genre: "Hoạt hình, Trinh thám", duration: "1h 47m", director: "Kenji Kodama", cast: "Minami Takayama, Wakana Yamazaki", age: "T13", rating: 8.8, votes: 1682, poster: U("photo-1500530855697-b586d89ba3ee"), backdrop: U("photo-1500530855697-b586d89ba3ee", 1800), status: "now", release: "Đang chiếu", themeKey: "conan", country: "Nhật Bản", studio: "Detective Conan", synopsis: "Conan bước vào trò chơi thực tế ảo nơi một vụ án ở London trở thành cuộc đua phá giải bí ẩn." },
  { id: 15, title: "Detective Conan: Black Iron Submarine", genre: "Hoạt hình, Hành động", duration: "1h 50m", director: "Yuzuru Tachikawa", cast: "Minami Takayama, Kappei Yamaguchi", age: "T13", rating: 8.6, votes: 1524, poster: U("photo-1518837695005-2083093ee35b"), backdrop: U("photo-1518837695005-2083093ee35b", 1800), status: "soon", release: "22/10/2026", themeKey: "conan", country: "Nhật Bản", studio: "Detective Conan", synopsis: "Một hệ thống nhận diện toàn cầu kéo Conan vào cuộc điều tra căng thẳng giữa đại dương." },
  { id: 16, title: "Doraemon: Nobita's Sky Utopia", genre: "Hoạt hình, Phiêu lưu", duration: "1h 47m", director: "Takumi Doyama", cast: "Wasabi Mizuta, Megumi Oohara", age: "P", rating: 8.5, votes: 1390, poster: U("photo-1470770841072-f978cf4d019e"), backdrop: U("photo-1470770841072-f978cf4d019e", 1800), status: "now", release: "Đang chiếu", themeKey: "doraemon", country: "Nhật Bản", studio: "Doraemon", synopsis: "Nobita và những người bạn bay đến một hòn đảo trên trời, nơi mọi người đều hoàn hảo." },
  { id: 17, title: "Doraemon: Nobita and the Earth Symphony", genre: "Hoạt hình, Âm nhạc", duration: "1h 55m", director: "Kazuaki Imai", cast: "Wasabi Mizuta, Yumi Kakazu", age: "P", rating: 8.3, votes: 1108, poster: U("photo-1500534623283-312aade485b7"), backdrop: U("photo-1500534623283-312aade485b7", 1800), status: "soon", release: "25/10/2026", themeKey: "doraemon", country: "Nhật Bản", studio: "Doraemon", synopsis: "Một cây sáo kỳ lạ đưa nhóm bạn vào hành trình khôi phục giai điệu đang biến mất khỏi Trái Đất." },
  { id: 18, title: "Seoul, After the Rain", genre: "Chính kịch, Lãng mạn", duration: "1h 54m", director: "Kim Eun-jin", cast: "Kim Tae-ri, Park Bo-gum", age: "T13", rating: 8.4, votes: 1274, poster: U("photo-1519501025264-65ba15a82390"), backdrop: U("photo-1519501025264-65ba15a82390", 1800), status: "now", release: "Đang chiếu", themeKey: "korea", country: "Hàn Quốc", synopsis: "Hai người xa lạ thường gặp nhau trên chuyến tàu cuối và dần học cách bắt đầu lại." },
  { id: 19, title: "The Last Train to Busan", genre: "Giật gân, Sinh tồn", duration: "1h 58m", director: "Lee Do-hyun", cast: "Han So-hee, Wi Ha-jun", age: "T16", rating: 8.2, votes: 985, poster: U("photo-1519608487953-e999c86e7455"), backdrop: U("photo-1519608487953-e999c86e7455", 1800), status: "soon", release: "28/10/2026", themeKey: "korea", country: "Hàn Quốc", synopsis: "Một chuyến tàu đêm bị mắc kẹt giữa khủng hoảng, buộc hành khách phải tin nhau để sống sót." },
  { id: 20, title: "Jade River Chronicles", genre: "Kỳ ảo, Võ hiệp", duration: "2h 08m", director: "Zhang Rui", cast: "Liu Yifei, Xiao Zhan", age: "T13", rating: 8.5, votes: 1126, poster: U("photo-1470252649378-9c29740c9fa8"), backdrop: U("photo-1470252649378-9c29740c9fa8", 1800), status: "now", release: "Đang chiếu", themeKey: "china", country: "Trung Quốc", synopsis: "Một nữ kiếm khách lên đường tìm cuốn thư cổ có thể chấm dứt cuộc tranh đoạt giữa các môn phái." },
  { id: 21, title: "Lanterns Over Shanghai", genre: "Chính kịch, Lịch sử", duration: "2h 01m", director: "Chen Wei", cast: "Zhou Dongyu, Hu Ge", age: "T13", rating: 8.1, votes: 864, poster: U("photo-1519608487953-e999c86e7455"), backdrop: U("photo-1519608487953-e999c86e7455", 1800), status: "soon", release: "31/10/2026", themeKey: "china", country: "Trung Quốc", synopsis: "Một người đưa thư băng qua Thượng Hải những năm cũ để giữ lời hứa với gia đình." },
  { id: 22, title: "London in Bloom", genre: "Hài, Lãng mạn", duration: "1h 46m", director: "Amelia Clarke", cast: "Florence Pugh, Dev Patel", age: "T13", rating: 8.0, votes: 742, poster: U("photo-1513635269975-59663e0ac1ad"), backdrop: U("photo-1513635269975-59663e0ac1ad", 1800), status: "now", release: "Đang chiếu", themeKey: "western", country: "Anh", synopsis: "Một nhà thực vật học và một nhạc công cùng chăm sóc khu vườn cộng đồng giữa lòng London." },
  { id: 23, title: "The Archive of Small Things", genre: "Bí ẩn, Chính kịch", duration: "2h 04m", director: "Noah Williams", cast: "Greta Lee, Paul Mescal", age: "T16", rating: 8.2, votes: 803, poster: U("photo-1518709268805-4e9042af9f23"), backdrop: U("photo-1518709268805-4e9042af9f23", 1800), status: "soon", release: "02/11/2026", themeKey: "western", country: "Mỹ", synopsis: "Một thủ thư tìm thấy những lá thư chưa từng được gửi và lần theo câu chuyện của một thị trấn." },
  { id: 24, title: "Summer on the West Side", genre: "Âm nhạc, Chính kịch", duration: "1h 51m", director: "Jordan Ellis", cast: "Ayo Edebiri, Jeremy Allen White", age: "T13", rating: 7.9, votes: 697, poster: U("photo-1500534623283-312aade485b7"), backdrop: U("photo-1500534623283-312aade485b7", 1800), status: "now", release: "Đang chiếu", themeKey: "western", country: "Mỹ", synopsis: "Một ban nhạc nhỏ tìm lại cảm hứng trong mùa hè cuối cùng trước khi câu lạc bộ địa phương đóng cửa." },
];

export const cinemas = [
  { id: "cgv-l81", brand: "CGV", name: "CGV Vincom Landmark 81", area: "Bình Thạnh", dist: "1,2 km" },
  { id: "lotte-nz", brand: "Lotte", name: "Lotte Cinema Nowzone", area: "Quận 5", dist: "3,4 km" },
  { id: "cgv-aeon", brand: "CGV", name: "CGV Aeon Tân Phú", area: "Tân Phú", dist: "7,9 km" },
  { id: "lotte-gv", brand: "Lotte", name: "Lotte Cinema Gò Vấp", area: "Gò Vấp", dist: "6,1 km" },
  { id: "bhd-bitexco", brand: "BHD", name: "BHD Star Bitexco", area: "Quận 1", dist: "2,6 km" },
];

export const combos = [
  { id: "c1", name: "Combo Solo", desc: "1 bắp vừa + 1 nước 22oz", price: 79000, emoji: "🍿" },
  { id: "c2", name: "Combo Đôi", desc: "1 bắp lớn + 2 nước 22oz", price: 129000, emoji: "🥤" },
  { id: "c3", name: "Combo Gia đình", desc: "2 bắp lớn + 3 nước + 1 snack", price: 189000, emoji: "🎬" },
  { id: "c4", name: "Hotdog phô mai", desc: "Xúc xích Đức, sốt phô mai", price: 45000, emoji: "🌭" },
  { id: "c5", name: "Nachos", desc: "Nachos giòn kèm sốt phô mai", price: 59000, emoji: "🧀" },
  { id: "c6", name: "Nước suối", desc: "Chai 500ml", price: 20000, emoji: "💧" },
];

export const PRICE = { normal: 90000, vip: 120000, sweetbox: 150000 };
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
  const imax = cinemaIdx % 2 === 0 ? [{ time: "17:30", format: "IMAX" }] : [];
  return [...t2, ...t3, ...imax].sort((a, b) => a.time.localeCompare(b.time));
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
