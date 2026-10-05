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
import { movies, movieThemes } from "./data";
import type { CSSProperties } from "react";

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
  const movieId = Number(path.match(/^\/movie\/(\d+)$/)?.[1] || query.get("movie") || booking.movieId);
  const activeMovie = movies.find((item) => item.id === movieId) || movies[0];
  const backdrop = activeMovie.backdrop;
  const theme = movieThemes[activeMovie.themeKey || "space"];
  const themeStyle = { "--film-accent": theme.accent, "--film-highlight": theme.highlight, "--film-wash": theme.wash, "--film-display": theme.fontFamily } as CSSProperties;

  let page;
  const movie = path.match(/^\/movie\/(\d+)$/);
  if (path === "/login") page = <Auth mode="login" next={next} />;
  else if (path === "/register") page = <Auth mode="register" next={next} />;
  else if (movie) page = <MovieDetail id={Number(movie[1])} autoPlayTrailer={query.get("trailer") === "1"} />;
  else if (path === "/showtimes") page = <Showtimes key={`${query.get("movie") ?? "all"}-${query.get("day") ?? "0"}-${query.get("cinema") ?? "all"}`} movieId={query.get("movie") ? Number(query.get("movie")) : null} initialDay={Number(query.get("day") ?? 0)} initialCinema={query.get("cinema")} />;
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
    <div className="cinema-light relative min-h-screen overflow-x-clip text-[#25272a]" style={themeStyle}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#dedbd4]">
        <img src={backdrop} alt="" className="ambient-poster absolute inset-[-4%] h-[108%] w-[108%] object-cover opacity-45 blur-[22px] transition-opacity duration-700" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(238,235,228,.74),rgba(238,235,228,.58)_48%,rgba(238,235,228,.78)),linear-gradient(0deg,#dedbd4_0%,transparent_45%,rgba(238,235,228,.25))]" />
      </div>
      <div aria-hidden="true" className="film-atmosphere pointer-events-none fixed inset-0 z-[1] transition-colors duration-700" />
      <div className="relative z-10 min-h-screen">
      <Header path={path} />
      {page}
      {!isBooking && <Footer />}
      <Chatbot lift={isBooking} />
      </div>
    </div>
  );
}

export default function App() {
  return <Provider><Routes /></Provider>;
}
