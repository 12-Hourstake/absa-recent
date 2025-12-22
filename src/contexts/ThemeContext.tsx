import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type ThemePreset = "turquoise" | "blue" | "green" | "purple" | "red";

type ThemeContextType = {
  theme: ThemePreset;
  setTheme: (preset: ThemePreset) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "absa_theme_preset";

const presetToVars: Record<ThemePreset, Record<string, string>> = {
  turquoise: {
    "--brand-start": "hsl(199 89% 48%)",
    "--brand-end": "hsl(199 89% 40%)",
    "--menu-bg-start": "hsl(199 89% 55%)",
    "--menu-bg-end": "hsl(199 89% 45%)",
    "--icon-bg": "hsl(199 89% 48% / 0.2)",
    "--icon-bg-hover": "hsl(199 89% 48% / 0.3)",
  },
  blue: {
    "--brand-start": "hsl(221.2 83.2% 53.3%)",
    "--brand-end": "hsl(221.2 83.2% 45%)",
    "--menu-bg-start": "hsl(221.2 83.2% 60%)",
    "--menu-bg-end": "hsl(221.2 83.2% 50%)",
    "--icon-bg": "hsl(221.2 83.2% 53.3% / 0.2)",
    "--icon-bg-hover": "hsl(221.2 83.2% 53.3% / 0.3)",
  },
  green: {
    "--brand-start": "hsl(142.1 76.2% 36.3%)",
    "--brand-end": "hsl(142.1 76.2% 30%)",
    "--menu-bg-start": "hsl(142.1 76.2% 45%)",
    "--menu-bg-end": "hsl(142.1 76.2% 35%)",
    "--icon-bg": "hsl(142.1 76.2% 36.3% / 0.2)",
    "--icon-bg-hover": "hsl(142.1 76.2% 36.3% / 0.3)",
  },
  purple: {
    "--brand-start": "hsl(262 83% 58%)",
    "--brand-end": "hsl(262 83% 50%)",
    "--menu-bg-start": "hsl(262 83% 62%)",
    "--menu-bg-end": "hsl(262 83% 52%)",
    "--icon-bg": "hsl(262 83% 58% / 0.2)",
    "--icon-bg-hover": "hsl(262 83% 58% / 0.3)",
  },
  red: {
    "--brand-start": "#AF144B",
    "--brand-end": "#870A3C",
    "--menu-bg-start": "#AF144B",
    "--menu-bg-end": "#870A3C",
    "--icon-bg": "rgba(175, 20, 75, 0.2)",
    "--icon-bg-hover": "rgba(175, 20, 75, 0.3)",
  },
};

function applyPreset(preset: ThemePreset) {
  const vars = presetToVars[preset];
  const root = document.documentElement;
  console.log("🎨 Applying theme preset:", preset, vars);
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
    console.log(`  Set ${key}: ${value}`);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreset>(() => {
    return "red";
  });

  useEffect(() => {
    applyPreset(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
