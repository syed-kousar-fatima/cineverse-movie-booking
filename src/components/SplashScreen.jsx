
import { useEffect, useState } from "react";
import { Clapperboard, Play, Sparkles } from "lucide-react";

export default function SplashScreen({ onComplete, duration = 2400 }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = Math.max(800, duration);
    let animationFrame;
    let exitTimer;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / totalDuration) * 100)
      );

      setProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    exitTimer = window.setTimeout(() => {
      setProgress(100);
      setExiting(true);

      window.setTimeout(() => {
        onComplete?.();
      }, 450);
    }, totalDuration);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(exitTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-cinema-background transition-all duration-500 ${
        exiting
          ? "pointer-events-none scale-105 opacity-0"
          : "scale-100 opacity-100"
      }`}
      aria-label="Loading CineVerse"
      role="status"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.13),transparent_55%)]" />

      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cinema-accent/10 sm:h-[460px] sm:w-[460px]" />

      <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-cinema-accent/20 sm:h-[360px] sm:w-[360px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="relative mb-8 animate-fade-in">
          <div className="absolute inset-0 scale-150 rounded-full bg-cinema-accent/20 blur-3xl" />

          <div className="relative flex h-24 w-24 animate-float items-center justify-center rounded-[28px] bg-cinema-gradient shadow-glow sm:h-28 sm:w-28">
            <Clapperboard
              size={48}
              strokeWidth={1.7}
              className="text-white sm:h-14 sm:w-14"
            />

            <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-cinema-background bg-white text-cinema-accent">
              <Play size={13} fill="currentColor" />
            </span>
          </div>

          <Sparkles
            size={20}
            className="absolute -left-7 top-2 animate-pulse text-cinema-accent"
          />

          <Sparkles
            size={15}
            className="absolute -bottom-3 -right-7 animate-pulse text-amber-300"
          />
        </div>

        <h1 className="animate-slide-up font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
          Cine<span className="text-cinema-accent">Verse</span>
        </h1>

        <p className="mt-3 animate-fade-in text-[10px] font-bold tracking-[0.32em] text-cinema-muted sm:text-xs">
          MOVIES. MOMENTS. MAGIC.
        </p>

        <div className="mt-12 w-full max-w-[230px]">
          <div className="mb-3 flex items-center justify-between text-[10px] font-medium tracking-wider text-cinema-muted">
            <span>PREPARING YOUR EXPERIENCE</span>
            <span className="tabular-nums text-cinema-accent">
              {progress}%
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cinema-gradient transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-white/40">
          Your next favorite movie awaits.
        </p>
      </div>

      <div className="absolute bottom-7 text-[9px] font-medium tracking-[0.3em] text-white/25">
        YOUR CINEMA, REIMAGINED
      </div>
    </div>
  );
}
