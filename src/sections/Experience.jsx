// Importing React for building UI components
import React from "react";
// Importing motion components and scroll hooks from Framer Motion for animations
import { motion, useScroll, useTransform } from "framer-motion";

// Array of experience objects containing job details
const experiences = [
  {
    role: "AI & Web Development Intern ",
    company: "TechSaksham",
    duration: "2024",
    description:
      "I built an NLP-powered Healthcare AI Chatbot and gained hands-on experience in AI-driven full-stack web development for real-world healthcare applications.",
  },
  
  {
    role: "Web Developer Intern",
    company: "Chaya Digital Agency ",
    duration: "2025",
    description:
      "Developed scalable, high-performance web applications using Next.js and React.js while collaborating with Chaya Digital Agency on real-time projects, contributing to feature development and UI/UX enhancements.",
  },
{
    role: "Google Student Ambassador",
    company: "Google",
    duration: "2025 - Present",
    description:
      "As a Google Student Ambassador, I actively promote Google's technologies and initiatives on campus, organize tech events, and foster a community of learners passionate about innovation and technology.",
  },
  {
    role: "B.Tech",
    company: "K.J Somaiya Institute of Technology",
    duration: "2024 - Present",
    description:
      "As a Google Student Ambassador, I actively promote Google's technologies and initiatives on campus, organize tech events, and foster a community of learners passionate about innovation and technology.",
  },


];

// Reusable component to render each experience item with animations
function ExperienceItem({ exp, idx, start, end, scrollYProgress, layout }) {
  // Animates the size of the marker (dot) as user scrolls
  const markerScale = useTransform(scrollYProgress, [start, end], [0, 1]);
  // Animates the opacity of the marker
  const markerOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  // Animates the opacity of the card
  const cardOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  // Checks if card should be displayed above or below the timeline line
  // Force all items below the line for a single-line view
  const isAbove = false;
  // Animates vertical movement of cards for desktop layout
  const cardY = useTransform(scrollYProgress, [start, end], [isAbove ? 30 : -30, 0]);
  // Animates horizontal movement of cards for mobile layout
  const cardX = useTransform(scrollYProgress, [start, end], [-24, 0]);

  // Render for Desktop layout
  if (layout === "desktop") {
    return (
      <div className="relative flex-1 flex justify-center items-center min-w-0" key={`${exp.company}-${exp.role}-${idx}`}>
        {/* Marker dot on the timeline */}
        <motion.div
          className="z-10 w-7 h-7 rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.1)]"
          style={{ scale: markerScale, opacity: markerOpacity }}
        />
        {/* Small vertical line above or below the marker */}
        <motion.div
          className={`absolute ${isAbove ? "-top-8" : "-bottom-8"} w-[3px] bg-white/40`}
          style={{ height: 40, opacity: cardOpacity }}
        />
        {/* Experience card with role, company, duration, description */}
        <motion.article
          className={`absolute ${isAbove ? "bottom-12" : "top-12"} bg-gray-900/80 backdrop-blur border border-gray-700/70 rounded-xl p-7 w-[320px] shadow-lg`}
          style={{ opacity: cardOpacity, y: cardY, maxWidth: "90vw" }}
          transition={{ duration: 0.4, delay: idx * 0.15 }}
        >
          <h3 className="text-xl font-semibold">{exp.role}</h3>
          <p className="text-md text-gray-400 mb-3">{exp.company} | {exp.duration}</p>
          <p className="text-md text-gray-300 break-words">{exp.description}</p>
        </motion.article>
      </div>
    );
  }

  // Render for Mobile layout
  return (
    <div key={`${exp.company}-${exp.role}-m-${idx}`} className="relative flex items-start">
      {/* Marker dot on mobile timeline */}
      <motion.div
        className="absolute -left-[14px] top-3 z-10 w-7 h-7 rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.1)]"
        style={{ scale: markerScale, opacity: markerOpacity }}
      />
      {/* Experience card (mobile version) */}
      <motion.article
        className="bg-gray-900/80 backdrop-blur border border-gray-700/70 rounded-xl p-5 w-[90vw] max-w-sm ml-6 shadow-lg"
        style={{ opacity: cardOpacity, x: cardX }}
        transition={{ duration: 0.4, delay: idx * 0.15 }}
      >
        <h3 className="text-lg font-semibold break-words">{exp.role}</h3>
        <p className="text-sm text-gray-400 mb-2 break-words">{exp.company} | {exp.duration}</p>
        <p className="text-sm text-gray-300 break-words">{exp.description}</p>
      </motion.article>
    </div>
  );
}

