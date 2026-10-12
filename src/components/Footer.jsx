
import {
  ArrowUpRight,
  Clapperboard,
  Mail,
  MapPin,
  Play
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Explore Movies", to: "/movies" },
  { label: "Sign In", to: "/login" },
  { label: "Create Account", to: "/signup" }
];

const movieLinks = [
  { label: "Now Showing", to: "/movies?category=now-showing" },
  { label: "Coming Soon", to: "/movies?category=coming-soon" },
  { label: "Popular Movies", to: "/movies?sort=popular" },
  { label: "Top Rated", to: "/movies?sort=rating" }
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: FaXTwitter
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: FaYoutube
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-cinema-border bg-cinema-background">
      <div className="pointer-events-none absolute -left-40 top-0 h-72 w-72 rounded-full bg-cinema-accent/5 blur-[100px]" />

      <div className="page-container relative py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo />

            <p className="mt-5 max-w-sm text-sm leading-7 text-cinema-muted">
              Discover incredible stories, find your perfect seats, and turn
              every movie night into a memorable experience with CineVerse.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-cinema-border bg-cinema-surface text-cinema-muted transition duration-300 hover:-translate-y-1 hover:border-cinema-accent/50 hover:bg-cinema-accent/10 hover:text-cinema-accent"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1 text-sm text-cinema-muted transition hover:text-cinema-accent"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-bold text-white">
              Discover Movies
            </h3>

            <ul className="space-y-4">
              {movieLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1 text-sm text-cinema-muted transition hover:text-cinema-accent"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-bold text-white">
              Stay Connected
            </h3>

            <p className="mb-5 text-sm leading-6 text-cinema-muted">
              Keep up with new releases, cinema experiences, and special offers.
            </p>

            <a
              href="mailto:hello@cineverse.example"
              className="flex items-center gap-3 rounded-2xl border border-cinema-border bg-cinema-surface p-4 transition hover:border-cinema-accent/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cinema-accent/10 text-cinema-accent">
                <Mail size={18} />
              </span>

              <span className="min-w-0">
                <span className="block text-xs text-cinema-muted">
                  Get in touch
                </span>
                <span className="mt-1 block break-all text-sm font-medium text-white">
                  hello@cineverse.example
                </span>
              </span>
            </a>

            <div className="mt-4 flex items-start gap-3 text-sm text-cinema-muted">
              <MapPin size={17} className="mt-0.5 shrink-0 text-cinema-accent" />
              <span>Making movie moments memorable, everywhere.</span>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-cinema-border to-transparent sm:my-12" />

        <div className="flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-cinema-muted">
            © {currentYear} CineVerse. All rights reserved.
          </p>

          <Link
            to="/movies"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-cinema-muted transition hover:text-cinema-accent"
          >
            <Play size={12} fill="currentColor" />
            Your next favorite movie awaits
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-cinema-muted">
            <Clapperboard size={14} className="text-cinema-accent" />
            MOVIES. MOMENTS. MAGIC.
          </div>
        </div>
      </div>
    </footer>
  );
}
