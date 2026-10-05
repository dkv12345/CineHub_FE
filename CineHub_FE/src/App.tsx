import { useRoute, Link } from "./router";
import { Provider, useStore } from "./store";
import { Chatbot, Footer, Header } from "./components/Layout";
import { btnPrimary } from "./components/ui";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Showtimes from "./pages/Showtimes";
import Seats from "./pages/Seats";
import Concessions from "./pages/Concessions";
import Checkout from "./pages/Checkout";
import { Failed, Success } from "./pages/Result";
import MyTickets from "./pages/MyTickets";

function Notice({ text, to, cta }: { text: string; to: string; cta: string }) {
  return (
    <main className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div><p className="text-white/50">{text}</p><Link to={to} className={`${btnPrimary} mt-5`}>{cta}</Link></div>
    </main>
  );
}

function Routes() {
  const { path, query } = useRoute();
  const { user, booking } = useStore();
  const next = query.get("next") || "/home";
  const login = (p: string) => `/login?next=${encodeURIComponent(p)}`;
  const isBooking = path.startsWith("/booking");

  let page;
  const movie = path.match(/^\/movie\/(\d+)$/);
  if (path === "/login") page = <Auth mode="login" next={next} />;
  else if (path === "/register") page = <Auth mode="register" next={next} />;
  else if (movie) page = <MovieDetail id={Number(movie[1])} />;
  else if (path === "/showtimes") page = <Showtimes key={query.get("movie") ?? "all"} movieId={query.get("movie") ? Number(query.get("movie")) : null} />;
  else if (isBooking && !user) page = <Notice text="Bạn cần đăng nhập để đặt vé." to={login(path)} cta="Đăng nhập" />;
  else if (isBooking && !booking.movieId) page = <Notice text="Bạn chưa chọn suất chiếu nào." to="/showtimes" cta="Chọn suất chiếu" />;
  else if (path === "/booking/seats") page = <Seats />;
  else if (path === "/booking/concessions") page = <Concessions />;
  else if (path === "/booking/checkout") page = <Checkout />;
  else if (path === "/result/success") page = <Success />;
  else if (path === "/result/failed") page = <Failed reason={query.get("reason") || "error"} />;
  else if (path === "/my-tickets") page = user ? <MyTickets /> : <Notice text="Đăng nhập để xem vé của bạn." to={login("/my-tickets")} cta="Đăng nhập" />;
  else page = <Home />;

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white">
      <Header path={path} />
      {page}
      {!isBooking && <Footer />}
      <Chatbot lift={isBooking} />
    </div>
  );
}

export default function App() {
  return <Provider><Routes /></Provider>;
}
