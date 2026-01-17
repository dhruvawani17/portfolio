import React from "react";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
// import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import MusicPlayer from "./components/MusicPlayer";

export default function App() {
  return (
    <div className="relative animated-gradient text-white">
      <CustomCursor />
      <Navbar />
      <MusicPlayer />

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
