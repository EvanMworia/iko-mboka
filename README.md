## Iko Mboka / KaziNear

**Iko Mboka (a.k.a. KaziNear)** is a full‑stack experiment for discovering niche, lesser-known services that people might get an impromptu need for urgently. KaziNear attempts to bridge that gap by connecting you to  **trusted, nearby service providers** (plumbers, electricians, cleaners, etc.) based on a user’s **live location**, with **ratings, reviews**, and an **AI review summarizer** on top.

Think of it as a location‑aware marketplace where:
- **Users** pick a service, share their location, and get back nearby vetted providers.
- **Providers** can register their services and show up in local search results.
- **AI** helps users quickly understand sentiments and themes across many reviews.

This repo contains both the **frontend (React + Vite)** and **backend (Node.js/Express + MS SQL Server)** code, plus SQL/stored procedures for proximity search and analytics.

---

## High‑Level Architecture

- **Frontend (`frontend/`)**
  - React (Vite) SPA using **React Router**.
  - Tailwind‑style utility classes for layout and styling.
  - Talks directly to the backend on `http://localhost:5000`.
  - Uses browser **Geolocation API** + `localStorage` to capture and reuse user coordinates.

- **Backend (`backend/`)**
  - Node.js **Express** server.
  - Connects to **MS SQL Server** via `mssql`.
  - Exposes REST APIs for:
    - Listing services.
    - Registering and finding nearby providers.
    - Fetching provider details and reviews.
    - Generating **AI summaries** of reviews via **Genkit + Google Gemini**.
  - Uses stored procedures (see `backend/db/schema.sql`, `backend/db/stored-procedures/`) for most DB logic (e.g. **Haversine** distance calculations).

- **Database (`backend/db/`)**
  - `dbConnection.js` – central SQL connection configuration using `.env` vars.
  - `dbHelper.js` – `DbHelper` class that wraps stored procedure calls.
  - `schema.sql` – core tables such as `Services`, `ServiceProviders`, `Reviews`, etc.
  - `stored-procedures.sql` – logic for geospatial queries, ratings aggregation, agreements, etc.

Additional design/context is captured in:
- `key-things-to-know.txt`
- `key-endpoints.txt`
- `key-stored-procedures.txt`

---

## What the Project Aims to Achieve

- **Make it easy to find reliable help nearby**
  - User selects a **service** (e.g. plumber).
  - App uses browser geolocation to get **latitude/longitude**.
  - Backend returns **nearby providers** (within a radius in km), optionally filtered by service.

- **Build trust through ratings and reviews**
  - Each provider has reviews with ratings.
  - Provider detail pages show rating averages and review history.

- **Use AI to summarize social proof**
  - Backend aggregates reviews for a provider and calls **Gemini** via **Genkit** to produce a short, human‑readable summary:
    - Common themes.
    - Overall sentiment.
    - Key strengths/weaknesses.

- **Serve as a hackathon‑friendly foundation**
  - The codebase is intentionally simple, focusing on:
    - Core flows (location + service selection + nearby providers).
    - Minimal but real integrations (SQL Server, AI summarization).
  - Extras like authentication, bookings, and payment are left as future enhancements.

---

## Frontend Overview (`frontend/`)

### Tech Stack

- React (Vite)
- React Router (`react-router-dom`)
- Tailwind‑like utility CSS (see `App.css`, `index.css`)
- Lucide icons (`lucide-react`)

### Main Routes (`src/App.jsx`)

- `/` – **Landing page** (`LandingPage/Index.jsx`).
- `/register-service` – Marketing page for **service provider registration** (`ServiceProviders/RegisterService.jsx`).
- `/select-service` – Simple **service selection dropdown** (`Users/SelectService.jsx`).
- `/providers-near-me` – **Nearby providers listing** (`Users/NearbyProviders.jsx`).
- `/provider-details/:id` – **Provider profile + reviews + AI summary** (`ServiceProviders/ProviderDetails.jsx`).

### Key Components

- `components/Reusable/Navbar.jsx`
  - Top navigation bar with logo and basic nav links.

- `components/LandingPage/Index.jsx`
  - Hero content explaining the value proposition (trusted, vetted providers near you).
  - Calls `FindServices` to kick off the “find providers near me” flow.

- `components/Users/FindServices.jsx`
  - Uses `navigator.geolocation.getCurrentPosition` to read the user’s **lat/lng**.
  - Stores coordinates in `localStorage` as `Latitude` and `Longitude`.
  - Redirects to `/providers-near-me`.

