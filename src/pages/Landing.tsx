import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import SakuraPetals from "../components/landing/SakuraPetals";
import MoonGlow from "../components/landing/MoonGlow";
import ProfileScroll from "../components/landing/ProfileScroll";
import SoundToggle from "../components/ui/SoundToggle";
import HelloMarquee from "../components/landing/HelloMarquee";

export default function Landing() {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
  };

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
        <button className="cta" type="button" onClick={handleEnter}>
          Enter the Room
        </button>
      </div>

      <SoundToggle />
      <HelloMarquee />

      <AnimatePresence>
        {isEntering && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "#f7d9a0",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => navigate("/room")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}