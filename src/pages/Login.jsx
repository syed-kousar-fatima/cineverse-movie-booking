
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Film,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Ticket
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validateLoginForm } from "../utils/validators.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from;
  const destination = redirectTo
    ? `${redirectTo.pathname || "/"}${redirectTo.search || ""}${redirectTo.hash || ""}`
    : "/";

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

    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const result = login({
        email: values.email.trim(),
        password: values.password
      });

      if (!result.success) {
        setMessage(result.message || "Unable to sign in. Please try again.");
        return;
      }

      navigate(destination, { replace: true });
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `input-field w-full !pl-11 ${
      errors[field]
        ? "!border-cinema-accent focus:!ring-cinema-accent/20"
        : ""
    }`;

  return (
    <main className="relative min-h-screen overflow-hidden pb-16 pt-28 sm:pt-32">
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-cinema-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="page-container relative">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-cinema-border bg-cinema-surface shadow-2xl lg:grid-cols-2">
          <section className="relative hidden min-h-[640px] overflow-hidden bg-cinema-background p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(244,63,94,0.22),transparent_45%),radial-gradient(ellipse_at_90%_90%,rgba(124,58,237,0.16),transparent_45%)]" />

            <div className="absolute -right-16 top-36 h-64 w-64 rounded-full border border-white/5" />
            <div className="absolute -right-5 top-48 h-44 w-44 rounded-full border border-cinema-accent/15" />
            <div className="absolute bottom-24 left-10 h-48 w-48 rounded-full border border-white/5" />

            <div className="relative z-10">
              <Logo />
            </div>

            <div className="relative z-10 py-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cinema-gradient text-white shadow-glow">
                <Film size={32} />
              </div>

              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/20 bg-cinema-accent/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent">
                <Sparkles size={13} />
                Your cinema experience
              </p>

              <h1 className="font-display text-4xl font-black leading-tight text-white xl:text-5xl">
                Every great story
                <span className="mt-2 block text-gradient">
                  starts here.
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-cinema-muted">
                Sign in to continue your movie journey, select your favorite
                seats, and keep your booking details together.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Discover your next favorite movie",
                  "Choose seats for your movie night",
                  "Keep your booking details organized"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cinema-success/10 text-cinema-success">
                      <ShieldCheck size={14} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 border-t border-cinema-border pt-5">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-cinema-muted">
                MOVIES. MOMENTS. MAGIC.
              </p>
            </div>
          </section>

          <section className="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-10 xl:p-12">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
                <Ticket size={23} />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cinema-accent">
                Welcome back
              </p>

              <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                Sign in to CineVerse
              </h2>

              <p className="mt-3 text-sm leading-6 text-cinema-muted">
                Enter your details to continue your cinema experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-white">
                  Email Address
                </label>

                <div className="relative">
                  <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus={false}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    className={inputClass("email")}
                  />
                </div>

                {errors.email && (
                  <p id="login-email-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="login-password" className="text-sm font-semibold text-white">
                    Password
                  </label>
                  <span className="text-[10px] text-cinema-muted">
                    Minimum 8 characters
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    className={`${inputClass("password")} !pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-cinema-muted transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {errors.password && (
                  <p id="login-password-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.password}
                  </p>
                )}
              </div>

              {message && (
                <div role="alert" className="rounded-xl border border-cinema-accent/30 bg-cinema-accent/10 px-4 py-3 text-sm leading-6 text-white">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="primary-button flex w-full items-center justify-center gap-2 !py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign In"}
                {!submitting && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-cinema-border" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cinema-muted">
                New to CineVerse?
              </span>
              <div className="h-px flex-1 bg-cinema-border" />
            </div>

            <Link
              to="/signup"
              state={location.state}
              className="secondary-button flex w-full items-center justify-center gap-2 !py-3.5"
            >
              Create an Account
              <ArrowRight size={16} />
            </Link>

            <div className="mt-7 flex items-start gap-2 rounded-xl border border-cinema-border bg-cinema-background/60 p-3">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-cinema-success" />
              <p className="text-[10px] leading-5 text-cinema-muted">
                This project uses browser storage for demonstration accounts.
                Do not use real passwords or sensitive information.
              </p>
            </div>

            <Link
              to="/movies"
              className="mt-6 inline-flex items-center justify-center gap-2 text-xs font-semibold text-cinema-muted transition hover:text-cinema-accent"
            >
              Explore movies without signing in
              <ArrowRight size={13} />
            </Link>
          </section>
        </div>

        <p className="mt-7 text-center text-[10px] tracking-wide text-cinema-muted">
          © {new Date().getFullYear()} CineVerse · MOVIES. MOMENTS. MAGIC.
        </p>
      </div>
    </main>
  );
}
