import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaReact, FaNodeJs, FaExternalLinkAlt, FaPython, FaArrowDown } from "react-icons/fa";
import { SiTailwindcss, SiVite, SiNextdotjs, SiFastapi, SiDocker, SiMongodb, SiTypescript, SiMysql } from "react-icons/si";
import { BsStars, BsRobot } from "react-icons/bs";

// Importing project images (desktop & mobile versions)
import img1 from "../assets/img1.webp";
import img2 from "../assets/img2.webp";
import img3 from "../assets/img3.webp";
import photo1 from "../assets/photo1-v2.webp";
import photo2 from "../assets/photo2-v2.webp";
import photo3 from "../assets/photo3.webp";

const useIsMobile = (query = "(max-width: 1024px)") => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return isMobile;
};

const ProjectRow = ({ project, index, updateActiveImage }) => {
  const ref = useRef(null);
  // amount: 0.8 means 80% of the element must be visible
  // margin: "0px 0px -20% 0px" pushes the trigger point higher up so it triggers closer to when it's settled
  const isInView = useInView(ref, { amount: 0.8, margin: "0px 0px -100px 0px" });

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 }); // Smooth mouse movement

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]); // Vertical tilt
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]); // Horizontal tilt

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized mouse position (-0.5 to 0.5) from center
    const mouseXFromCenter = (e.clientX - rect.left) / width - 0.5;
    const mouseYFromCenter = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXFromCenter);
    y.set(mouseYFromCenter);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    updateActiveImage(index, isInView);
  }, [isInView, index, updateActiveImage]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.4 }} 
      transition={{ duration: 0.5 }}
      className="h-[80vh] sticky top-[10vh] flex items-center justify-center py-10 perspective-1000" // Added perspective
    >
      <motion.div
        className="relative w-full h-full rounded-[30px] p-[2px] shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)] group overflow-hidden bg-[#1a1a1a]"
        style={{ 
          // Disable 3D tilt on mobile if needed, but request is to keep border animation
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" // Enable 3D transform for children
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated Gradient Border - Kept same for all screen sizes per request */}
        <div 
          className="absolute inset-0 animate-border-rotate" 
          style={{ 
            background: `conic-gradient(from var(--angle), ${project.accentColor}, #000000, ${project.accentColor})`,
            zIndex: 0
          }} 
        />
        
        {/* Shine Gloss Overlay */}
        <motion.div 
            className="absolute inset-0 pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                background: useTransform(
                    mouseX,
                    [-0.5, 0.5],
                    [
                        "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 40%, transparent 60%)",
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.0) 60%, transparent 80%)" // Shift shine
                    ]
                )
            }}
        />

        {/* 3D Content Container */}
        <div className="w-full h-full bg-[#0a0a0a] rounded-[29px] overflow-hidden relative z-10 font-bold" style={{ transform: "translateZ(20px)" }}>
            
          {/* Internal Lighting */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-black/40 pointer-events-none z-20" />

          {/* Image Container */}
          <div className="w-full h-full p-8 flex items-end justify-center" style={{ transform: "translateZ(30px)" }}>
            <motion.div
              className="w-full h-full rounded-t-xl overflow-hidden shadow-2xl relative translate-y-6 group-hover:translate-y-2 transition-transform duration-500"
            >
              {project.useIframe ? (
                <iframe
                  src={project.link}
                  className="w-full h-full bg-white object-cover rounded-t-lg pointer-events-none"
                  title={project.title}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top rounded-t-lg"
                />
              )}
            </motion.div>
          </div>

          {/* Sticker */}
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="absolute top-6 right-6 w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:bg-white/20 z-30 group/sticker"
          >
            <div className="absolute inset-0 animate-spin-slow opacity-90">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                <path
                  id="textPath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="transparent"
                />
                <text fontSize="12" fontWeight="bold" letterSpacing="2">
                  <textPath href="#textPath" startOffset="0%">
                    SEE IT IN ACTION • EXPLORE •
                  </textPath>
                </text>
              </svg>
            </div>
            <FaExternalLinkAlt className="text-white text-xl relative z-10" />
          </a>

          {/* Animated Down Arrow */}
          <motion.div 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 text-white/50"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(40px)" }}
          >
            <FaArrowDown size={20} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Projects() {
  const isMobile = useIsMobile();
  const [visibleProjects, setVisibleProjects] = useState(new Set([0]));
  const activeIndex = useMemo(() => {
    if (visibleProjects.size === 0) return 0;
    return Math.max(...Array.from(visibleProjects));
  }, [visibleProjects]);

  const updateActiveImage = (index, isVisible) => {
    setVisibleProjects((prev) => {
      const newSet = new Set(prev);
      if (isVisible) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  };

  const projects = useMemo(
    () => [
      {
        id: 1,
        title: "Voice AI Agents",
        subtitle: "Innovative Voice Solutions",
        description:
          "A comprehensive exploration of voice-enabled AI agents designed for seamless interaction. This project showcases advanced natural language processing and real-time audio handling capabilities, bridging the gap between humans and machines.",
        features: [
          "Real-time voice processing with low latency",
          "Integrated with advanced LLMs for context awareness",
          "Customizable voice personas and emotional intelligence",
          "Secure and scalable architecture for enterprise use",
        ],
        tags: [
          { name: "Python", icon: <FaPython /> },
          { name: "FastAPI", icon: <SiFastapi /> },
          { name: "Docker", icon: <SiDocker /> },
          { name: "AI/ML", icon: <BsRobot /> },
          { name: "Voice Tech", icon: <BsStars /> },
          { name: "Murf Falcon", icon: <BsStars /> },
          { name: "LiveKit", icon: <BsStars /> },

        ],
        link: "https://github.com/dhruvawani17/ten-days-of-voice-agents-2025",
        accentColor: "#3d43f5",
        gradient: "linear-gradient(135deg, #3d43f5 0%, #7b2ff7 100%)",
        image: isMobile ? photo1 : img1,
        useIframe: false,
      },
      {
        id: 2,
        title: "AI-Literacy Bridge",
        subtitle: "Empowering Education",
        description:
          "An educational platform designed to bridge the gap in AI literacy. It provides interactive modules, quizzes, and resources to help users understand complex AI concepts in a simplified manner, making technology accessible to everyone.",
        features: [
          "Interactive learning modules with gamified elements",
          "Progress tracking and personalized learning paths",
          "Resource library with curated AI content",
          "Community features for peer-to-peer learning",
        ],
        tags: [
          { name: "Next.js", icon: <SiNextdotjs /> },
          { name: "React", icon: <FaReact /> },
          { name: "TypeScript", icon: <SiTypescript /> },
          { name: "Tailwind", icon: <SiTailwindcss /> },
          { name: "MongoDB", icon: <SiMongodb /> },
        ],
        link: "https://ai-literacy-bridge.vercel.app/",
        accentColor: "#FFBF00",
        gradient: "linear-gradient(135deg, #FFBF00 0%, #FF5F6D 100%)",
        image: isMobile ? photo2 : img2,
        useIframe: false,
      },
      {
        id: 3,
        title: "Hospital Website",
        subtitle: "Healthcare Management",
        description:
          "A modern, responsive website for a hospital, featuring appointment booking, doctor profiles, and department information. Optimized for accessibility and speed, ensuring a seamless patient experience.",
        features: [
          "Online appointment booking system",
          "Detailed doctor profiles and department listings",
          "Emergency contact integration and quick access",
          "Responsive design ensuring accessibility on all devices",
        ],
        tags: [
          { name: "React", icon: <FaReact /> },
          { name: "Vite", icon: <SiVite /> },
          { name: "Tailwind", icon: <SiTailwindcss /> },
          { name: "Node.js", icon: <FaNodeJs /> },
        ],
        link: "https://hospital-1-o278.vercel.app",
        accentColor: "#9f529e",
        gradient: "linear-gradient(135deg, #9f529e 0%, #f77062 100%)",
        image: isMobile ? photo3 : img3,
        useIframe: false,
      },
    ],
    [isMobile]
  );

  const activeProject = projects[activeIndex];

  return (
    <section id="work" className="bg-[#050505] text-white relative">
      
      {/* Gradient transition from Skills section */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />

      {/* Header */}
      <div className="w-full flex justify-center pt-16 md:pt-24 pb-8 md:pb-16 z-20">
        <h2 className="text-4xl md:text-6xl text-center flex items-baseline gap-3">
          <span
            className="font-serif italic font-light tracking-wide text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Curated
          </span>
          <span
            className="font-light bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Sacramento', cursive", fontSize: "1.4em" }}
          >
            work
          </span>
        </h2>
      </div>

      {isMobile ? (
        // MOBILE LAYOUT
        <div className="flex flex-col gap-16 px-4 pb-20">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-6">
              {/* Image Card Mobile */}
              <div
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: project.gradient }}
              >
                <div className="w-full h-full p-1">
                  <div className="w-full h-full bg-black/20 rounded-[14px] overflow-hidden relative">
                    {project.useIframe ? (
                      <iframe
                        src={project.link}
                        className="w-full h-full bg-white object-cover rounded-xl pointer-events-none"
                        title={project.title}
                      />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Text Mobile */}
              <div>
                <h3
                  className="text-2xl font-serif text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium border-b border-gray-600 pb-1 inline-block hover:text-white hover:border-white transition-colors"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // DESKTOP LAYOUT (Left Scroll, Right Sticky)
        <div className="flex w-full max-w-[1400px] mx-auto px-8">
          
          {/* Left Column: Scrolling Images */}
          <div className="w-[60%] flex flex-col gap-24 pb-24">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                updateActiveImage={updateActiveImage}
              />
            ))}
          </div>

          {/* Right Column: Sticky Text Info */}
          <div className="w-[40%] h-screen sticky top-0 flex flex-col justify-center pl-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Title & Subtitle */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-[2px] w-12 bg-current"
                      style={{ color: activeProject.accentColor }}
                    />
                    <h3 className="text-xl font-medium tracking-wide text-gray-400">
                      {activeProject.subtitle}
                    </h3>
                  </div>
                  <h2
                    className="text-6xl font-serif text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {activeProject.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-lg leading-relaxed">
                  {activeProject.description}
                </p>

                {/* Features */}
                <div className="space-y-4">
                  {activeProject.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <BsStars
                        className="min-w-[20px] text-xl mt-1"
                        style={{ color: activeProject.accentColor }}
                      />
                      <span className="text-gray-300 font-light text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 pt-6">
                  {activeProject.tags.map((tag, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-gray-300"
                    >
                      {tag.icon}
                      <span>{tag.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      )}
    </section>
  );
}
