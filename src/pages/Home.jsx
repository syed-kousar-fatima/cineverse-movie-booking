
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Clapperboard,
  Play,
  Popcorn,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp
} from "lucide-react";
import MovieCard from "../components/MovieCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import movies, { getFeaturedMovies, movieGenres } from "../data/movies.js";

const benefits = [
  {
    icon: Ticket,
    title: "Easy Booking",
    description: "Choose your movie, showtime, and favorite seats in a few clicks."
  },
  {
    icon: ShieldCheck,
    title: "Secure Experience",
    description: "Enjoy a simple booking journey with clear ticket summaries."
  },
  {
    icon: Popcorn,
    title: "Cinema Moments",
    description: "Discover stories worth watching on the big screen."
  }
];

const genreStyles = [
  "from-rose-500/20 to-orange-500/5",
  "from-violet-500/20 to-blue-500/5",
  "from-emerald-500/20 to-teal-500/5",
  "from-amber-500/20 to-red-500/5",
  "from-sky-500/20 to-indigo-500/5",
  "from-pink-500/20 to-purple-500/5"
];

export default function Home() {
  const featuredMovies = useMemo(() => getFeaturedMovies(), []);
  const trendingMovies = useMemo(() => movies.slice(0, 4), []);
  const heroMovie = featuredMovies[0] || movies[0];
  const genres = Array.isArray(movieGenres) ? movieGenres : [];

  return (
    <main className="min-h-screen w-full overflow-x-clip">
      <section className="relative flex min-h-[720px] w-full items-center overflow-hidden pb-16 pt-28 sm:min-h-[760px] sm:pb-20 sm:pt-32 lg:min-h-[820px] lg:pt-28">
        {heroMovie?.backdrop && (
          <img
            src={heroMovie.backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
          />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#09090B_0%,rgba(9,9,11,0.94)_34%,rgba(9,9,11,0.63)_68%,rgba(9,9,11,0.45)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-background via-transparent to-cinema-background/40" />

        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cinema-accent/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="page-container relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:gap-16">
          <div className="max-w-3xl animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cinema-accent/25 bg-cinema-accent/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent sm:text-xs">
              <Sparkles size={15} />
              Your cinema, reimagined
            </div>

            <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl xl:text-8xl">
              Every ticket.
              <span className="mt-2 block text-gradient">A new world.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8 lg:text-lg">
              Find the stories that move you. Discover your next favorite
              movie, pick the perfect seats, and make every cinema visit
              unforgettable.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/movies"
                className="primary-button inline-flex items-center justify-center gap-2 !px-6 !py-3.5"
              >
                Explore Movies
                <ArrowRight size={18} />
              </Link>

              {heroMovie && (
                <Link
                  to={`/movie/${heroMovie.id}`}
                  className="secondary-button inline-flex items-center justify-center gap-2 !px-6 !py-3.5"
                >
                  <Play size={17} fill="currentColor" />
                  Featured Movie
                </Link>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/10 pt-6">
              <div>
                <p className="font-display text-2xl font-black text-white sm:text-3xl">
                  {movies.length}+
                </p>
                <p className="mt-1 text-xs text-cinema-muted">Movies to explore</p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="font-display text-2xl font-black text-white sm:text-3xl">
                  {genres.length}+
                </p>
                <p className="mt-1 text-xs text-cinema-muted">Genres to discover</p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                  <Clapperboard size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">Movie Magic</p>
                  <p className="mt-1 text-xs text-cinema-muted">Starts right here</p>
                </div>
              </div>
            </div>
          </div>

          {heroMovie && (
            <Link
              to={`/movie/${heroMovie.id}`}
              className="group relative mx-auto block w-full max-w-[330px] animate-float sm:max-w-[370px] lg:max-w-[390px]"
              aria-label={`Discover ${heroMovie.title}`}
            >
              <div className="absolute -inset-5 rounded-[2rem] bg-cinema-accent/10 opacity-70 blur-2xl transition duration-500 group-hover:bg-cinema-accent/20" />

              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-cinema-surface shadow-2xl transition duration-500 group-hover:-translate-y-2 group-hover:border-cinema-accent/50">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={heroMovie.poster}
                    alt={`${heroMovie.title} poster`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-5 pt-20 sm:p-6 sm:pt-24">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cinema-accent px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    <TrendingUp size={13} />
                    Featured pick
                  </div>

                  <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
                    {heroMovie.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/65 sm:text-sm">
                    {heroMovie.tagline || heroMovie.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-white">
                      From ₹{Number(heroMovie.price || 0).toLocaleString("en-IN")}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cinema-background transition group-hover:bg-cinema-accent group-hover:text-white">
                      <ArrowRight size={19} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-8 hidden items-center gap-2 rounded-xl border border-white/10 bg-cinema-surface/95 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
                <Sparkles size={16} className="text-cinema-warning" />
                <span className="text-xs font-bold text-white">Your next favorite</span>
              </div>
            </Link>
          )}
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cinema-accent/40 to-transparent" />
      </section>

      <section className="section-spacing w-full">
        <div className="page-container">
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Featured Movies"
            subtitle="Stories worth leaving the house for. Find your next big-screen favorite."
            actionLabel="View all movies"
            actionTo="/movies"
          />

          {featuredMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-7">
              {featuredMovies.slice(0, 4).map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  featured={false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-cinema-border bg-cinema-surface p-8 text-center">
              <p className="text-sm text-cinema-muted">
                Featured movies will appear here soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="w-full py-16 sm:py-20">
        <div className="page-container">
          <SectionHeading
            eyebrow="Find your vibe"
            title="Explore by Genre"
            subtitle="From edge-of-your-seat thrillers to stories that warm your heart."
          />

          {genres.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
              {genres.slice(0, 6).map((genre, index) => (
                <Link
                  key={genre}
                  to={`/movies?genre=${encodeURIComponent(genre)}`}
                  className={`group relative flex min-h-28 items-end overflow-hidden rounded-2xl border border-cinema-border bg-gradient-to-br ${
                    genreStyles[index % genreStyles.length]
                  } p-4 transition duration-300 hover:-translate-y-1 hover:border-cinema-accent/40 hover:shadow-glow sm:min-h-32 sm:p-5`}
                >
                  <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full border border-white/5 transition duration-500 group-hover:scale-125" />

                  <div className="relative z-10 flex w-full items-end justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-white sm:text-lg">
                      {genre}
                    </h3>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 transition group-hover:border-cinema-accent group-hover:bg-cinema-accent group-hover:text-white">
                      <ChevronRight size={17} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cinema-muted">
              Browse all available movies to discover different genres.
            </p>
          )}
        </div>
      </section>

      <section className="section-spacing w-full">
        <div className="page-container">
          <SectionHeading
            eyebrow="What's popular"
            title="Trending Now"
            subtitle="Take a look at more movies to add to your watchlist."
            actionLabel="Browse the collection"
            actionTo="/movies"
          />

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 2xl:gap-7">
            {trendingMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/movies"
              className="secondary-button inline-flex items-center gap-2"
            >
              Discover More Movies
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-24">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl border border-cinema-border bg-cinema-surface px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cinema-accent/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="relative z-10 mb-10 text-center">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
                <Sparkles size={23} />
              </span>

              <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
                Your movie night,{" "}
                <span className="text-gradient">made better.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-cinema-muted sm:text-base">
                Everything you need to turn a movie plan into a memorable
                experience, all in one place.
              </p>
            </div>

            <div className="relative z-10 grid gap-4 md:grid-cols-3 md:gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-cinema-border bg-cinema-background/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-cinema-accent/30 sm:p-6"
                  >
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                      <Icon size={21} />
                    </span>

                    <h3 className="font-display text-lg font-bold text-white">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-cinema-muted">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 mt-9 flex justify-center">
              <Link
                to="/movies"
                className="primary-button inline-flex items-center gap-2"
              >
                Find Your Movie
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}