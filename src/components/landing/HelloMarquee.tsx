import { LogoLoop } from "./LogoLoop";
import { useTheme } from "../ui/ThemeContent";

const GREETINGS = [
  "Hello", "Bonjour", "こんにちは", "Hola", "Hallo", "Ciao", "Olá",
  "مرحباً", "你好", "안녕하세요", "Привет", "नमस्ते", "Hej", "Merhaba",
  "Γεια σου", "Cześć", "Xin chào", "สวัสดี", "שלום", "Habari",
];

const greetingLogos = GREETINGS.map((word) => ({
  node: <span>{word}</span>,
}));

export default function HelloMarquee() {
  const { theme } = useTheme();
  const fadeColor = theme === "dark" ? "#0a0a14" : "#fdf3e4";

  return (
    <LogoLoop
      logos={greetingLogos}
      speed={80}
      direction="left"
      logoHeight={16}
      gap={40}
      fadeOut
      fadeOutColor={fadeColor}
      hoverSpeed={60}
      ariaLabel="Hello in many languages"
    />
  );
}