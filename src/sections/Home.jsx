
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import avatar from "../assets/avator.png";
import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { FaYoutube, FaInstagram } from "react-icons/fa6";
import ParticleBackground from "../components/ParticlesBackground";

const socials = [
  { Icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@dhruvawani" },
  { Icon: FaXTwitter, label: "X", href: "https://x.com/Dhruva_wani_17" },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/in/dhruvawani17/" },
  { Icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/dhruva_wani_17/" },
  { Icon: FaGithub, label: "GitHub", href: "https://github.com/dhruvawani17" },
];


const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
  hover: {
    scale: 1.2,
    y: -3,
    filter:
      "drop-shadow(0 0 8px rgba(13,88,204,0.9)) drop-shadow(0 0 18px rgba(16,185,129,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: {
    scale: 0.95,
    y: 0,
    transition: { duration: 0.08 },
  },
};

const Home = React.forwardRef((props, ref) => {
  const roles = useMemo(
    () => ["Software Developer", "Web Developer", "Content Creator", "Author"],
    []
  );
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // typing effect logic
  useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) setSubIndex((v) => v + 1);
      else if (!deleting && subIndex === current.length)
        setTimeout(() => setDeleting(true), 1200);
      else if (deleting && subIndex > 0) setSubIndex((v) => v - 1);
      else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((p) => (p + 1) % roles.length);
      }
    }, deleting ? 40 : 60); // original typing speed
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, roles]);

  return (
    <section
      ref={ref}
      id="home"
      className="h-screen w-full relative overflow-hidden bg-black"
    >
      <ParticleBackground />

      {/* gradient blobs */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-32 -left-32 
          w-[70vw] sm:w-[50vw] md:w-[40vw] 
          h-[70vw] sm:h-[50vw] md:h-[40vw]
          max-w-[500px] max-h-[500px]
          rounded-full
          bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1]
          opacity-30 sm:opacity-20 md:opacity-10 
          blur-[100px] sm:blur-[130px] md:blur-[150px]
          animate-pulse"
        />
        <div
          className="absolute bottom-0 right-0 
          w-[70vw] sm:w-[50vw] md:w-[40vw] 
          h-[70vw] sm:h-[50vw] md:h-[40vw] 
          max-w-[500px] max-h-[500px] 
          rounded-full 
          bg-gradient-to-r from-[#45B7D1] via-[#4ECDC4] to-[#FF6B6B] 
          opacity-40 sm:opacity-30 
          blur-[100px] sm:blur-[130px] md:blur-[150px] 
          animate-pulse delay-500"
        />
      </div>

      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2">
        {/* left */}
        <motion.div
          className="flex flex-col justify-center h-full text-center lg:text-left relative"
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="w-full lg:pr-24 mx-auto max-w-[48rem]">
            {/* typing text */}
            <motion.div
              className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide min-h-[1.6em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span>{roles[index].substring(0, subIndex)}</span>
              <span
                className="inline-block w-[2px] ml-1 bg-white animate-pulse align-middle"
                style={{ height: "1em" }}
              />
            </motion.div>

            {/* name */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text 
              bg-gradient-to-r from-[#45B7D1] via-[#4ECDC4] to-[#FF6B6B] drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Hello, I&apos;m
              <br />
              <span className="text-white font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl lg:whitespace-nowrap">
                Dhruva Wani
              </span>
            </motion.h1>

            {/* description */}
            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              I turn complex ideas into seamless, high-impact web experiences —
              building modern, scalable, and lightning-fast applications that
              make a difference.
            </motion.p>

            {/* buttons */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <a
                href="#projects"
                className="px-6 py-3 rounded-full text-lg font-medium text-white 
                bg-gradient-to-r from-[#45B7D1] via-[#4ECDC4] to-[#FF6B6B]
                shadow-lg hover:scale-105 transition-all"
              >
                View My Work
              </a>
              <a
                href="/Resume.pdf"
                download
                className="px-6 py-3 rounded-full text-lg font-medium text-black bg-white 
                hover:bg-gray-200 shadow-lg hover:scale-105 transition-all"
              >
                My Resume
              </a>
            </motion.div>

            {/* socials */}
            <motion.div
              className="mt-10 flex gap-5 text-2xl md:text-3xl justify-center lg:justify-start"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              {socials.map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={glowVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="text-gray-300"
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* right */}
        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              right: "10px",
              width: "min(22vw, 410px)",
              height: "min(40vw, 760px)",
              borderRadius: "50%",
              filter: "blur(38px)",
              opacity: 0.32,
              background:
                "conic-gradient(from 0deg, #45B7D1, #4ECDC4, #FF6B6B, #45B7D1)",
            }}
          />
          <motion.img
            src={avatar}
            alt="Dhruva Wani avatar"
            className="absolute top-[55%] -translate-y-1/2 object-contain select-none pointer-events-none"
            style={{ right: "-110px", width: "min(45vw, 780px)", maxHeight: "90vh" }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>
      </div>
    </section>
  );
});

export default Home;