- `components/Users/NearbyProviders.jsx`
  - On mount, fetches available services from `GET http://localhost:5000/services/all`.
  - Renders a dropdown of services.
  - When user selects a service:
    - Reads `Latitude` and `Longitude` from `localStorage`.
    - Calls `POST http://localhost:5000/providers/near-me/by/service` with `{ Latitude, Longitude, RadiusKm, ServiceId }`.
    - Renders the result as a grid of `ProviderCard`s.
  - Clicking a provider navigates to `/provider-details/:id`.

- `components/ServiceProviders/ProviderCard.jsx`
  - Displays provider name, address, optional distance (`DistanceKm`), and rating (`RatingAverage`).

- `components/ServiceProviders/ProviderDetails.jsx`
  - Fetches provider details from `GET http://localhost:5000/providers/provider-details/:id`.
  - Shows profile info (name, service, contact details, address, description, rating).
  - Embeds `Reviews` component for reviews + AI summary.

- `components/Reviews/Reviews.jsx`
  - On mount, fetches all reviews for a provider:
    - `GET http://localhost:5000/reviews/for/provider/:id`.
  - Renders reviews with star ratings and dates.
  - “AI Summary” button calls:
    - `POST http://localhost:5000/reviews/summary/for/provider/:id`.
    - Opens a modal showing the AI‑generated summary.

- `components/Reviews/AiSummarizer.jsx`
  - Currently a stub — can be extended if you want a standalone AI tools page.

- `components/ServiceProviders/RegisterService.jsx`
  - Marketing landing for providers (“Jobs are everywhere, but you aren’t”).
  - Call‑to‑action to register (actual form/logic to be implemented).

---

## Backend Overview (`backend/`)

### Tech Stack

- Node.js / Express (`express`)
- MS SQL Server via `mssql`
- Environment configuration via `dotenv`
- CORS support via `cors`
- AI integration:
  - `genkit`
  - `@genkit-ai/google-genai` (Gemini)
- Stripe (installed but not yet wired up in the exposed routes)

### Server Entry (`server.js`)

- Loads environment variables with `dotenv.config()`.
- Initializes an Express app with:
  - `cors()` for cross‑origin requests.
  - `express.json()` for JSON body parsing.
  - A simple request logger (method, URL, and body).
- Registers routers:
  - `/providers` → `routes/providerRoutes.js`
  - `/reviews` → `routes/reviewsRoutes.js`
  - `/services` → `routes/servicesRoutes.js`
- Listens on `process.env.PORT || 5000`.

### Database Layer

- `db/dbConnection.js`
  - Loads DB config from `.env` (`DB_USER`, `DB_PWD`, `DB_NAME`, `DB_SERVER`).
  - Configures connection pool and SSL options.
  - (Contains a commented-out `test()` helper that queries `SELECT * FROM Services`.)

- `db/dbHelper.js`
  - `DbHelper` wraps `mssql` usage.
  - Provides `executeProcedure(storedProcedure, data)` that:
    - Applies all entries in `data` as input params.
    - Executes the stored procedure and returns results.
  - All routes use this helper to talk to SQL Server.

### Core Routes

- `routes/servicesRoutes.js`
  - `GET /services/all`
    - Calls `sp_GetServices`.
    - Returns list of all services as JSON.

- `routes/providerRoutes.js`
  - `POST /providers/register`
    - Expects `{ FullName, Email, Phone, PasswordHash, ServiceId, Latitude, Longitude, Address }`.
    - Calls `sp_AddServiceProvider`.
  - `GET /providers/by/service`
    - Expects `{ ServiceId }` in body.
    - Calls `sp_GetProvidersByService`.
  - `GET /providers/near-me`
    - Expects `{ Latitude, Longitude, RadiusKm }` in body.
    - Calls `sp_GetProvidersNearLocation`.
  - `POST /providers/near-me/by/service`
    - Expects `{ Latitude, Longitude, RadiusKm, ServiceId }`.
    - Calls `sp_GetProvidersNearLocationByService`.
  - `GET /providers/provider-details/:id`
    - Calls `sp_GetProviderDetails` and returns detailed info for that provider.

- `routes/reviewsRoutes.js`
  - Internal helper `generateReviewSummary(reviews)`
    - Uses `genkit` + `googleAI` with `process.env.GEMINI_API_KEY`.
    - Builds a prompt using ratings and review text.
    - Calls `googleAI.model('gemini-2.5-flash')` to generate a summary.
  - `POST /reviews/add-review`
    - Expects `{ ProviderId, Rating, ReviewText }`.
    - Calls `sp_AddReview`.
  - `GET /reviews/for/provider/:id`
    - Calls `sp_GetReviewsForProvider`.
  - `POST /reviews/summary/for/provider/:id`
    - Fetches reviews via `sp_GetReviewsForProvider`.
    - Runs `generateReviewSummary` and returns `{ summary }`.

