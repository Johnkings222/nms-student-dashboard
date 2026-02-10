/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎓 Student Dashboard Brand Colors
        primary: "#08190E",   // sidebar green-black
        accent: "#3B82F6",    // highlight blue (student theme)
        background: "#f9fafb",// page background
        surface: "#ffffff",   // card, navbar
        muted: "#f3f4f6",     // light gray background
        text: {
          DEFAULT: "#111827",
          muted: "#6b7280",
        },

        // 🎨 Dashboard Accent Colors
        purple: "#7C3AED",
        blue: "#3B82F6",
        orange: "#F59E0B",
        red: "#EF4444",
        green: "#13A541",
        cyan: "#06B6D4",

        // 📊 Attendance Colors
        absent: {
          50: "#FFF0F0",      // very light red for backgrounds
          100: "#FFE0E0",     // light red for hover states
          DEFAULT: "#FF4949", // main absent red
          700: "#CC0000",     // darker red for text
        },
        present: {
          50: "#E8F5E9",      // very light green for backgrounds
          100: "#C8E6C9",     // light green for hover states
          DEFAULT: "#13A541", // main present green
          700: "#0F8234",     // darker green for text
        },
        monday: "#FFD420",    // monday - yellow
        tuesday: "#8E98A8",   // tuesday - gray/blue
        wednesday: "#7FB2F3", // wednesday - blue
        thursday: "#79C1BB",  // thursday - teal
        friday: "#FBAE44",    // friday - orange
      },

      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },

      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    },
  ],
}
