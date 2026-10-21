import { useCallback, useLayoutEffect, useState } from "react";
import { ThemeContext } from "../context/themeContext";

const STORAGE_KEY = "leetlab-theme";

const getInitialTheme = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The theme still applies for this session if storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