// Main Experience component
const Experience = () => {
  const sceneRef = React.useRef(null); // Ref for the scrolling section
  const [isMobile, setIsMobile] = React.useState(false); // State to track if device is mobile

  // Detect window size and set isMobile state
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamic scene height based on device type and number of experiences
  const SCENE_HEIGHT_VH = isMobile ? "auto" : 100 * experiences.length * 1.2;

  // Get scroll progress for animations
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });


  // Calculate thresholds for each experience card's animation start/end
  const numExperiences = experiences.length;
  const thresholds = React.useMemo(
    () => Array.from({ length: numExperiences }, (_, i) => (i + 1) / numExperiences),
    [numExperiences]
  );

  // Sliding Logic: Desktop only, > 3 items
  const shouldSlide = !isMobile && numExperiences > 3;
  // Calculate width so 3 items are always visible (N/3 * 100%)
  const slideWidthPct = shouldSlide ? (numExperiences / 3) * 100 : 100;
  
  // Custom Scroll Transformation
  // 0 to 0.5 (approx): Fill up the first 3 items (no slide)
  // 0.5 to 1.0: Slide the rest
  
  // If we have 4 items. 
  // Timeline:
  // 0.0 - 0.75: Reveal items 1, 2, 3 (Thresholds handle this via ExperienceItem opacity?) 
  // BUT the xScroll currently starts at 0.
  
  // We want xScroll to stay at 0 until we've "reached" the 3rd item.
  // The thresholds are evenly distributed: 0.25, 0.5, 0.75, 1.0. 
  // So at 0.75, item 3 is fully "done".
  // So we should start sliding after the point where the 3rd item is fully active.
  
  // Let's create a custom range for the slide.
  // Start sliding after (3 / N) progress.
  const slideStart = shouldSlide ? 3 / numExperiences : 0;
  
  const xScroll = useTransform(
      scrollYProgress, 
      [slideStart, 1], // Start sliding ONLY after 3rd item's "time"
      ["0%", `-${slideWidthPct - 100}%`],
      { clamp: true } // Don't slide backwards before slideStart
  );

  // Animate timeline line width (desktop) and height (mobile)
  const lineWidth = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const lineHeight = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  return (
    <section id="experience" className="relative bg-black text-white">
      {/* Main container with dynamic height */}
      <div ref={sceneRef} style={{ height: isMobile ? "auto" : `${SCENE_HEIGHT_VH}vh`, minHeight: isMobile ? "auto" : "150vh" }} className="relative">
        <div className={`flex flex-col ${isMobile ? "relative pb-10" : "sticky top-0 h-screen"}`}>
          {/* Section Title */}
          <div className="shrink-0 px-6 pt-8">
            <h2 className="text-4xl sm:text-5xl font-semibold mt-5 text-center">Experience</h2>
          </div>
          {/* Timeline container */}
          <div className={`flex-1 flex items-start justify-center px-6 pb-10 pt-32 ${isMobile ? "overflow-visible" : "overflow-hidden"}`}>
            {/* Desktop Timeline */}
            <div className="relative w-full max-w-7xl hidden md:block">
              {/* Sliding Wrapper */}
              <motion.div style={{ width: `${slideWidthPct}%`, x: shouldSlide ? xScroll : 0 }}>
                  {/* Horizontal timeline line */}
                  <div className="relative h-[6px] bg-white/15 rounded">
                    <motion.div className="absolute left-0 top-0 h-[6px] bg-white rounded origin-left" style={{ width: lineWidth }} />
                  </div>
                  {/* Experience items mapped for desktop */}
                  <div className="relative flex justify-between mt-0">
                    {experiences.map((exp, idx) => {
                      const start = idx === 0 ? 0 : thresholds[idx - 1];
                      const end = thresholds[idx];
                      return (
                        <ExperienceItem
                          key={`${exp.company}-${exp.role}-${idx}`}
                          exp={exp}
                          idx={idx}
                          start={start}
                          end={end}
                          scrollYProgress={scrollYProgress}
                          layout="desktop"
                        />
                      );
                    })}
                  </div>
              </motion.div>
            </div>
            {/* Mobile Timeline */}
            <div className="relative w-full max-w-md md:hidden">
              {/* Vertical timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-white/15 rounded">
                <motion.div className="absolute top-0 left-0 w-[6px] bg-white rounded origin-top" style={{ height: lineHeight }} />
              </div>
              {/* Experience items mapped for mobile */}
              <div className="relative flex flex-col gap-10 ml-10 mt-6 pb-28">
                {experiences.map((exp, idx) => {
                  const start = idx === 0 ? 0 : thresholds[idx - 1];
                  const end = thresholds[idx];
                  return (
                    <div key={`${exp.company}-${exp.role}-m-${idx}`} className="relative flex items-start">
                      {/* Marker dot on mobile timeline */}
                      <motion.div
                        className="absolute -left-[14px] top-3 z-10 w-7 h-7 rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.1)]"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Experience card (mobile version) */}
                      <motion.article
                        className="bg-gray-900/80 backdrop-blur border border-gray-700/70 rounded-xl p-5 w-[90vw] max-w-sm ml-6 shadow-lg"
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                      >
                        <h3 className="text-lg font-semibold break-words">{exp.role}</h3>
                        <p className="text-sm text-gray-400 mb-2 break-words">{exp.company} | {exp.duration}</p>
                        <p className="text-sm text-gray-300 break-words">{exp.description}</p>
                      </motion.article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience; // Exporting Experience component
