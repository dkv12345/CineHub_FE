# CineHub - Movie Ticketing Web Application

CineHub is a modern, responsive movie ticketing user interface built with React, TypeScript, Vite, and Tailwind CSS. The application covers the complete booking flow: browsing movies, viewing details and trailers, selecting showtimes and cinema branches, choosing seats with real-time price calculation, adding concessions, and completing mock checkout.

---

## Tech Stack

- Framework: React 19 (TypeScript)
- Build Tool: Vite 8
- Styling: Tailwind CSS v4
- Routing: Lightweight client-side hash router
- State Management: React Context API (BookingContext, AuthContext)
- Typography: Outfit / System UI font stack

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- Package manager: npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dkv12345/CineHub_FE.git
   cd CineHub_FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:
```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:8443
```
(If port 8443 is occupied, Vite will assign the next available port or you can pass `PORT=<number> npm run dev`).

### Production Build

To build the static production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## Project Structure

```
CineHub_Movie_Ticketing_UI_v2/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Top navigation header
│   │   ├── Footer.tsx       # Page footer
│   │   └── ui.tsx           # Common buttons, badges, icons, inputs
│   ├── pages/               # Screen views / Route pages
│   │   ├── Home.tsx         # Home page (Hero carousel, Now Showing, Coming Soon)
│   │   ├── MovieDetail.tsx  # Movie details, cast, synopsis, trailer embed
│   │   ├── Showtimes.tsx    # Showtime selection by date and cinema branch
│   │   ├── Seats.tsx        # Interactive seat map (Standard, VIP, Sold status)
│   │   ├── Concessions.tsx  # Food and beverage add-on selection
│   │   ├── Checkout.tsx     # Order review, discount voucher, payment methods
│   │   ├── Result.tsx       # Booking confirmation and e-ticket summary
│   │   ├── MyTickets.tsx    # User ticket history and active tickets
│   │   └── Auth.tsx         # User authentication (Sign in / Sign up)
│   ├── data.ts              # Mock movie data, showtimes, cinemas, and concessions
│   ├── store.tsx            # Global state context for booking and auth
│   ├── router.tsx           # Client-side hash routing utilities
│   ├── index.css            # Global CSS styles and Tailwind CSS v4 imports
│   ├── App.tsx              # Application layout root with route rendering
│   └── main.tsx             # React DOM entrypoint
├── index.html               # HTML document template
├── package.json             # Dependencies and npm scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration with React and Tailwind plugins
```

---

## UI Customization Guide for Contributors

Team members collaborating on UI changes can refer to the following guidelines:

### 1. Modifying Movie and Cinema Data
All static data used throughout the application resides in `src/data.ts`:
- Movie listings: `movies` array (title, poster, backdrop, genre, duration, synopsis, cast, director, rating).
- Cinema locations: `cinemas` array (name, address, formats like 2D, 3D, IMAX).
- Showtime schedules: `showtimes` array.
- Concessions/Combos: `concessions` array (popcorn, drinks, combos, pricing).

### 2. Modifying Pages and Layouts
- Header and navigation: `src/components/Header.tsx`
- Home page hero and movie cards: `src/pages/Home.tsx`
- Movie detail and trailer: `src/pages/MovieDetail.tsx`
- Seat layout and pricing logic: `src/pages/Seats.tsx`
- Checkout and payment methods: `src/pages/Checkout.tsx`
- E-Ticket design: `src/pages/Result.tsx` and `src/pages/MyTickets.tsx`

### 3. Styling and Theme
- Styling is implemented using Tailwind CSS v4 classes directly in JSX.
- Global variables, custom fonts, and base overrides are located in `src/index.css`.
- Key brand color tokens:
  - Primary Accent: `#e50914` (Crimson Red)
  - Secondary Accent / VIP: `#f5b50a` (Gold / Yellow)
  - Background: `#0b0d11` (Deep Charcoal / Black)
  - Surface / Card: `#13161c`

### 4. Routing
Routes are defined and managed in `src/router.tsx` and mapped in `src/App.tsx`.
To navigate programmatically:
```tsx
import { go } from "../router";

// Example navigation
go("/booking/seats");
```
To create links:
```tsx
import { Link } from "../router";

<Link href="/showtimes">Xem lịch chiếu</Link>
```

---

## Development Guidelines

- Use double quotes for strings containing apostrophes or quotes.
- Ensure all JSX tags are properly closed and components export cleanly.
- Verify TypeScript types when adding new fields to movie or booking data structures in `src/data.ts` and `src/store.tsx`.
- Test UI responsiveness on both mobile and desktop viewports before committing.
