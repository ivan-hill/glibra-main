import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        glibra: {
          navy: "#0A0F14",
          primary: "#00D1C1",
          secondary: "#1AE5D6",
          text: "#F5F7FF",
          muted: "#8892A6",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        brand: ['Ubuntu', 'system-ui'],
      },
      fontSize: {
        'fluid-hero': ['clamp(2.4rem, 6vw, 6rem)', { lineHeight: '0.95' }],
        'fluid-sub':  ['clamp(1.05rem, 2vw, 1.5rem)', { lineHeight: '1.35' }],
      },
      letterSpacing: { 
        tightest: '-0.04em' 
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1px, -1px)" },
          "20%": { transform: "translate(1px, -1px)" },
          "30%": { transform: "translate(-1px, 1px)" },
          "40%": { transform: "translate(1px, 1px)" },
          "50%": { transform: "translate(-1px, -1px)" },
          "60%": { transform: "translate(1px, -1px)" },
          "70%": { transform: "translate(-1px, 1px)" },
          "80%": { transform: "translate(1px, 1px)" },
          "90%": { transform: "translate(-1px, -1px)" },
        },
        "texture-shift": {
          "0%, 100%": { filter: "hue-rotate(0deg) brightness(1) contrast(1)" },
          "25%": { filter: "hue-rotate(5deg) brightness(1.1) contrast(1.05)" },
          "50%": { filter: "hue-rotate(10deg) brightness(0.95) contrast(1.1)" },
          "75%": { filter: "hue-rotate(5deg) brightness(1.05) contrast(0.95)" },
        },
        "subtle-float": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "33%": { transform: "translateY(-2px) scale(1.001)" },
          "66%": { transform: "translateY(1px) scale(0.999)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        grain: "grain 0.1s infinite",
        "texture-shift": "textureShift 8s ease-in-out infinite",
        "subtle-float": "subtleFloat 12s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
