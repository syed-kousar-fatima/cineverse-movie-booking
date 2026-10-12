
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  CalendarDays,
  Check,
  Clock3,
  Film,
  Info,
  MapPin,
  Monitor,
  RotateCcw,
  ShieldCheck,
  Ticket,
  Users
} from "lucide-react";
import { getMovieById } from "../data/movies.js";
import { useBooking } from "../context/BookingContext.jsx";
import { formatTime, getImageFallback } from "../utils/helpers.js";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 10;
const MAX_SEATS = 10;

const occupiedSeats = new Set([
  "A3", "A4", "A8", "B2", "B3", "B7", "C5", "C6",
  "D1", "D9", "E4", "E5", "F2", "F8", "G6", "H3"
]);

const getSeatType = (row) =>
  ["G", "H"].includes(row) ? "premium" : "standard";

const getSeatPrice = (basePrice, row) =>
  Math.round(Number(basePrice || 0) + (getSeatType(row) === "premium" ? 50 : 0));

export default function SeatSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const {
    movie,
    theatre,
    showtime,
    seats = [],
    selectMovie,
    selectTheatre,
    selectShowtime,
    toggleSeat
  } = useBooking();

  const [message, setMessage] = useState("");

  const urlMovie = useMemo(() => getMovieById(movieId), [movieId]);
  const activeMovie = movie?.id === movieId ? movie : urlMovie;

  useEffect(() => {
    if (urlMovie && movie?.id !== movieId) {
      selectMovie(urlMovie);
    }
  }, [urlMovie, movie?.id, movieId, selectMovie]);

  const basePrice = Number(showtime?.price ?? activeMovie?.price ?? 0);

  const selectedSeatIds = useMemo(
    () => new Set(seats.map((seat) => String(seat.id))),
    [seats]
  );

  const seatTotal = useMemo(
    () =>
      seats.reduce(
        (total, seat) => total + Number(seat.price ?? basePrice),
        0
      ),
    [seats, basePrice]
  );

  const convenienceFee = seats.length ? 30 : 0;
  const grandTotal = seatTotal + convenienceFee;

  const handleTheatreChange = (theatreId) => {
    const result = selectTheatre(theatreId);
    setMessage(result?.success === false ? result.message || "Unable to select theatre." : "");
  };

  const handleShowtimeChange = (showtimeId) => {
    const result = selectShowtime(showtimeId);
    setMessage(result?.success === false ? result.message || "Unable to select showtime." : "");
  };

  const handleSeatClick = (row, number) => {
    const seatId = `${row}${number}`;

    if (occupiedSeats.has(seatId)) return;

    const isSelected = selectedSeatIds.has(seatId);

    if (!isSelected && seats.length >= MAX_SEATS) {
      setMessage(`You can select up to ${MAX_SEATS} seats per booking.`);
      return;
    }

    const seat = {
      id: seatId,
      number: seatId,
      row,
      type: getSeatType(row),
      price: getSeatPrice(basePrice, row)
    };

    const result = toggleSeat(seat);
    setMessage(result?.success === false ? result.message || "Unable to update seat selection." : "");
  };

  const clearSeats = () => {
    seats.forEach((seat) => toggleSeat(seat));
    setMessage("");
  };

  const continueToCheckout = () => {
    if (!theatre) {
      setMessage("Please select a theatre.");
      return;
    }

    if (!showtime) {
      setMessage("Please select a showtime.");
      return;
    }

    if (!seats.length) {
      setMessage("Please select at least one seat.");
      return;
    }

    navigate("/checkout");
  };

  if (!activeMovie) {
    return (
      <main className="page-container flex min-h-[70vh] items-center justify-center py-28">
        <div className="text-center">
          <Film size={36} className="mx-auto text-cinema-accent" />
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            Movie not found
          </h1>
          <p className="mt-2 text-sm text-cinema-muted">
            Choose a movie from the catalogue to start your booking.
          </p>
          <Link to="/movies" className="primary-button mt-6 inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Browse Movies
          </Link>
        </div>
      </main>
    );
  }

  const availableTheatres = Array.isArray(activeMovie.theatres)
    ? activeMovie.theatres
    : [];

  const activeTheatre = availableTheatres.find((item) => item.id === theatre?.id);
  const availableShowtimes = activeTheatre?.showtimes || [];

  return (
    <main className="min-h-screen w-full overflow-x-clip pb-20 pt-28 sm:pt-32">
      <div className="page-container">
        <Link
          to={`/movie/${activeMovie.id}`}
          className="mb-7 inline-flex items-center gap-2 text-sm text-cinema-muted transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to movie details
        </Link>

        <section className="mb-8 flex flex-col gap-5 rounded-3xl border border-cinema-border bg-cinema-surface p-5 sm:flex-row sm:items-center sm:p-7">
          <img
            src={activeMovie.poster || getImageFallback()}
            alt={`${activeMovie.title} poster`}
            className="hidden h-28 w-20 shrink-0 rounded-xl object-cover sm:block"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getImageFallback();
            }}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent">
              <Ticket size={14} />
              Book your seats
            </div>
            <h1 className="break-words font-display text-2xl font-extrabold text-white sm:text-3xl">
              {activeMovie.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-cinema-muted sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {activeMovie.durationLabel || `${activeMovie.duration || ""} min`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Monitor size={14} />
                {activeMovie.language || "Multiple Languages"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                Today
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-cinema-border bg-cinema-background px-5 py-4 sm:text-right">
            <p className="text-xs text-cinema-muted">Starting from</p>
            <p className="mt-1 text-2xl font-extrabold text-cinema-accent">
              ₹{basePrice.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-cinema-muted">per ticket</p>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-cinema-border bg-cinema-surface p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
              <MapPin size={19} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Select a Theatre</h2>
              <p className="mt-1 text-xs text-cinema-muted">Choose where you want to watch</p>
            </div>
          </div>

          {availableTheatres.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {availableTheatres.map((item) => {
                const isSelected = theatre?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTheatreChange(item.id)}
                    aria-pressed={isSelected}
                    className={`rounded-2xl border p-4 text-left transition duration-200 sm:p-5 ${
                      isSelected
                        ? "border-cinema-accent/60 bg-cinema-accent/10 shadow-glow"
                        : "border-cinema-border bg-cinema-background hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isSelected ? "bg-cinema-accent text-white" : "bg-white/5 text-cinema-muted"
                        }`}>
                          <Monitor size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="break-words font-bold text-white">{item.name}</h3>
                          <p className="mt-1 flex items-start gap-1.5 text-xs text-cinema-muted">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            {item.location || "Cinema location"}
                          </p>
                          <p className="mt-2 text-xs text-cinema-muted">
                            {(item.formats || []).join(" · ")}
                          </p>
                        </div>
                      </div>
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-cinema-accent bg-cinema-accent text-white"
                          : "border-cinema-border text-transparent"
                      }`}>
                        <Check size={14} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-cinema-border p-4 text-sm text-cinema-muted">
              No theatres are listed for this movie.
            </p>
          )}
        </section>

        <section className="mb-8 rounded-3xl border border-cinema-border bg-cinema-surface p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
              <Clock3 size={19} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Choose Show Time</h2>
              <p className="mt-1 text-xs text-cinema-muted">Pick a screening that works for you</p>
            </div>
          </div>

          {!theatre ? (
            <p className="rounded-xl border border-dashed border-cinema-border p-4 text-sm text-cinema-muted">
              Select a theatre first to view available showtimes.
            </p>
          ) : availableShowtimes.length ? (
            <div className="flex flex-wrap gap-3">
              {availableShowtimes.map((item) => {
                const isSelected = showtime?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleShowtimeChange(item.id)}
                    aria-pressed={isSelected}
                    className={`min-w-[100px] rounded-xl border px-4 py-3 text-center transition ${
                      isSelected
                        ? "border-cinema-accent bg-cinema-accent text-white shadow-glow"
                        : "border-cinema-border bg-cinema-background text-cinema-muted hover:border-cinema-accent/50 hover:text-white"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      {item.time ? formatTime(item.time) : "View show"}
                    </span>
                    <span className={`mt-1 block text-[10px] ${
                      isSelected ? "text-white/80" : "text-cinema-muted"
                    }`}>
                      {item.format || "Standard"}
                    </span>
                    <span className="mt-1 block text-xs font-semibold">
                      ₹{Number(item.price ?? activeMovie.price ?? 0).toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-cinema-border p-4 text-sm text-cinema-muted">
              No showtimes are listed for this theatre.
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-cinema-border bg-cinema-surface p-4 sm:p-7">
          <div className="mb-7">
            <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
              Select Your Seats
            </h2>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Choose up to {MAX_SEATS} seats. Occupied seats cannot be selected.
            </p>
          </div>

          {!showtime ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-cinema-border px-5 py-10 text-center">
              <Armchair size={32} className="text-cinema-muted" />
              <p className="mt-4 text-sm font-semibold text-white">Choose a showtime to continue</p>
              <p className="mt-2 text-xs text-cinema-muted">
                Your seat map will be available after selecting a screening.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10 overflow-x-auto pb-3">
                <div className="mx-auto min-w-[470px] max-w-3xl px-2 sm:px-6">
                  <div className="mb-12">
                    <div className="mx-auto h-2 w-[86%] rounded-full bg-gradient-to-r from-transparent via-cinema-accent to-transparent shadow-glow" />
                    <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-cinema-muted">
                      Screen this way
                    </p>
                  </div>

                  <div className="space-y-3">
                    {rows.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-3">
                        <span className="w-4 text-center text-xs font-bold text-cinema-muted">{row}</span>

                        {Array.from({ length: seatsPerRow }, (_, index) => {
                          const number = index + 1;
                          const seatId = `${row}${number}`;
                          const occupied = occupiedSeats.has(seatId);
                          const selected = selectedSeatIds.has(seatId);
                          const premium = getSeatType(row) === "premium";

                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={occupied}
                              onClick={() => handleSeatClick(row, number)}
                              aria-label={`Seat ${seatId}, ${
                                occupied ? "occupied" : selected ? "selected" : premium ? "premium" : "standard"
                              }`}
                              aria-pressed={selected}
                              title={`${seatId} · ₹${getSeatPrice(basePrice, row)}`}
                              className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-t-lg rounded-b-md border transition duration-150 sm:h-9 sm:w-9 ${
                                occupied
                                  ? "cursor-not-allowed border-white/5 bg-white/10 text-white/20"
                                  : selected
                                    ? "scale-110 border-cinema-accent bg-cinema-accent text-white shadow-glow"
                                    : premium
                                      ? "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:border-amber-300 hover:bg-amber-400/20"
                                      : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-400/20"
                              }`}
                            >
                              {selected ? <Check size={14} strokeWidth={2.5} /> : (
                                <span className="text-[9px] font-bold">{number}</span>
                              )}
                            </button>
                          );
                        })}

                        <span className="w-4 text-center text-xs font-bold text-cinema-muted">{row}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] text-cinema-muted sm:gap-x-7 sm:text-xs">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm border border-emerald-400/40 bg-emerald-400/10" />
                      Available
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm border border-amber-400/40 bg-amber-400/10" />
                      Premium
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-cinema-accent" />
                      Selected
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-white/10" />
                      Occupied
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cinema-border bg-cinema-background p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cinema-muted">
                    <Users size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {seats.length} {seats.length === 1 ? "seat" : "seats"} selected
                    </p>
                    <p className="mt-1 break-words text-xs text-cinema-muted">
                      {seats.length ? seats.map((seat) => seat.id).join(", ") : "Tap available seats to select"}
                    </p>
                  </div>
                </div>

                {seats.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSeats}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-cinema-muted transition hover:bg-white/5 hover:text-white"
                  >
                    <RotateCcw size={14} />
                    Clear seats
                  </button>
                )}
              </div>
            </>
          )}

          {message && (
            <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-cinema-accent/30 bg-cinema-accent/10 p-4 text-sm text-white">
              <Info size={17} className="mt-0.5 shrink-0 text-cinema-accent" />
              {message}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-cinema-border bg-cinema-background p-5">
              <h3 className="font-display text-base font-bold text-white">Booking Summary</h3>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-cinema-muted">Movie</span>
                  <span className="max-w-[65%] text-right font-medium text-white">{activeMovie.title}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cinema-muted">Theatre</span>
                  <span className="max-w-[65%] text-right font-medium text-white">{theatre?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cinema-muted">Showtime</span>
                  <span className="font-medium text-white">
                    {showtime?.time ? formatTime(showtime.time) : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cinema-muted">Seats</span>
                  <span className="max-w-[65%] text-right font-medium text-white">
                    {seats.length ? seats.map((seat) => seat.id).join(", ") : "None"}
                  </span>
                </div>
                <div className="h-px bg-cinema-border" />
                <div className="flex justify-between gap-3">
                  <span className="text-cinema-muted">Tickets subtotal</span>
                  <span className="font-medium text-white">₹{seatTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cinema-muted">Convenience fee</span>
                  <span className="font-medium text-white">₹{convenienceFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-cinema-border pt-4">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-xl font-extrabold text-cinema-accent">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cinema-border bg-cinema-background p-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <ShieldCheck size={17} className="text-cinema-success" />
                  Review before checkout
                </div>
                <p className="mt-3 text-xs leading-6 text-cinema-muted">
                  Check your selected theatre, screening, seats, and total before proceeding to checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={continueToCheckout}
                disabled={!theatre || !showtime || seats.length === 0}
                className="primary-button flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue to Checkout
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
