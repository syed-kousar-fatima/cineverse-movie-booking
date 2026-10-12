
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Film,
  Home,
  MapPin,
  Printer,
  ShieldCheck,
  Ticket
} from "lucide-react";
import { useBooking } from "../context/BookingContext.jsx";
import {
  formatCurrency,
  formatDate,
  formatTime,
  generateBookingId,
  getSeatCount
} from "../utils/helpers.js";

export default function Confirmation() {
  const navigate = useNavigate();

  const {
    movie,
    theatre,
    showtime,
    seats,
    customer,
    paymentMethod,
    booking,
    resetBooking
  } = useBooking();

  if (!booking) {
    return (
      <main className="page-container flex min-h-[70vh] items-center justify-center py-24">
        <div className="cinema-card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
            <Ticket size={30} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            No booking to display
          </h1>
          <p className="mt-3 text-sm leading-7 text-cinema-muted">
            Your confirmed booking details will appear here after you complete
            checkout.
          </p>
          <Link
            to="/movies"
            className="primary-button mt-6 inline-flex items-center gap-2"
          >
            Browse Movies
            <Film size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const confirmedMovie = booking.movie || movie;
  const confirmedTheatre = booking.theatre || theatre;
  const confirmedShowtime = booking.showtime || showtime;
  const confirmedSeats = booking.seats || seats || [];
  const confirmedCustomer = booking.customer || customer || {};
  const confirmedPaymentMethod = booking.paymentMethod || paymentMethod;

  const bookingId =
    booking.id ||
    booking.bookingId ||
    generateBookingId();

  const bookingDate =
    booking.createdAt ||
    booking.date ||
    new Date().toISOString();

  const seatCount = getSeatCount(confirmedSeats);

  const seatSubtotal = confirmedSeats.reduce(
    (sum, seat) =>
      sum + Number(seat.price || confirmedMovie?.price || 0),
    0
  );

  const convenienceFee = seatCount > 0 ? 30 : 0;

  const total =
    Number(booking.total ?? booking.totalAmount ?? NaN) ||
    seatSubtotal + convenienceFee;

  const paymentLabels = {
    upi: "UPI",
    card: "Credit or debit card",
    wallet: "Digital wallet",
    counter: "Pay at cinema"
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    resetBooking();
    navigate("/movies", { replace: true });
  };

  return (
    <main className="min-h-screen w-full pb-20 pt-28 sm:pt-32 print:bg-white print:pb-0 print:pt-0">
      <div className="page-container max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-cinema-muted transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-cinema-success/25 bg-cinema-success/10 px-3 py-2 text-xs font-semibold text-cinema-success">
            <ShieldCheck size={15} />
            Booking confirmed
          </span>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-cinema-border bg-cinema-surface print:border-gray-300 print:bg-white">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cinema-success/10 blur-3xl print:hidden" />
          <div className="absolute -left-20 top-40 h-48 w-48 rounded-full bg-cinema-accent/10 blur-3xl print:hidden" />

          <div className="relative px-5 py-10 text-center sm:px-10 sm:py-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cinema-success/30 bg-cinema-success/10 text-cinema-success shadow-[0_0_40px_rgba(34,197,94,0.12)] print:border-green-600 print:bg-white">
              <CheckCircle2 size={42} strokeWidth={1.7} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-cinema-success print:text-green-700">
              It's showtime
            </p>

            <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-5xl print:text-black">
              You're all set!
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-cinema-muted print:text-gray-600 sm:text-base">
              Your movie booking has been confirmed. Keep your booking
              information handy for your cinema visit.
            </p>

            <div className="mx-auto mt-7 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-cinema-border bg-black/20 px-4 py-3 print:border-gray-300 print:bg-white">
              <Ticket size={17} className="shrink-0 text-cinema-accent print:text-black" />
              <span className="text-xs text-cinema-muted print:text-gray-600">
                Booking reference
              </span>
              <span className="break-all font-mono text-sm font-bold tracking-wide text-white print:text-black">
                {bookingId}
              </span>
            </div>
          </div>

          <div className="relative border-t border-dashed border-cinema-border print:border-gray-300">
            <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cinema-background print:hidden" />
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cinema-background print:hidden" />

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="p-5 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="mx-auto w-36 shrink-0 overflow-hidden rounded-xl border border-cinema-border sm:mx-0 sm:w-40 print:border-gray-300">
                    <img
                      src={confirmedMovie?.poster}
                      alt={confirmedMovie?.title || "Movie poster"}
                      className="aspect-[2/3] w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-cinema-accent print:text-gray-600">
                      Your movie
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl print:text-black">
                      {confirmedMovie?.title || "Cinema booking"}
                    </h2>

                    {confirmedMovie?.genres?.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                        {confirmedMovie.genres.map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full border border-cinema-border px-3 py-1 text-xs text-cinema-muted print:border-gray-300 print:text-gray-600"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center justify-center gap-3 sm:justify-start">
                        <MapPin size={16} className="shrink-0 text-cinema-accent print:text-gray-600" />
                        <span className="text-cinema-muted print:text-gray-700">
                          {confirmedTheatre?.name || "Cinema"}
                          {confirmedTheatre?.location
                            ? ` · ${confirmedTheatre.location}`
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-3 sm:justify-start">
                        <CalendarDays size={16} className="shrink-0 text-cinema-accent print:text-gray-600" />
                        <span className="text-cinema-muted print:text-gray-700">
                          {confirmedShowtime?.date ||
                            formatDate(bookingDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-3 sm:justify-start">
                        <Clock3 size={16} className="shrink-0 text-cinema-accent print:text-gray-600" />
                        <span className="text-cinema-muted print:text-gray-700">
                          {confirmedShowtime?.time
                            ? formatTime(confirmedShowtime.time)
                            : "Showtime confirmed"}
                          {confirmedShowtime?.format
                            ? ` · ${confirmedShowtime.format}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-cinema-border bg-black/15 p-5 print:border-gray-300 print:bg-white">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-cinema-muted print:text-gray-600">
                        Your seats
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {confirmedSeats.length > 0 ? (
                          confirmedSeats.map((seat, index) => {
                            const label =
                              seat.label ||
                              seat.id ||
                              seat.seatId ||
                              `Seat ${index + 1}`;

                            return (
                              <span
                                key={`${label}-${index}`}
                                className="rounded-lg border border-cinema-accent/30 bg-cinema-accent/10 px-3 py-2 text-sm font-bold text-rose-200 print:border-gray-400 print:bg-white print:text-black"
                              >
                                {label}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-sm text-cinema-muted print:text-gray-600">
                            Seat details unavailable
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-cinema-muted print:text-gray-600">
                        Number of tickets
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white print:text-black">
                        {seatCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-cinema-border p-4 print:border-gray-300">
                    <p className="text-xs text-cinema-muted print:text-gray-600">
                      Booking name
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-white print:text-black">
                      {confirmedCustomer?.name || "Guest"}
                    </p>
                    {confirmedCustomer?.email && (
                      <p className="mt-1 break-all text-xs text-cinema-muted print:text-gray-600">
                        {confirmedCustomer.email}
                      </p>
                    )}
                    {confirmedCustomer?.phone && (
                      <p className="mt-1 text-xs text-cinema-muted print:text-gray-600">
                        {confirmedCustomer.phone}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-cinema-border p-4 print:border-gray-300">
                    <p className="text-xs text-cinema-muted print:text-gray-600">
                      Payment method
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white print:text-black">
                      {paymentLabels[confirmedPaymentMethod] ||
                        confirmedPaymentMethod ||
                        "Not specified"}
                    </p>
                    <p className="mt-1 text-xs text-cinema-muted print:text-gray-600">
                      Demo payment confirmation
                    </p>
                  </div>
                </div>
              </div>

              <aside className="border-t border-cinema-border bg-white/[0.02] p-5 sm:p-8 lg:border-l lg:border-t-0 print:border-gray-300 print:bg-white">
                <h3 className="font-display text-xl font-bold text-white print:text-black">
                  Payment summary
                </h3>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-cinema-muted print:text-gray-600">
                      Tickets ({seatCount})
                    </span>
                    <span className="text-right font-medium text-white print:text-black">
                      {formatCurrency(seatSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-cinema-muted print:text-gray-600">
                      Convenience fee
                    </span>
                    <span className="text-right font-medium text-white print:text-black">
                      {formatCurrency(convenienceFee)}
                    </span>
                  </div>

                  <div className="border-t border-cinema-border pt-4 print:border-gray-300">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-white print:text-black">
                        Total paid
                      </span>
                      <span className="font-display text-2xl font-extrabold text-cinema-success print:text-black">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-cinema-success/20 bg-cinema-success/5 p-4 print:border-gray-300 print:bg-white">
                  <div className="flex items-center gap-2 text-cinema-success print:text-green-700">
                    <Check size={17} />
                    <span className="text-sm font-semibold">
                      Reservation successful
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-cinema-muted print:text-gray-600">
                    Keep your reference number available when visiting the
                    cinema. This website currently uses demonstration booking
                    data and does not issue a real cinema ticket.
                  </p>
                </div>

                <div className="mt-7 space-y-3 print:hidden">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="secondary-button flex w-full items-center justify-center gap-2"
                  >
                    <Printer size={17} />
                    Print booking
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="secondary-button flex w-full items-center justify-center gap-2"
                  >
                    <Download size={17} />
                    Save as PDF
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={handleNewBooking}
            className="primary-button inline-flex items-center justify-center gap-2"
          >
            <Ticket size={18} />
            Book Another Movie
          </button>
          <Link
            to="/"
            className="secondary-button inline-flex items-center justify-center gap-2"
          >
            <Home size={17} />
            Return Home
          </Link>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 12mm;
          }

          body {
            background: white !important;
            color: black !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}
