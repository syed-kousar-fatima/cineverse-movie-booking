
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Ticket,
  UserRound,
  Wallet
} from "lucide-react";
import { useBooking } from "../context/BookingContext.jsx";
import {
  formatCurrency,
  formatTime,
  getSeatCount
} from "../utils/helpers.js";
import {
  validateEmail,
  validateName,
  validatePhone
} from "../utils/validators.js";

const paymentOptions = [
  {
    id: "upi",
    title: "UPI",
    description: "Pay using your UPI app",
    icon: Wallet
  },
  {
    id: "card",
    title: "Credit or debit card",
    description: "Visa, Mastercard and other cards",
    icon: CreditCard
  },
  {
    id: "wallet",
    title: "Digital wallet",
    description: "Pay using your preferred wallet",
    icon: ShieldCheck
  },
  {
    id: "counter",
    title: "Pay at cinema",
    description: "Pay at the theatre counter",
    icon: Ticket
  }
];

const initialCustomer = {
  name: "",
  email: "",
  phone: ""
};

export default function Checkout() {
  const navigate = useNavigate();

  const {
    movie,
    theatre,
    showtime,
    seats,
    customer,
    paymentMethod,
    updateCustomer,
    selectPaymentMethod,
    confirmBooking
  } = useBooking();

  const [values, setValues] = useState({
    ...initialCustomer,
    ...(customer || {})
  });
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const seatCount = getSeatCount(seats || []);
  const seatSubtotal = (seats || []).reduce(
    (total, seat) => total + Number(seat.price || movie?.price || 0),
    0
  );
  const convenienceFee = seatCount > 0 ? 30 : 0;
  const total = seatSubtotal + convenienceFee;

  useEffect(() => {
    if (!pendingConfirmation) {
      return;
    }

    let active = true;

    const finishBooking = async () => {
      try {
        const result = await confirmBooking();

        if (!active) {
          return;
        }

        setPendingConfirmation(false);
        setSubmitting(false);

        if (result?.success === false) {
          setSubmitError(
            result.message || "We couldn't confirm your booking. Please try again."
          );
          return;
        }

        navigate("/confirmation", {
          replace: true,
          state: {
            bookingId: result?.booking?.id || result?.id || null
          }
        });
      } catch {
        if (active) {
          setPendingConfirmation(false);
          setSubmitting(false);
          setSubmitError(
            "Something went wrong while confirming your booking. Please try again."
          );
        }
      }
    };

    finishBooking();

    return () => {
      active = false;
    };
  }, [pendingConfirmation, confirmBooking, navigate]);

  if (!movie || !theatre || !showtime || seatCount === 0) {
    return (
      <main className="page-container flex min-h-[70vh] items-center justify-center py-24">
        <div className="cinema-card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
            <Ticket size={30} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            Your booking is not ready
          </h1>
          <p className="mt-3 text-sm leading-7 text-cinema-muted">
            Choose a movie, showtime, and seats before continuing to checkout.
          </p>
          <Link
            to="/movies"
            className="primary-button mt-6 inline-flex items-center gap-2"
          >
            Browse Movies
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone)
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) {
        delete nextErrors[key];
      }
    });

    if (!acceptedTerms) {
      nextErrors.terms = "Please accept the booking terms to continue.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (!paymentMethod) {
      setSubmitError("Please choose a payment method.");
      return;
    }

    setSubmitting(true);

    updateCustomer({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim()
    });

    selectPaymentMethod(paymentMethod);
    setPendingConfirmation(true);
  };

  return (
    <main className="min-h-screen w-full pb-20 pt-28 sm:pt-32">
      <div className="page-container">
        <Link
          to={`/seats/${movie.id}`}
          className="inline-flex items-center gap-2 text-sm text-cinema-muted transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to seat selection
        </Link>

        <div className="mb-8 mt-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cinema-accent">
            Almost there
          </p>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Complete your booking
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-cinema-muted">
            Enter your contact details, choose a payment method, and review your
            cinema reservation.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
          <form onSubmit={handleSubmit} className="space-y-7">
            <section className="cinema-card p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                  <UserRound size={21} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Contact information
                  </h2>
                  <p className="mt-1 text-xs text-cinema-muted">
                    Your booking details will be associated with this information.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={values.name || ""}
                    onChange={handleChange}
                    className="input-field w-full"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-xs text-rose-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email || ""}
                    onChange={handleChange}
                    className="input-field w-full"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-xs text-rose-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    Mobile number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your mobile number"
                    value={values.phone || ""}
                    onChange={handleChange}
                    className="input-field w-full"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-2 text-xs text-rose-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="cinema-card p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                  <CreditCard size={21} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Payment method
                  </h2>
                  <p className="mt-1 text-xs text-cinema-muted">
                    Select how you would like to pay.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = paymentMethod === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        selectPaymentMethod(option.id);
                        setSubmitError("");
                      }}
                      aria-pressed={selected}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition duration-200 ${
                        selected
                          ? "border-cinema-accent bg-cinema-accent/10"
                          : "border-cinema-border bg-black/10 hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-cinema-accent/15 text-cinema-accent"
                            : "bg-white/5 text-cinema-muted"
                        }`}
                      >
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">
                          {option.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-cinema-muted">
                          {option.description}
                        </p>
                      </div>
                      <span
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-cinema-accent bg-cinema-accent"
                            : "border-cinema-muted/50"
                        }`}
                      >
                        {selected && (
                          <CheckCircle2 size={12} className="text-white" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-cinema-border bg-white/[0.025] p-4">
                <LockKeyhole
                  size={17}
                  className="mt-0.5 shrink-0 text-cinema-muted"
                />
                <p className="text-xs leading-6 text-cinema-muted">
                  This is a frontend demonstration. No real payment is collected
                  or processed by these payment options.
                </p>
              </div>
            </section>

            <div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cinema-border bg-cinema-surface/50 p-4">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => {
                    setAcceptedTerms(event.target.checked);
                    setErrors((current) => ({
                      ...current,
                      terms: ""
                    }));
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-cinema-accent"
                />
                <span className="text-sm leading-6 text-cinema-muted">
                  I have reviewed my booking details and agree to the booking
                  terms and cancellation policy.
                </span>
              </label>
              {errors.terms && (
                <p className="mt-2 text-xs text-rose-400">{errors.terms}</p>
              )}
            </div>

            {submitError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-300"
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="primary-button flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Confirming booking...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <section className="cinema-card overflow-hidden">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={movie.backdrop || movie.poster}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = movie.poster || "";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-surface via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-200">
                    Your movie
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-white">
                    {movie.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs text-cinema-muted">Cinema</p>
                  <p className="mt-1 font-semibold text-white">{theatre.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-cinema-muted">
                    <MapPin size={13} />
                    {theatre.location || theatre.address || "Cinema location"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.035] p-3">
                    <p className="text-xs text-cinema-muted">Showtime</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {showtime.time ? formatTime(showtime.time) : "Selected"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.035] p-3">
                    <p className="text-xs text-cinema-muted">Format</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {showtime.format || "Standard"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-cinema-muted">
                    Selected seats ({seatCount})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {seats.map((seat) => (
                      <span
                        key={seat.id || seat.seatId || seat.label}
                        className="rounded-lg border border-cinema-accent/30 bg-cinema-accent/10 px-2.5 py-1.5 text-xs font-semibold text-rose-200"
                      >
                        {seat.label || seat.id || seat.seatId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="cinema-card p-5">
              <h2 className="font-display text-lg font-bold text-white">
                Price summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-cinema-muted">
                    Tickets ({seatCount})
                  </span>
                  <span className="font-medium text-white">
                    {formatCurrency(seatSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-cinema-muted">Convenience fee</span>
                  <span className="font-medium text-white">
                    {formatCurrency(convenienceFee)}
                  </span>
                </div>
                <div className="border-t border-cinema-border pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-display text-2xl font-bold text-cinema-accent">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-cinema-muted">
                Final pricing shown here is for demonstration purposes.
              </p>
            </section>

            <div className="flex items-start gap-3 rounded-xl border border-cinema-border px-4 py-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-cinema-success"
              />
              <p className="text-xs leading-5 text-cinema-muted">
                Review your movie, cinema, showtime, and seats before confirming.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
