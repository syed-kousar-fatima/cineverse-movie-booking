import { Clapperboard, Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="CineVerse home"
      className="flex min-w-0 items-center gap-1.5 min-[376px]:gap-2 sm:gap-3"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cinema-gradient shadow-glow min-[376px]:h-9 min-[376px]:w-9 sm:h-11 sm:w-11 sm:rounded-2xl">
        <Clapperboard
          size={17}
          strokeWidth={2.2}
          className="text-white min-[376px]:h-[19px] min-[376px]:w-[19px] sm:h-6 sm:w-6"
        />
        <Play
          size={8}
          fill="currentColor"
          className="absolute ml-[1px] text-white"
        />
      </span>

      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className="whitespace-nowrap text-[15px] font-extrabold tracking-tight text-white min-[376px]:text-[17px] sm:text-xl">
          Cine<span className="text-cinema-accent">Verse</span>
        </span>

        <span className="mt-1 whitespace-nowrap text-[6px] font-semibold tracking-[0.12em] text-cinema-muted min-[376px]:text-[7px] min-[376px]:tracking-[0.15em] sm:text-[10px] sm:tracking-[0.18em]">
          MOVIES. MOMENTS. MAGIC.
        </span>
      </span>
    </Link>
  );
}