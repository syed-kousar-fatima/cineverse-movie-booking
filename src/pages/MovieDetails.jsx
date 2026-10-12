
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Film,
  MapPin,
  Play,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  Volume2
} from "lucide-react";
import { getMovieById } from "../data/movies.js";
import { useBooking } from "../context/BookingContext.jsx";
import {
  formatDuration,
  formatTime,
  getImageFallback
} from "../utils/helpers.js";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const {
    selectMovie,
    selectTheatre,
    selectShowtime
  } = useBooking();

  const movie = useMemo(() => getMovieById(movieId), [movieId]);

  const bookingDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dayNumber = String(date.getDate()).padStart(2, "0");

      return {
        value: `${year}-${month}-${dayNumber}`,
        day:
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : date.toLocaleDateString("en-IN", {
                  weekday: "short"
                }),
        date: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short"
        })
      };
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");

  if (!movie) {
    return (
      <main className="page-container flex min-h-[70vh] items-center justify-center py-24">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-cinema-border bg-cinema-surface text-cinema-accent">
            <Film size={36} />
          </div>

          <h1 className="font-display text-3xl font-bold text-white">
            Movie not found
          </h1>

          <p className="mt-3 text-sm leading-7 text-cinema-muted">
            This movie may no longer be available. Explore our collection to
            find your next cinema experience.
          </p>

          <Link
            to="/movies"
            className="primary-button mt-7 inline-flex items-center gap-2"
          >
            Explore Movies
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const rating = Number(movie.rating || 0);
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const cast = Array.isArray(movie.cast) ? movie.cast : [];

  const languages = Array.isArray(movie.languages)
    ? movie.languages
    : movie.language
      ? [movie.language]
      : [];

  const duration =
    movie.durationLabel ||
    (movie.duration
      ? formatDuration(movie.duration)
      : "Duration unavailable");

  const backdrop = movie.backdrop || movie.poster || getImageFallback();
  const poster = movie.poster || getImageFallback();

  const selectedDateInfo = bookingDates.find(
    (date) => date.value === selectedDate
  );

  const handleBookMovie = () => {
    if (!selectedDate || !selectedTheatre || !selectedShowtime) {
      setBookingMessage(
        "Please choose a date, select a theatre, and choose a showtime before proceeding to seat selection."
      );

      document.getElementById("showtime-selection")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    selectMovie(movie);
    selectTheatre(selectedTheatre);
    selectShowtime(selectedShowtime);

    navigate(`/seats/${movie.id}`, {
      state: {
        bookingDate: selectedDate,
        movieId: movie.id,
        theatreId: selectedTheatre.id,
        showtimeId: selectedShowtime.id
      }
    });
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedShowtime(null);
    setBookingMessage("");
  };

  const handleSelectTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedShowtime(null);
    setBookingMessage("");
  };

  const handleSelectShowtime = (theatre, showtime) => {
    if (!selectedDate) {
      setBookingMessage("Please select a date before choosing a showtime.");
      return;
    }

    if (selectedTheatre?.id !== theatre.id) {
      setBookingMessage("Please select this theatre first.");
      return;
    }

    setSelectedShowtime(showtime);
    setBookingMessage("");
  };

  return (
    <main className="min-h-screen w-full overflow-hidden">
      <section className="relative isolate min-h-[580px] w-full overflow-hidden lg:min-h-[680px]">
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getImageFallback();
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cinema-background via-cinema-background/90 to-cinema-background/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cinema-background via-transparent to-cinema-background/30" />

        <div className="page-container flex min-h-[580px] flex-col justify-center py-28 sm:py-32 lg:min-h-[680px]">
          <Link
            to="/movies"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to movies
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
            <div className="max-w-3xl animate-slide-up">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {movie.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cinema-accent/30 bg-cinema-accent/15 px-3 py-1.5 text-xs font-semibold text-rose-300">
                    <CheckCircle2 size={14} />
                    Featured movie
                  </span>
                )}

                {movie.category && (
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                    {movie.category}
                  </span>
                )}

                {movie.certificate && (
                  <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80">
                    {movie.certificate}
                  </span>
                )}
              </div>

              <h1 className="break-words font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-4 text-base font-medium text-rose-200 sm:text-lg">
                  {movie.tagline}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/75">
                <span className="inline-flex items-center gap-2">
                  <Star
                    size={17}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <strong className="text-white">{rating.toFixed(1)}</strong>
                  {movie.votes ? (
                    <span>
                      ({Number(movie.votes).toLocaleString()} votes)
                    </span>
                  ) : null}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} />
                  {duration}
                </span>

                {movie.releaseDate && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} />
                    {movie.releaseDate}
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs text-white/80"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                {movie.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleBookMovie}
                  className="primary-button inline-flex items-center justify-center gap-2"
                >
                  <Ticket size={18} />
                  Book Tickets
                  <ArrowRight size={17} />
                </button>

                <a
                  href="#movie-information"
                  className="secondary-button inline-flex items-center justify-center gap-2"
                >
                  <Play size={17} />
                  Explore Details
                </a>
              </div>
            </div>

            <div className="mx-auto hidden w-full max-w-[260px] lg:block">
              <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-cinema-surface shadow-2xl shadow-black/50 transition duration-500 hover:-translate-y-2 hover:shadow-glow">
                <img
                  src={poster}
                  alt={`${movie.title} poster`}
                  className="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getImageFallback();
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 pt-16">
                  <p className="font-display text-lg font-bold text-white">
                    {movie.title}
                  </p>
                  <p className="mt-1 text-xs text-white/65">
                    Experience it on the big screen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="movie-information"
        className="page-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14"
      >
        <div className="space-y-10">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-cinema-accent" />
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                About the movie
              </h2>
            </div>

            <p className="max-w-3xl text-sm leading-8 text-cinema-muted sm:text-base">
              {movie.description ||
                "Discover the story, characters, and cinematic experience of this movie."}
            </p>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-cinema-accent" />
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Movie information
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="cinema-card flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cinema-accent">
                  <Film size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-cinema-muted">Genre</p>
                  <p className="mt-1 break-words text-sm font-semibold text-white">
                    {genres.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="cinema-card flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cinema-accent">
                  <Clock3 size={20} />
                </div>
                <div>
                  <p className="text-xs text-cinema-muted">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {duration}
                  </p>
                </div>
              </div>

              <div className="cinema-card flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cinema-accent">
                  <Volume2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-cinema-muted">Languages</p>
                  <p className="mt-1 break-words text-sm font-semibold text-white">
                    {languages.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="cinema-card flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cinema-accent">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs text-cinema-muted">Certificate</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {movie.certificate || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {movie.director && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-cinema-accent" />
                <h2 className="font-display text-2xl font-bold text-white">
                  Director
                </h2>
              </div>

              <div className="cinema-card flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cinema-accent/15 text-cinema-accent">
                  <Film size={22} />
                </div>
                <div className="min-w-0">
                  <p className="break-words font-semibold text-white">
                    {movie.director}
                  </p>
                  <p className="mt-1 text-xs text-cinema-muted">Director</p>
                </div>
              </div>
            </div>
          )}

          {cast.length > 0 && (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-cinema-accent" />
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Cast and crew
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cast.map((person, index) => {
                  const name =
                    typeof person === "string"
                      ? person
                      : person?.name || "Cast member";

                  return (
                    <div
                      key={`${name}-${index}`}
                      className="cinema-card flex min-w-0 items-center gap-3 p-3 transition duration-300 hover:-translate-y-1 hover:border-cinema-accent/30 sm:p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cinema-accent/30 to-purple-500/20 text-sm font-bold text-white">
                        {name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {name}
                        </p>
                        <p className="mt-1 text-xs text-cinema-muted">
                          Cast member
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="cinema-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                <Star size={21} className="fill-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-cinema-muted">Audience rating</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {rating.toFixed(1)}
                  <span className="ml-1 text-sm font-normal text-cinema-muted">
                    / 10
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-400"
                style={{
                  width: `${Math.min(Math.max(rating * 10, 0), 100)}%`
                }}
              />
            </div>

            {movie.votes && (
              <p className="mt-3 text-xs text-cinema-muted">
                Based on {Number(movie.votes).toLocaleString()} ratings
              </p>
            )}
          </div>

          <div className="cinema-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                <Ticket size={21} />
              </div>
              <div>
                <p className="text-xs text-cinema-muted">Ticket price</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  ₹{Number(movie.price || 0).toLocaleString("en-IN")}
                  <span className="ml-1 text-xs font-normal text-cinema-muted">
                    onwards
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookMovie}
              className="primary-button mt-5 flex w-full items-center justify-center gap-2"
            >
              Choose Seats
              <ArrowRight size={17} />
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-cinema-muted">
              Choose a date, theatre, and showtime below to continue.
            </p>
          </div>
        </aside>
      </section>

      <section
        id="showtime-selection"
        className="page-container scroll-mt-28 pb-20 sm:pb-24"
      >
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cinema-accent">
            Plan your experience
          </p>

          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Book your movie tickets
          </h2>

          <p className="mt-2 text-sm leading-6 text-cinema-muted">
            Choose your date, select a theatre, and pick a showtime to continue.
          </p>
        </div>

        {bookingMessage && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-200"
          >
            <Ticket size={19} className="mt-0.5 shrink-0" />
            <span>{bookingMessage}</span>
          </div>
        )}

        <div className="cinema-card mb-8 p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
              <CalendarDays size={20} />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Select date
              </h3>
              <p className="mt-1 text-xs text-cinema-muted">
                Choose your preferred day
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7">
            {bookingDates.map((date) => {
              const isSelected = selectedDate === date.value;

              return (
                <button
                  key={date.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectDate(date.value)}
                  className={`flex min-h-24 flex-col items-center justify-center rounded-xl border p-3 transition duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-cinema-accent bg-cinema-accent/15 text-white shadow-glow"
                      : "border-cinema-border bg-black/20 text-cinema-muted hover:border-cinema-accent/50 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-semibold">{date.day}</span>

                  <span className="mt-2 text-base font-bold">
                    {date.date}
                  </span>

                  {isSelected && (
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-300">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
            <MapPin size={20} />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Select theatre
            </h3>
            <p className="mt-1 text-xs text-cinema-muted">
              Choose a cinema before selecting its showtime
            </p>
          </div>
        </div>

        {!selectedDate ? (
          <div className="cinema-card mb-5 px-5 py-6 text-sm leading-6 text-cinema-muted">
            Please select a date above before choosing a theatre and showtime.
          </div>
        ) : null}

        {movie.theatres?.length ? (
          <div className="space-y-5">
            {movie.theatres.map((theatre) => {
              const isTheatreSelected =
                selectedTheatre?.id === theatre.id;

              return (
                <div
                  key={theatre.id}
                  className={`cinema-card overflow-hidden p-5 transition duration-300 sm:p-6 ${
                    isTheatreSelected ? "border-cinema-accent/70" : ""
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-cinema-border pb-5 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                        <Film size={22} />
                      </div>

                      <div className="min-w-0">
                        <h4 className="break-words font-display text-lg font-bold text-white">
                          {theatre.name}
                        </h4>

                        <p className="mt-1 flex items-start gap-1.5 text-sm text-cinema-muted">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <span>
                            {theatre.location || "Cinema location"}
                          </span>
                        </p>

                        {Array.isArray(theatre.formats) &&
                          theatre.formats.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {theatre.formats.map((format) => (
                                <span
                                  key={format}
                                  className="rounded-lg border border-cinema-border px-2.5 py-1.5 text-xs font-medium text-cinema-muted"
                                >
                                  {format}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!selectedDate}
                      onClick={() => handleSelectTheatre(theatre)}
                      aria-pressed={isTheatreSelected}
                      className={`inline-flex shrink-0 items-center justify-center gap-2 ${
                        isTheatreSelected
                          ? "primary-button"
                          : "secondary-button"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {isTheatreSelected && <CheckCircle2 size={16} />}
                      {isTheatreSelected
                        ? "Theatre Selected"
                        : "Select Theatre"}
                    </button>
                  </div>

                  <div className="pt-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cinema-muted">
                      Available showtimes
                    </p>

                    {!selectedDate ? (
                      <p className="rounded-xl border border-dashed border-cinema-border px-4 py-5 text-sm leading-6 text-cinema-muted">
                        Select a date to continue.
                      </p>
                    ) : !isTheatreSelected ? (
                      <p className="rounded-xl border border-dashed border-cinema-border px-4 py-5 text-sm leading-6 text-cinema-muted">
                        Select this theatre to choose a showtime.
                      </p>
                    ) : theatre.showtimes?.length ? (
                      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {theatre.showtimes.map((showtime) => {
                          const isShowtimeSelected =
                            selectedShowtime?.id === showtime.id;

                          return (
                            <button
                              key={showtime.id}
                              type="button"
                              aria-pressed={isShowtimeSelected}
                              onClick={() =>
                                handleSelectShowtime(theatre, showtime)
                              }
                              className={`group min-w-0 rounded-xl border p-4 text-left transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cinema-accent/50 ${
                                isShowtimeSelected
                                  ? "border-cinema-accent bg-cinema-accent/10"
                                  : "border-cinema-border bg-black/20 hover:border-cinema-accent/60 hover:bg-cinema-accent/5"
                              }`}
                            >
                              <span className="block break-words font-semibold text-white transition group-hover:text-rose-300">
                                {showtime.time
                                  ? formatTime(showtime.time)
                                  : "View show"}
                              </span>

                              <span className="mt-1 block text-xs text-cinema-muted">
                                {showtime.format || "Standard"}
                              </span>

                              <span className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold text-cinema-accent">
                                <span>
                                  ₹
                                  {Number(
                                    showtime.price || movie.price || 0
                                  ).toLocaleString("en-IN")}
                                </span>

                                {isShowtimeSelected ? (
                                  <CheckCircle2 size={16} />
                                ) : (
                                  <ArrowRight size={14} />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-dashed border-cinema-border px-4 py-6 text-sm text-cinema-muted">
                        No showtimes are listed for this cinema yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="cinema-card px-5 py-12 text-center">
            <Users size={30} className="mx-auto text-cinema-muted" />

            <h3 className="mt-4 font-semibold text-white">
              Showtimes coming soon
            </h3>

            <p className="mt-2 text-sm text-cinema-muted">
              There are no cinema listings available for this movie right now.
            </p>
          </div>
        )}

        <div className="cinema-card mt-8 flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-white">
              Your selection
            </h3>

            <div className="mt-3 space-y-2 text-sm text-cinema-muted">
              <p>
                <span className="text-white/80">Date:</span>{" "}
                {selectedDateInfo
                  ? `${selectedDateInfo.day}, ${selectedDateInfo.date}`
                  : "Not selected"}
              </p>

              <p>
                <span className="text-white/80">Theatre:</span>{" "}
                {selectedTheatre?.name || "Not selected"}
              </p>

              <p>
                <span className="text-white/80">Showtime:</span>{" "}
                {selectedShowtime?.time
                  ? formatTime(selectedShowtime.time)
                  : "Not selected"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookMovie}
            className="primary-button inline-flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto"
          >
            <Ticket size={18} />
            Choose Seats
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}
