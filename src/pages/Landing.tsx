import "./Landing.css";
import SakuraPetals from "../components/landing/SakuraPetals";
import MoonGlow from "../components/landing/MoonGlow";
import ProfileScroll from "../components/landing/ProfileScroll";
import SoundToggle from "../components/ui/SoundToggle";
import HelloMarquee from "../components/landing/HelloMarquee";

export default function Landing() {
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
        <button className="cta" type="button">
          Enter the Room
        </button>
      </div>

      <HelloMarquee />
      <SoundToggle />
    </div>
  );
}