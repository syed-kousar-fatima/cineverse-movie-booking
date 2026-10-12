
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cinema: {
          background: "#09090B",
          surface: "#141418",
          elevated: "#1C1C22",
          border: "#292932",
          accent: "#F43F5E",
          "accent-hover": "#E11D48",
          muted: "#A1A1AA",
          heading: "#FAFAFA",
          success: "#22C55E",
          warning: "#FBBF24"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "ui-sans-serif", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(244, 63, 94, 0.22)",
        "card-hover": "0 20px 50px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "cinema-gradient":
          "linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)",
        "hero-gradient":
          "linear-gradient(90deg, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.76) 48%, rgba(9,9,11,0.12) 100%)"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "slide-up": "slideUp 0.6s ease-out both",
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(244,63,94,0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(244,63,94,0.4)" }
        }
      },
      screens: {
        xs: "375px",
        "3xl": "1920px"
      },
      maxWidth: {
        "screen-3xl": "1920px"
      }
    }
  },
  plugins: []
};
