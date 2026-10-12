
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Film,
  Home,
  Search,
  Sparkles
} from "lucide-react";
import Logo from "../components/Logo.jsx";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cinema-background px-4 pb-12 pt-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(244,63,94,0.13),transparent_48%)]" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-cinema-accent/10 blur-[110px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div className="mb-12 flex justify-center">
          <Logo />
        </div>

        <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64">
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-cinema-accent/30" />

          <div className="absolute inset-5 rounded-full border border-cinema-border bg-cinema-surface/70 shadow-glow" />

          <div className="relative flex flex-col items-center">
            <Clapperboard
              size={62}
              strokeWidth={1.2}
              className="mb-2 text-cinema-accent sm:h-20 sm:w-20"
            />

            <span className="font-display text-6xl font-black tracking-tighter text-white sm:text-7xl">
              404
            </span>
          </div>

          <span className="absolute right-4 top-8 flex h-10 w-10 animate-float items-center justify-center rounded-xl border border-cinema-border bg-cinema-elevated text-cinema-accent sm:right-7 sm:top-10">
            <Film size={20} />
          </span>

          <span className="absolute bottom-7 left-2 flex h-9 w-9 animate-pulse items-center justify-center rounded-full bg-cinema-accent/10 text-cinema-accent sm:bottom-10 sm:left-5">
            <Sparkles size={17} />
          </span>

          <span className="absolute bottom-9 right-1 text-xs font-bold tracking-[0.25em] text-cinema-muted sm:bottom-12 sm:right-4">
            OOPS!
          </span>
        </div>

        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/20 bg-cinema-accent/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent">
          <Search size={13} />
          Scene not found
        </p>

        <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
          Looks like this scene
          <span className="mt-2 block text-gradient">
            got cut from the movie.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-cinema-muted sm:text-base">
          The page you're looking for doesn't exist or may have moved to
          another screen. Let's get you back to the cinematic experience.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="primary-button inline-flex items-center justify-center gap-2"
          >
            <Home size={17} />
            Back to Home
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/movies"
            className="secondary-button inline-flex items-center justify-center gap-2"
          >
            <Film size={17} />
            Explore Movies
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="secondary-button inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        <div className="mx-auto mt-12 flex max-w-sm items-center justify-center gap-3 border-t border-cinema-border pt-6">
          <span className="h-px flex-1 bg-cinema-border" />
          <p className="whitespace-nowrap text-[10px] font-semibold tracking-[0.24em] text-cinema-muted">
            MOVIES. MOMENTS. MAGIC.
          </p>
          <span className="h-px flex-1 bg-cinema-border" />
        </div>
      </div>
    </main>
  );
}