> Note: There are placeholder `userRoutes.js`, `agreementRoutes.js`, and `locationRoutes.js` files present, but they are currently empty. `key-endpoints.txt` and `key-stored-procedures.txt` describe planned flows for agreements, price confirmation, and more advanced endpoints.

---

## Key Flows (End‑to‑End)

### 1. User: Find Nearby Providers

1. On the landing page, user clicks **“Find A Service Provider”**.
2. `FindServices.jsx`:
   - Calls `navigator.geolocation.getCurrentPosition`.
   - Saves `Latitude` and `Longitude` to `localStorage`.
   - Redirects to `/providers-near-me`.
3. `NearbyProviders.jsx`:
   - Fetches service list from `GET /services/all`.
   - User selects a service from the dropdown.
   - Component reads `Latitude`/`Longitude` from `localStorage`.
   - Sends `POST /providers/near-me/by/service` with location + selected service.
   - Displays the returned providers using `ProviderCard`.

### 2. User: View Provider Details + Reviews + AI Summary

1. From `/providers-near-me`, user clicks on a provider card.
2. React Router navigates to `/provider-details/:id`.
3. `ProviderDetails.jsx`:
   - Fetches provider data from `GET /providers/provider-details/:id`.
   - Displays contact info, address, service, average rating, etc.
   - Embeds the `Reviews` component.
4. `Reviews.jsx`:
   - Fetches reviews from `GET /reviews/for/provider/:id`.
   - Shows per‑review rating and text.
   - When user clicks **“AI Summary”**, calls:
     - `POST /reviews/summary/for/provider/:id`.
     - Backend runs the Genkit/Gemini summary and returns text.
   - A modal renders the summary to the user.

---

## Getting Started (Local Development)

### Prerequisites

- Node.js (LTS recommended).
- MS SQL Server (local or remote) with a database matching `schema.sql`.
- API keys for:
  - **Gemini** (`GEMINI_API_KEY`) for AI summarization.
  - (Optionally) **Google Geocoding** and **Distance Matrix** if/when you wire those into the backend.

---

### 1. Backend Setup (`backend/`)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` (same folder as `db/`) with at least:
   ```env
   DB_USER=your_sql_username
   DB_PWD=your_sql_password
   DB_NAME=your_db_name
   DB_SERVER=your_db_server
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

3. Make sure your SQL Server has the tables and stored procedures from `db/schema.sql` and `db/stored-procedures/stored-procedures.sql` (and any other SQL files you create).

4. Start the backend:
   ```bash
   npm run start
   ```
   By default, the server listens on `http://localhost:5000`.

---

### 2. Frontend Setup (`frontend/`)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open the printed `http://localhost:5173` (or similar) in your browser.

The frontend expects the backend to be running on `http://localhost:5000`. If you change the backend port, update the hard‑coded URLs in the frontend components accordingly.

---

## Useful Internal Docs

- `frontend/README.md`
  - Default Vite+React template notes (linting, React compiler, etc.).

- `key-things-to-know.txt`
  - High‑level description of **core APIs**, core flow, and hackathon‑friendly scope.

- `key-endpoints.txt`
  - Human‑readable table of planned endpoints and their purpose.

- `key-stored-procedures.txt`
  - Human‑readable overview of important stored procedures (e.g., Haversine‑based proximity search, top‑rated providers, service summary, agreements).

---

## Future Directions & Ideas

Some ideas that are partially planned in this repo but not fully implemented yet:

- **Authentication & Accounts**
  - Real user/provider accounts (JWT, password reset, etc.).

- **Bookings & Price Agreements**
  - Endpoints for **price confirmation**, booking requests, and agreement tracking.
  - Stored procedures like `sp_AddPriceConfirmation`, `sp_GetAgreementsByProvider`, `sp_GetAgreementsByUserTemp`.

- **Maps & Visual Discovery**
  - Embedding **Google Maps** to show providers on a map.
  - Using **Google Geocoding** and **Distance Matrix** more deeply.

- **Payments**
  - Integrate **Stripe** to handle deposits, escrow, or direct payments.

- **Advanced Analytics**
  - Use `sp_GetServiceSummary` and other analytics procs for dashboards (e.g., most in‑demand services, average response times, etc.).

Use this README as your north star when you come back later: it tells you **what exists today**, **what’s wired up**, and **where you intended to take the project next**.

