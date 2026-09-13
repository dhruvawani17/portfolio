import React from "react";
import PremiumNavbar from "./components/PremiumNavbar";
// import CustomCursor from "./components/CustomCursor";
import SplashCursor from "./components/SplashCursor";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
// import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import MusicPlayer from "./components/MusicPlayer";
import PortfolioChatbot from "./components/PortfolioChatbot";

export default function App() {
  const isMac =
    typeof window !== "undefined" &&
    (window.location.pathname === "/mac" ||
      window.location.pathname.startsWith("/mac/"));

  React.useEffect(() => {
    if (isMac) {
      document.title = "Brand My Mac — Let your brand travel";
    }
  }, [isMac]);

  if (isMac) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-[99999]">
        <iframe
          src="https://mac-ochre.vercel.app"
          title="Brand My Mac"
          className="w-full h-full border-none block"
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </div>
    );
  }

  return (
    <div className="relative animated-gradient text-white">
      {/* <CustomCursor /> */}
      <SplashCursor />
      <PremiumNavbar />
      <MusicPlayer />
      <PortfolioChatbot />

      {/* Homepage always present (masked reveal) */}
      <Home />

      <About />
      <Skills />
      <Projects />
      <Experience />
      {/* <Testimonials /> */}
      <Contact />
      <Footer />
    </div>
  );
}
