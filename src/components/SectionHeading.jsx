
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function SectionHeading({
  eyebrow = "",
  title,
  subtitle = "",
  align = "left",
  actionLabel = "",
  actionTo = "/movies",
  className = "",
  titleClassName = ""
}) {
  const centered = align === "center";

  return (
    <div
      className={`mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between ${
        centered ? "sm:flex-col sm:items-center sm:text-center" : ""
      } ${className}`}
    >
      <div
        className={`min-w-0 ${
          centered ? "w-full text-center" : "max-w-3xl text-left"
        }`}
      >
        {eyebrow && (
          <span
            className={`mb-3 inline-flex items-center gap-2 rounded-full border border-cinema-accent/20 bg-cinema-accent/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cinema-accent sm:text-xs ${
              centered ? "justify-center" : ""
            }`}
          >
            <Sparkles size={13} />
            {eyebrow}
          </span>
        )}

        {title && (
          <h2
            className={`font-display text-2xl font-extrabold leading-tight tracking-tight text-cinema-heading sm:text-3xl lg:text-4xl ${titleClassName}`}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            className={`mt-3 max-w-2xl text-sm leading-7 text-cinema-muted sm:text-base ${
              centered ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && (
        <Link
          to={actionTo}
          className={`group inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-cinema-border bg-cinema-surface px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cinema-accent/50 hover:bg-cinema-accent/10 hover:text-cinema-accent ${
            centered ? "mx-auto" : ""
          }`}
        >
          {actionLabel}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
