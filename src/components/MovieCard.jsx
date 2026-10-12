
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock3,
  Heart,
  Play,
  Star
} from "lucide-react";
import { useState } from "react";
import { formatDuration, getImageFallback } from "../utils/helpers.js";

export default function MovieCard({ movie, index = 0, featured = false }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  if (!movie) {
    return null;
  }

  const moviePath = `/movie/${movie.id}`;
  const poster = imageFailed
    ? getImageFallback()
    : movie.poster || getImageFallback();

  const rating = Number(movie.rating || 0);
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const duration =
    movie.durationLabel ||
    (movie.duration ? formatDuration(movie.duration) : "");

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFavorite((current) => !current);
  };

  return (
    <article
      className={`group relative min-w-0 animate-slide-up ${
        featured ? "sm:col-span-2 lg:col-span-1" : ""
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-cinema-border bg-cinema-surface transition duration-500 hover:-translate-y-1.5 hover:border-cinema-accent/40 hover:shadow-card-hover">
        <Link
          to={moviePath}
          aria-label={`View details for ${movie.title}`}
          className="relative block aspect-[2/3] overflow-hidden bg-cinema-elevated"
        >
          {!imageLoaded && !imageFailed && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cinema-elevated via-cinema-border/40 to-cinema-elevated" />
          )}

          <img
            src={poster}
            alt={`${movie.title} movie poster`}
            loading={index < 4 ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (!imageFailed) {
                setImageFailed(true);
                setImageLoaded(true);
              }
            }}
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/20 opacity-90 transition duration-300 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {movie.category && (
              <span className="rounded-md border border-white/15 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {movie.category}
              </span>
            )}

            {movie.featured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-cinema-gradient px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                <Play size={10} fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition duration-300 ${
              isFavorite
                ? "border-cinema-accent bg-cinema-accent text-white"
                : "border-white/20 bg-black/50 text-white hover:border-cinema-accent hover:bg-cinema-accent"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-black/65 px-2 py-1 text-xs font-bold text-cinema-warning backdrop-blur-md">
                <Star size={12} fill="currentColor" />
                {rating ? rating.toFixed(1) : "N/A"}
              </span>

              {movie.certificate && (
                <span className="rounded border border-white/30 bg-black/40 px-2 py-1 text-[10px] font-semibold text-white">
                  {movie.certificate}
                </span>
              )}
            </div>

            <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-cinema-accent sm:text-xl">
              {movie.title}
            </h3>

            {movie.tagline && (
              <p className="mt-1 line-clamp-1 text-xs text-white/65">
                {movie.tagline}
              </p>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="flex h-14 w-14 translate-y-3 items-center justify-center rounded-full border border-white/30 bg-cinema-accent/90 text-white shadow-glow transition duration-300 group-hover:translate-y-0">
              <Play size={23} fill="currentColor" />
            </span>
          </div>
        </Link>

        <div className="p-4 sm:p-5">
          <div className="mb-4 flex min-h-6 flex-wrap items-center gap-1.5">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="rounded-md border border-cinema-border bg-cinema-background px-2 py-1 text-[10px] font-medium text-cinema-muted"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between gap-2 text-xs text-cinema-muted">
            {duration ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={13} />
                {duration}
              </span>
            ) : (
              <span>{movie.language || "Multiple languages"}</span>
            )}

            <span className="truncate">
              {movie.language || "English"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-cinema-border pt-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-cinema-muted">
                Ticket from
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">
                ₹{Number(movie.price || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              to={moviePath}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-cinema-accent"
            >
              Details
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
