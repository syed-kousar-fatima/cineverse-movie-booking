
import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Clapperboard,
  Film,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X
} from "lucide-react";
import MovieCard from "../components/MovieCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import movies, { movieCategories, movieGenres } from "../data/movies.js";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "Title A–Z" },
  { value: "price", label: "Lowest Price" }
];

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialGenre = searchParams.get("genre") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const genres = Array.isArray(movieGenres) ? movieGenres : [];
  const categories = Array.isArray(movieCategories) ? movieCategories : [];

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setActiveGenre(searchParams.get("genre") || "");
    setActiveCategory(searchParams.get("category") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      const query = search.trim();

      if (query) {
        nextParams.set("search", query);
      } else {
        nextParams.delete("search");
      }

      if (activeGenre) {
        nextParams.set("genre", activeGenre);
      } else {
        nextParams.delete("genre");
      }

      if (activeCategory) {
        nextParams.set("category", activeCategory);
      } else {
        nextParams.delete("category");
      }

      if (nextParams.toString() !== searchParams.toString()) {
        setSearchParams(nextParams, { replace: true });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search, activeGenre, activeCategory, searchParams, setSearchParams]);

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLowerCase();

    const results = movies.filter((movie) => {
      const searchableText = [
        movie.title,
        movie.tagline,
        movie.description,
        movie.language,
        movie.director,
        ...(Array.isArray(movie.genres) ? movie.genres : []),
        ...(Array.isArray(movie.cast) ? movie.cast : [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesGenre =
        !activeGenre ||
        (Array.isArray(movie.genres) &&
          movie.genres.some(
            (genre) => genre.toLowerCase() === activeGenre.toLowerCase()
          ));

      const matchesCategory =
        !activeCategory ||
        String(movie.category || "").toLowerCase() ===
          activeCategory.toLowerCase();

      return matchesSearch && matchesGenre && matchesCategory;
    });

    return results.sort((a, b) => {
      if (sortBy === "rating") {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "price") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      return (
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        Number(b.rating || 0) - Number(a.rating || 0)
      );
    });
  }, [search, activeGenre, activeCategory, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setActiveGenre("");
    setActiveCategory("");
    setSortBy("popular");
    setSearchParams({}, { replace: true });
  };

  const hasFilters = Boolean(search || activeGenre || activeCategory);

  return (
    <main className="min-h-screen w-full overflow-x-clip pb-20 pt-28 sm:pt-32">
      <section className="relative w-full overflow-hidden border-b border-cinema-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(244,63,94,0.13),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(124,58,237,0.10),transparent_40%)]" />

        <div className="page-container relative py-10 sm:py-14 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/20 bg-cinema-accent/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent">
                <Clapperboard size={14} />
                The movie collection
              </div>

              <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find your next
                <span className="block text-gradient">favorite movie.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-cinema-muted sm:text-base">
                Search the collection, discover new genres, and find a story
                worth experiencing on the big screen.
              </p>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-3xl border border-cinema-border bg-cinema-surface text-cinema-accent shadow-glow lg:flex">
              <Film size={54} strokeWidth={1.2} />
            </div>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-8 flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-cinema-border bg-cinema-surface p-2 transition focus-within:border-cinema-accent/50"
          >
            <Search size={20} className="ml-3 shrink-0 text-cinema-muted" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by movie, genre, actor..."
              aria-label="Search movies"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-cinema-muted sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-cinema-muted transition hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition sm:px-4 sm:text-sm ${
                filtersOpen
                  ? "bg-cinema-accent text-white"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal size={17} />
              <span className="hidden xs:inline">Filters</span>
            </button>
          </form>
        </div>
      </section>

      <section className="section-spacing w-full">
        <div className="page-container">
          <div className="mb-8 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cinema-accent">
                  Browse collection
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-white sm:text-3xl">
                  All Movies
                </h2>
                <p className="mt-2 text-sm text-cinema-muted">
                  {filteredMovies.length} {filteredMovies.length === 1 ? "movie" : "movies"} found
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-cinema-border bg-cinema-surface px-3 py-2.5">
                <ArrowDownWideNarrow size={16} className="shrink-0 text-cinema-muted" />
                <span className="text-xs text-cinema-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort movies"
                  className="max-w-[140px] bg-transparent text-xs font-semibold text-white outline-none sm:max-w-none sm:text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-cinema-surface">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("")}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  !activeCategory
                    ? "border-cinema-accent bg-cinema-accent text-white"
                    : "border-cinema-border bg-cinema-surface text-cinema-muted hover:border-cinema-accent/40 hover:text-white"
                }`}
              >
                All Categories
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory((current) =>
                      current === category ? "" : category
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    activeCategory === category
                      ? "border-cinema-accent bg-cinema-accent text-white"
                      : "border-cinema-border bg-cinema-surface text-cinema-muted hover:border-cinema-accent/40 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {filtersOpen && (
              <div className="animate-fade-in rounded-2xl border border-cinema-border bg-cinema-surface p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-white">
                    Filter by genre
                  </h3>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-cinema-accent transition hover:text-white"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveGenre("")}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                      !activeGenre
                        ? "border-cinema-accent bg-cinema-accent text-white"
                        : "border-cinema-border text-cinema-muted hover:text-white"
                    }`}
                  >
                    All Genres
                  </button>

                  {genres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() =>
                        setActiveGenre((current) =>
                          current === genre ? "" : genre
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                        activeGenre === genre
                          ? "border-cinema-accent bg-cinema-accent text-white"
                          : "border-cinema-border text-cinema-muted hover:border-cinema-accent/40 hover:text-white"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-cinema-muted">Active filters:</span>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cinema-border bg-cinema-surface px-3 py-1.5 text-xs text-white"
                  >
                    Search: {search}
                    <X size={13} />
                  </button>
                )}

                {activeGenre && (
                  <button
                    type="button"
                    onClick={() => setActiveGenre("")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cinema-border bg-cinema-surface px-3 py-1.5 text-xs text-white"
                  >
                    {activeGenre}
                    <X size={13} />
                  </button>
                )}

                {activeCategory && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory("")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cinema-border bg-cinema-surface px-3 py-1.5 text-xs text-white"
                  >
                    {activeCategory}
                    <X size={13} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-cinema-accent hover:text-white"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6 2xl:gap-7">
              {filteredMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-cinema-border bg-cinema-surface px-5 py-16 text-center sm:py-20">
              <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
                <Search size={29} />
              </span>

              <h3 className="font-display text-2xl font-black text-white">
                No movies found
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-cinema-muted">
                Try a different title or remove some filters to see more movies.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="primary-button mt-6 inline-flex items-center gap-2"
              >
                Clear Filters
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="page-container pb-8">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-cinema-border bg-cinema-surface p-6 sm:flex-row sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
              <Star size={22} />
            </span>

            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Ready for the big screen?
              </h3>
              <p className="mt-1 text-sm leading-6 text-cinema-muted">
                Pick a movie and discover available showtimes.
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="secondary-button inline-flex shrink-0 items-center gap-2"
          >
            Back to Home
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
