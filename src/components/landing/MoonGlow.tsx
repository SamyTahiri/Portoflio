import { useTheme } from "../ui/ThemeContent";
import "./MoonGlow.css";

export default function MoonGlow() {
  const { theme } = useTheme();

  return (
    <>
      <div className={`celestial-wrap moon-wrap ${theme === "dark" ? "is-active" : "is-exiting"}`}>
        <div className="moon" />
      </div>
      <div className={`celestial-wrap sun-wrap ${theme === "light" ? "is-active" : "is-exiting"}`}>
        <div className="sun" />
      </div>
    </>
  );
}