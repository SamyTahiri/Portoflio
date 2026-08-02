import { useTheme } from "./ThemeContent";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      type="button"
    >
      <span className="celestial-stage">
        <span className={`celestial-body moon ${theme === "dark" ? "is-active" : "is-exiting"}`} />
        <span className={`celestial-body sun ${theme === "light" ? "is-active" : "is-exiting"}`} />
      </span>
    </button>
  );
}