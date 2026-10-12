import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Clapperboard,
  Film,
  LogOut,
  Menu,
  Search,
  Ticket,
  UserRound,
  X
} from "lucide-react";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navigation = [
  { label: "Home", to: "/", icon: Clapperboard },
  { label: "Movies", to: "/movies", icon: Film }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const user = auth?.user;
  const logout = auth?.logout;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    navigate(
      query ? `/movies?search=${encodeURIComponent(query)}` : "/movies"
    );

    setSearchOpen(false);
    setSearchQuery("");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout?.();
    setMobileOpen(false);
    setSearchOpen(false);
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-cinema-accent/10 text-cinema-accent"
        : "text-cinema-muted hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 m-0 w-full max-w-none border-b transition-all duration-300 ${
        scrolled
          ? "border-cinema-border bg-cinema-background/95 shadow-lg backdrop-blur-xl"
          : "border-transparent bg-cinema-background/70 backdrop-blur-md"
      }`}
      style={{ left: 0, right: 0, width: "100%" }}
    >
      <div className="flex h-14 w-full max-w-none items-center justify-between gap-1 px-2 min-[376px]:h-16 min-[376px]:px-3 sm:h-[72px] sm:gap-2 sm:px-4 md:px-5 lg:h-[76px] lg:px-6 xl:px-8 2xl:px-10 min-[2560px]:px-8 min-[3200px]:px-10">
        <div className="min-w-0 shrink">
          <Logo />
        </div>

        <nav
          className="hidden shrink-0 items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 min-[376px]:gap-1.5 sm:gap-2 lg:ml-0 lg:gap-3">
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="absolute left-2 right-2 top-[60px] flex items-center gap-2 rounded-2xl border border-cinema-border bg-cinema-surface p-2 shadow-2xl min-[376px]:top-[64px] sm:left-auto sm:right-20 sm:top-3 sm:w-80"
            >
              <Search
                size={17}
                className="ml-2 shrink-0 text-cinema-muted"
              />

              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search movies..."
                aria-label="Search movies"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-cinema-muted"
              />

              <button
                type="submit"
                aria-label="Submit movie search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cinema-accent text-white transition hover:bg-cinema-accent-hover sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <Search size={16} />
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMobileOpen(false);
            }}
            aria-label={searchOpen ? "Close search" : "Search movies"}
            aria-expanded={searchOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cinema-border text-cinema-muted transition hover:border-cinema-accent/40 hover:text-white min-[376px]:h-9 min-[376px]:w-9 min-[376px]:rounded-xl sm:h-10 sm:w-10"
          >
            {searchOpen ? (
              <X size={17} />
            ) : (
              <Search size={17} />
            )}
          </button>

          {user ? (
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <Link
                to="/confirmation"
                className="flex h-10 items-center gap-2 rounded-xl border border-cinema-border px-3 text-sm font-semibold text-cinema-muted transition hover:border-cinema-accent/40 hover:text-white"
              >
                <Ticket size={16} />
                <span className="hidden xl:inline">My Booking</span>
              </Link>

              <div className="group relative">
                <button
                  type="button"
                  aria-label="Account menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-cinema-gradient text-white shadow-glow"
                >
                  <UserRound size={18} />
                </button>

                <div className="invisible absolute right-0 top-full z-50 w-48 translate-y-2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-cinema-border bg-cinema-surface p-2 shadow-2xl">
                    <div className="border-b border-cinema-border px-3 py-3">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name || "Movie Lover"}
                      </p>
                      <p className="mt-1 truncate text-xs text-cinema-muted">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-cinema-muted transition hover:bg-white/5 hover:text-cinema-accent"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: location }}
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-cinema-border px-3 py-2.5 text-sm font-bold text-white transition hover:border-cinema-accent/50 hover:bg-white/5 sm:inline-flex sm:px-4"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              setMobileOpen((open) => !open);
              setSearchOpen(false);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cinema-border text-white transition hover:border-cinema-accent/40 min-[376px]:h-9 min-[376px]:w-9 min-[376px]:rounded-xl sm:h-10 sm:w-10 lg:hidden"
          >
            {mobileOpen ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`w-full overflow-hidden border-t border-cinema-border bg-cinema-background transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[480px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav
          className="flex w-full flex-col gap-2 px-2 py-3 min-[376px]:px-3 min-[376px]:py-4 sm:px-4 md:px-5"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}

          {user && (
            <NavLink
              to="/confirmation"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Ticket size={17} />
              My Booking
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-cinema-muted transition hover:bg-white/5 hover:text-cinema-accent"
            >
              <LogOut size={17} />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: location }}
              onClick={() => setMobileOpen(false)}
              className="primary-button mt-2 flex items-center justify-center gap-2"
            >
              <UserRound size={17} />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}