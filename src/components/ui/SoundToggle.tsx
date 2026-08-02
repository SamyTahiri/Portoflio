import { useRef, useState } from "react";
import "./SoundToggle.css";

type SoundToggleProps = {
  src?: string;
};

export default function SoundToggle({ src = "/audios/ambient.mp3" }: SoundToggleProps) {
  const ambientRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  function toggleSound() {
    if (!ambientRef.current) return;
    if (soundOn) {
      ambientRef.current.pause();
    } else {
      ambientRef.current.play();
    }
    setSoundOn(!soundOn);
  }

  return (
    <>
      <audio ref={ambientRef} src={src} loop preload="auto" />
      <button
        className={`sound-button${soundOn ? " active" : ""}`}
        onClick={toggleSound}
        aria-pressed={soundOn}
      >
        <span key={soundOn ? "on" : "off"} className="sound-label">
          {soundOn ? "Sound On" : "Sound Off"}
        </span>
      </button>
    </>
  );
}