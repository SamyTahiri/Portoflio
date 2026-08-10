import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import SakuraPetals from "../components/landing/SakuraPetals";
import MoonGlow from "../components/landing/MoonGlow";
import ProfileScroll from "../components/landing/ProfileScroll";
import SoundToggle from "../components/ui/SoundToggle";
import HelloMarquee from "../components/landing/HelloMarquee";
import ShapeOverlay, { type ShapeOverlayHandle } from "../components/landing/ShapeOverlay";
import Grainient from "../components/ui/Grainient";

export default function Landing() {
  const navigate = useNavigate();
  const overlayRef = useRef<ShapeOverlayHandle>(null);
  const hasEnteredRef = useRef(false);

  const enterRoom = () => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    overlayRef.current?.play(() => navigate("/room"));
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) enterRoom();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="landing">
      <div className="entrance-bg">
        <SakuraPetals />
        <MoonGlow />
      </div>

      <div className="topbar">
        <ProfileScroll />
      </div>

      <div className="hero">
        <h1 className="name">SAMY TAHIRI</h1>
        <div className="scroll-hint" onClick={enterRoom}>
  <span>Scroll to enter</span>
  <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
    <path
      d="M7 1V17M7 17L1 11M7 17L13 11"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>
      </div>

      <SoundToggle />
      <HelloMarquee />

      <ShapeOverlay ref={overlayRef} />
    </div>
  );
}