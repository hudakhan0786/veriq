/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'scan-vertical': {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' },
        }
      },
      animation: {
        'scan-vertical': 'scan-vertical 1.5s ease-in-out infinite',
      },
      colors: {
        surface: "#FFFEFA",
        saffron: "#A77A43",
        forest: {
          DEFAULT: "#2F5142",
          light: "#486858",
          dark: "#223E32",
          pale: "#E9EEE9",
        },
        slate: {
          50: "#FAF9F5",
          100: "#F2F1EB",
          200: "#E7E5DC",
          300: "#D4D1C6",
          400: "#A6A397",
          500: "#77766C",
          600: "#5A5A53",
          700: "#454740",
          800: "#313631",
          900: "#232925",
          950: "#151B18",
        },
        blue: {
          50: "#F1F4F1", 100: "#E3E9E4", 200: "#CAD5CB", 300: "#AABBAE",
          400: "#829B89", 500: "#64806D", 600: "#4C6857", 700: "#3A5546",
          800: "#2F493C", 900: "#263D33", 950: "#192B23",
        },
        sky: {
          50: "#F3F5F3", 100: "#E8ECE8", 200: "#D4DDD5", 300: "#BAC8BC",
          400: "#97AA99", 500: "#788F7B", 600: "#5E7762", 700: "#4A6250",
          800: "#3B5140", 900: "#2E4133", 950: "#1C2D22",
        },
        amber: {
          50: "#F7F3EA", 100: "#EEE7D9", 200: "#DFD2B9", 300: "#CAB68F",
          400: "#B79B6A", 500: "#9E8050", 600: "#826841", 700: "#695338",
          800: "#57452F", 900: "#493A2A", 950: "#2A2118",
        },
        indigo: {
          50: "#F1F2EF", 100: "#E4E6E1", 200: "#CED2CA", 300: "#ADB4AA",
          400: "#899487", 500: "#6C796B", 600: "#566354", 700: "#434F42",
          800: "#353F34", 900: "#2B342B", 950: "#1A221B",
        },
        purple: {
          50: "#F4F2EE", 100: "#EAE6DE", 200: "#D9D1C2", 300: "#C3B69E",
          400: "#AA9677", 500: "#907C61", 600: "#76644F", 700: "#5F5142",
          800: "#4D4338", 900: "#40392F", 950: "#28231D",
        },
        cyan: {
          DEFAULT: "#64806D",
          50: "#F1F4F1", 100: "#E3E9E4", 200: "#CAD5CB", 300: "#AABBAE",
          400: "#829B89", 500: "#64806D", 600: "#4C6857", 700: "#3A5546",
          800: "#2F493C", 900: "#263D33", 950: "#192B23",
        },
        success: "#55745D",
        govNavy: {
          DEFAULT: "#2F5142",
          light: "#486858",
          dark: "#223E32",
          deep: "#192B23",
        },
        navy: {
          50: "#F1F4F1", 100: "#E3E9E4", 200: "#CAD5CB", 300: "#AABBAE",
          400: "#829B89", 500: "#64806D", 600: "#4C6857", 700: "#3A5546",
          800: "#2F493C", 900: "#263D33",
        },
        government: {
          navy: "#2F5142",
          saffron: "#A77A43",
          green: "#55745D",
          gold: "#8F7046",
        },
        verdictPass: {
          DEFAULT: "#55745D",
          light: "#E9EEE9",
          dark: "#3B5C43",
        },
        verdictFail: {
          DEFAULT: "#9E5148",
          light: "#F5EDEA",
          dark: "#813E37",
        },
        verdictReview: {
          DEFAULT: "#947346",
          light: "#F2EEE5",
          dark: "#715833",
        },
        verdictUnable: {
          DEFAULT: "#475569",
          light: "#F1F5F9",
          dark: "#334155",
        },
        surfaceBg: "#F5F4EF",
        panelBg: "#FFFEFA",
        panelBorder: "#D9D9D0",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        workstation: "0 1px 3px rgba(15,35,55,.10), 0 4px 12px rgba(15,35,55,.06)",
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "2xs": "0 1px 1px 0 rgba(0, 0, 0, 0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  plugins: [],
};
