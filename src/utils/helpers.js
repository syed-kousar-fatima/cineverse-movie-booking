
export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
};

export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options
  }).format(parsedDate);
};

export const formatTime = (time) => {
  if (!time) return "";

  if (typeof time === "string") {
    const match = time.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);

    if (match) {
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      const period = match[3]?.toUpperCase();

      if (
        hour <= (period ? 12 : 23) &&
        hour >= (period ? 1 : 0) &&
        minute <= 59
      ) {
        if (period) {
          return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
        }

        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        return new Intl.DateTimeFormat("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }).format(date);
      }
    }
  }

  const parsedDate = new Date(time);

  if (Number.isNaN(parsedDate.getTime())) return String(time);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(parsedDate);
};

export const formatDuration = (minutes) => {
  const duration = Number(minutes);

  if (!Number.isFinite(duration) || duration <= 0) return "";

  const hours = Math.floor(duration / 60);
  const remainingMinutes = duration % 60;

  if (!hours) return `${remainingMinutes}m`;
  if (!remainingMinutes) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
};

export const generateBookingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `CV-${timestamp}-${random}`;
};

export const getMovieRating = (movie) => {
  const rating = Number(movie?.rating);

  if (!Number.isFinite(rating)) return "N/A";

  return rating.toFixed(1);
};

export const getSeatCount = (seats) => {
  return Array.isArray(seats) ? seats.length : 0;
};

export const getSeatTotal = (seats, moviePrice = 0) => {
  if (!Array.isArray(seats)) return 0;

  return seats.reduce((total, seat) => {
    const price = Number(seat?.price ?? moviePrice) || 0;

    return total + price;
  }, 0);
};

export const calculateBookingTotal = (
  seats,
  moviePrice = 0,
  convenienceFee = 30
) => {
  const seatTotal = getSeatTotal(seats, moviePrice);

  return seatTotal + (seatTotal > 0 ? convenienceFee : 0);
};

export const getInitials = (name) => {
  return String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const scrollToSection = (sectionId, offset = 0) => {
  if (typeof document === "undefined") return;

  const element = document.getElementById(sectionId);

  if (!element) return;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    Math.max(0, Number(offset) || 0);

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth"
  });
};

export const truncateText = (text, maxLength = 120) => {
  const value = String(text ?? "");

  if (value.length <= maxLength) return value;

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
};

export const getQueryParam = (key, search = window.location.search) => {
  return new URLSearchParams(search).get(key);
};

export const isValidEmail = (email) => {
  const value = String(email ?? "").trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
};

export const isValidPhone = (phone) => {
  const digits = String(phone ?? "").replace(/\D/g, "");

  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }

  return false;
};

export const classNames = (...classes) => {
  return classes
    .flat(Infinity)
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ");
};

export const getImageFallback = (type = "movie") => {
  const fallbacks = {
    movie:
      "https://placehold.co/600x900/141418/F43F5E?text=CineVerse",
    backdrop:
      "https://placehold.co/1600x900/141418/F43F5E?text=CineVerse",
    avatar:
      "https://placehold.co/200x200/141418/F43F5E?text=User"
  };

  return fallbacks[type] || fallbacks.movie;
};

export const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (typeof error === "string" && error.trim()) return error;

  if (error?.message) return error.message;

  return fallback;
};
