import FallingLeaves from "../components/cozy/FallingLeaves";
import MenuBar from "../components/cozy/MenuBar";
import Hero from "../components/cozy/Hero";
import TapeMarquee from "../components/cozy/TapeMarquee";
import About from "../components/cozy/About";
import Work from "../components/cozy/Work";
import Toolbox from "../components/cozy/Toolbox";
import Contact from "../components/cozy/Contact";
import Footer from "../components/cozy/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="cz-page">
      <a className="cz-skip" href="#about">
        Skip to content
      </a>
      <FallingLeaves />
      <MenuBar />
      <main className="cz-main">
        <Hero />
        <TapeMarquee />
        <About />
        <Work />
        <Toolbox />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
