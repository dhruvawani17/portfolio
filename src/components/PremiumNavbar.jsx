import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiMessageSquare, FiX, FiMenu } from "react-icons/fi";
import { PiStarFourFill } from "react-icons/pi"; // Using a 4-point star similar to the image
import "./PremiumNavbar.css";

const PremiumNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
    {/* Desktop Navbar */}
    <div className={`premium-navbar-container desktop-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="premium-glass-capsule">
        <div className="moving-border"></div>

        {/* Left Section: Navigation Links & Icon */}
        <div className="nav-left">
            <button onClick={() => scrollToSection("home")} className="nav-link">
                Home
            </button>
            
            <div className="separator-icon">
                <PiStarFourFill className="star-icon" />
            </div>

            <button onClick={() => scrollToSection("about")} className="nav-link">
                About
            </button>

            <button onClick={() => scrollToSection("projects")} className="nav-link">
                Work
            </button>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="nav-right">
            {/* <motion.a 
                href="/resume.pdf" // Placeholder path
                target="_blank"
                rel="noreferrer"
                className="icon-btn download-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download Resume"
            >
                <FiDownload />
            </motion.a> */}

            <motion.button 
                onClick={() => scrollToSection("contact")}
                className="say-hello-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Say Hello
            </motion.button>
        </div>
      </div>
    </div>


    {/* Mobile Bottom Navbar Button */}
    <div className="mobile-nav-container">
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    className="mobile-menu-glass"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <button onClick={() => { scrollToSection("home"); setMobileMenuOpen(false); }}>Home</button>
                    <button onClick={() => { scrollToSection("about"); setMobileMenuOpen(false); }}>About</button>
                    <button onClick={() => { scrollToSection("projects"); setMobileMenuOpen(false); }}>Work</button>
                    <button onClick={() => { scrollToSection("contact"); setMobileMenuOpen(false); }}>Contact</button>
                </motion.div>
            )}
        </AnimatePresence>

        <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
            <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                    <motion.div 
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        className="mobile-btn-content"
                    >
                         <FiX size={18} />
                         <span className="mobile-nav-text">Close</span>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        className="mobile-btn-content"
                    >
                        <PiStarFourFill size={14} />
                        <span className="mobile-nav-text">Menu</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    </div>
    </>
  );
};

export default PremiumNavbar;
