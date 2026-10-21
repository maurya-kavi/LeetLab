import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-100/80 text-base-content/70 shadow-sm transition hover:bg-base-200 hover:text-base-content ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
