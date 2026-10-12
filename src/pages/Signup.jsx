
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Film,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validateSignupForm } from "../utils/validators.js";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from;
  const destination = redirectTo
    ? `${redirectTo.pathname || "/"}${redirectTo.search || ""}${redirectTo.hash || ""}`
    : "/";

  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: values.password.length >= 8
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(values.password)
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(values.password)
    },
    {
      label: "One number",
      valid: /\d/.test(values.password)
    }
  ];

  const passwordStrength = passwordChecks.filter((item) => item.valid).length;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setValues((current) => ({
      ...current,
      [name]: nextValue
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));

    if (name === "password" || name === "confirmPassword") {
      setErrors((current) => ({
        ...current,
        confirmPassword: ""
      }));
    }

    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateSignupForm(values);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const result = signup({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password
      });

      if (!result.success) {
        setMessage(result.message || "Unable to create your account. Please try again.");
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
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cinema-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="page-container relative">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-cinema-border bg-cinema-surface shadow-2xl lg:grid-cols-2">
          <section className="relative hidden min-h-[760px] overflow-hidden bg-cinema-background p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(244,63,94,0.22),transparent_45%),radial-gradient(ellipse_at_90%_90%,rgba(124,58,237,0.16),transparent_45%)]" />

            <div className="absolute -right-16 top-36 h-64 w-64 rounded-full border border-white/5" />
            <div className="absolute -right-5 top-48 h-44 w-44 rounded-full border border-cinema-accent/15" />

            <div className="relative z-10">
              <Logo />
            </div>

            <div className="relative z-10 py-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cinema-gradient text-white shadow-glow">
                <Film size={32} />
              </div>

              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/20 bg-cinema-accent/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent">
                <Sparkles size={13} />
                Join the experience
              </p>

              <h1 className="font-display text-4xl font-black leading-tight text-white xl:text-5xl">
                Your next movie
                <span className="mt-2 block text-gradient">
                  night awaits.
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-cinema-muted">
                Create your CineVerse account and make discovering movies,
                choosing seats, and planning your next cinema visit easier.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Explore movies for every mood",
                  "Pick your favorite cinema seats",
                  "Keep your booking details together"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cinema-success/10 text-cinema-success">
                      <Check size={14} />
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
            <div className="mb-7 lg:hidden">
              <Logo />
            </div>

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
                <Ticket size={23} />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cinema-accent">
                Start your journey
              </p>

              <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-cinema-muted">
                Enter your details to become part of CineVerse.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-white">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "signup-name-error" : undefined}
                    className={inputClass("name")}
                  />
                </div>

                {errors.name && (
                  <p id="signup-name-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-white">
                  Email Address
                </label>

                <div className="relative">
                  <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "signup-email-error" : undefined}
                    className={inputClass("email")}
                  />
                </div>

                {errors.email && (
                  <p id="signup-email-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-phone" className="mb-2 block text-sm font-semibold text-white">
                  Mobile Number <span className="font-normal text-cinema-muted">(Optional)</span>
                </label>

                <div className="relative">
                  <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="signup-phone"
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={10}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "signup-phone-error" : undefined}
                    className={inputClass("phone")}
                  />
                </div>

                {errors.phone && (
                  <p id="signup-phone-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-white">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "signup-password-error" : "signup-password-checks"}
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

                <div id="signup-password-checks" className="mt-3">
                  <div className="mb-2 flex gap-1.5">
                    {passwordChecks.map((check) => (
                      <span
                        key={check.label}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          check.valid
                            ? "bg-cinema-success"
                            : values.password
                              ? "bg-cinema-border"
                              : "bg-cinema-border"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {passwordChecks.map((check) => (
                      <p
                        key={check.label}
                        className={`flex items-center gap-1.5 text-[10px] ${
                          check.valid ? "text-cinema-success" : "text-cinema-muted"
                        }`}
                      >
                        <Check size={12} />
                        {check.label}
                      </p>
                    ))}
                  </div>
                </div>

                {errors.password && (
                  <p id="signup-password-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-semibold text-white">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />

                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
                    className={`${inputClass("confirmPassword")} !pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-cinema-muted transition hover:bg-white/5 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p id="signup-confirm-password-error" className="mt-2 text-xs text-cinema-accent">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cinema-border bg-cinema-background/40 p-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={values.acceptTerms}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.acceptTerms)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cinema-accent"
                  />

                  <span className="text-xs leading-5 text-cinema-muted">
                    I agree to the{" "}
                    <Link to="/terms" className="font-semibold text-cinema-accent hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="font-semibold text-cinema-accent hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {errors.acceptTerms && (
                  <p className="mt-2 text-xs text-cinema-accent">
                    {errors.acceptTerms}
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
                {submitting ? "Creating account..." : "Create Account"}
                {!submitting && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-cinema-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                state={location.state}
                className="font-bold text-cinema-accent transition hover:text-white"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-6 flex items-start gap-2 rounded-xl border border-cinema-border bg-cinema-background/60 p-3">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-cinema-success" />
              <p className="text-[10px] leading-5 text-cinema-muted">
                Demo authentication stores account data in your browser. This
                is not production-grade security; never use a real password.
              </p>
            </div>
          </section>
        </div>

        <p className="mt-7 text-center text-[10px] tracking-wide text-cinema-muted">
          © {new Date().getFullYear()} CineVerse · MOVIES. MOMENTS. MAGIC.
        </p>
      </div>
    </main>
  );
}
