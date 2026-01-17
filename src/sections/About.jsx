import React, { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import p from "../assets/p.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeObserver = new ResizeObserver(() => {
      // Make canvas cover the full section, even if content is smaller
      // Ideally we want it fixed relative to viewport for the effect
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    resizeObserver.observe(sectionRef.current);

    const particleCount = 500; // Increased count for better detail
    const particles = [];
    const connectionDistance = 60;
    const mouse = { x: -1000, y: -1000 };

    // Function to get points inside a top-down brain shape (2 hemispheres)
    const getBrainPoint = () => {
      // Top-Down View (Axial View) - Organic Ovoid Shape
      // Two hemispheres, smoother curve, no sharp edges
      
      let inside = false;
      let x = 0, y = 0;
      
      while (!inside) {
        // Random point in range
        x = (Math.random() - 0.5) * 2.5; 
        y = (Math.random() - 0.5) * 2.5;

        // No forced gap check (Math.abs(x) < 0.08) to avoid sharp inner edges.
        // The separation will come from the offset centers.

        // Hemisphere Centers
        // Left: -0.5, Right: +0.5
        // Increased offset to create a clear gap
        const xSign = x >= 0 ? 1 : -1;
        const xCent = 0.5 * xSign; 
        
        const dx = x - xCent;
        const dy = y;

        // Organic Tapering via "Egg" Geometry
        // Narrower at Front (Top, y < 0), Wider at Back (Bottom, y > 0)
        
        // Base Width (Radius X)
        // Maintained circularity but adjusted for gap
        const rx = 0.45 + (y * 0.06); 
        
        // Height (Radius Y)
        const ry = 0.75; 

        // Superellipse-ish for rounder shoulders / less pointy
        // (dx/rx)^2 + (dy/ry)^2 <= 1
        
        const normalizedDist = (dx*dx)/(rx*rx) + (dy*dy)/(ry*ry);

        if (normalizedDist <= 1) {
             // Only minimal noise to avoid "perfect geometry" look, but maintain smoothness
             if (Math.random() > 0.02) inside = true;
        }
      }
      return { x, y };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        const brainPos = getBrainPoint();
        
        // Coloring based on Lobe Position (Top-Down)
        // Y-axis determines lobe in this view ( Top=-y, Bottom=+y )
        // Frontal (Top): y < -0.4
        // Parietal (Mid): -0.4 < y < 0.3
        // Occipital (Bottom): y > 0.3
        
        let color = "#ffffff";
        
        // Check "Hemisphere" side for coloring nuance? 
        // No, just lobes.
        
        if (brainPos.y < -0.4) {
            color = "#FF4d4d"; // Frontal - Bright Red
        } else if (brainPos.y > 0.4) {
             color = "#4d94ff"; // Occipital - Bright Blue
        } else {
            color = "#00e676"; // Parietal - Bright Green
        }

        particles.push({
            // Chaos: scattered widely across the screen/canvas
            // Using a range slightly larger than screen to make them come from "everywhere"
            chaosX: (Math.random() - 0.5) * window.innerWidth * 1.5 + window.innerWidth / 2,
            chaosY: (Math.random() - 0.5) * window.innerHeight * 1.5 + window.innerHeight / 2,
            brainXNormalized: brainPos.x,
            brainYNormalized: brainPos.y,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 2, // varied size
            baseAlpha: Math.random() * 0.6 + 0.4,
            color: color 
        });
    }

    const state = { progress: 0 }; // 0 = chaos, 1 = brain formed

    // Animate from chaos (top of section) to brain structure (mid section)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom", // Start when top of section hits bottom of viewport
            end: "bottom center", // Extended end point
            scrub: 4, // SLOWER SCRUB for user request "come together more slowly"
        }
    });

    tl.fromTo(state, { progress: 0 }, { progress: 1, ease: "power2.out" });

    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Render Loop
    const render = () => {
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Position brain in the visual center of the section content
        // We'll put it slightly behind or around the content
        
        // Let's position it to the right side if desktop, center if mobile
        // Or simply center it as a background watermark
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2; 
        const scale = Math.min(canvas.width, canvas.height) * 0.65; // Increased size to 65%

        // Draw connections with gradient or specific colors?
        // Let's use the particle color for connections or a subtle white mix
        if (state.progress > 0.3) {
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particleCount; i++) {
                // Reduce checks for performance
                if (i % 2 !== 0) continue; 
                
                const p1 = particles[i];
                // Only connect to others if they are somewhat formed
                if (!p1.color) continue;

                for (let j = i + 1; j < particleCount; j++) {
                     const p2 = particles[j];
                     const dx = p1.x - p2.x;
                     const dy = p1.y - p2.y;
                     const distSq = dx*dx + dy*dy;
                     if (distSq < connectionDistance * connectionDistance) {
                         ctx.beginPath();
                         // Blend colors of p1 and p2? Or just use white alpha
                         // Using a fixed alpha white looks good for "synapses"
                         ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * state.progress})`;
                         ctx.moveTo(p1.x, p1.y);
                         ctx.lineTo(p2.x, p2.y);
                         ctx.stroke();
                     }
                }
            }
        }

        particles.forEach((p, i) => {
            // Target
            // Interpolate from a scattered state to the brain state
            const targetX = gsap.utils.interpolate(p.chaosX, centerX + p.brainXNormalized * scale, state.progress);
            const targetY = gsap.utils.interpolate(p.chaosY, centerY + p.brainYNormalized * scale, state.progress);

            p.x += (targetX - p.x) * 0.02;
            p.y += (targetY - p.y) * 0.02;

             // Mouse Repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const force = (100 - dist) / 100;
                const angle = Math.atan2(dy, dx);
                p.x += Math.cos(angle) * force * 5;
                p.y += Math.sin(angle) * force * 5;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color || "#ffffff"; // Use assign color
            ctx.globalAlpha = p.baseAlpha * 0.8 + (state.progress * 0.2); 
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        resizeObserver.disconnect();
        cancelAnimationFrame(animId);
        if (tl) tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen w-full flex items-center justify-center relative bg-[#111827] text-white overflow-hidden"
      aria-label="About me"
    >
      {/* Brain Canvas Background - positioned absolute so it overlays/underlays content */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-100"
      />

      {/* Darker Background for high contrast */}
      <div className="absolute inset-0 pointer-events-none bg-black/30" />

      {/* Subtle, darker accents to not overpower the glowing brain */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-[360px] h-[360px] rounded-full bg-[#FF007F] opacity-10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-10 w-[420px] h-[420px] rounded-full bg-[#00F0FF] opacity-10 blur-[150px] animate-pulse delay-300" />
      </div>

      {/* Content container */}
      <div 
        ref={containerRef}
        className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12 py-20 flex flex-col gap-12"
      >
        
        {/* Profile header */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-stretch gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Avatar / Card */}
          <motion.div
            className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#45B7D1]/20 to-[#FF6B6B]/20 border border-[#45B7D1]/25"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            aria-hidden="true"
          >
            {/* Replace with your actual avatar image */}
            
            <div className="absolute inset-0 " />
           
            <img src={p} alt="test" />
          </motion.div>

          {/* Name + Role + Bio + CTAs */}
          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#45B7D1] via-[#4ECDC4] to-[#FF6B6B]">
              Dhruva Wani
            </h2>
            <p className="mt-2 text-lg sm:text-xl text-white/90 font-semibold">
              Full Stack Developer & AI ML
            </p>

            <p className="mt-4 text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl md:max-w-3xl">
             I develop scalable full-stack applications and intelligent voice agents, creating solutions for accessibility, e-commerce, and healthcare. My experience includes building responsive client-facing websites and AI-integrated tools for digital agencies and corporate social responsibility initiatives.
            </p>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              {[
                { label: "Experience", value: "2+ years" },
                { label: "Specialty", value: "Full Stack & AI ML" },
                { label: "Focus", value: "Scalability and AI Integration" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="text-sm text-gray-400">{item.label}</div>
                  <div className="text-base font-semibold text-white">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-lg bg-white text-black font-semibold px-5 py-3 hover:bg-gray-200 transition"
                aria-label="View my projects"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white px-5 py-3 hover:bg-white/20 transition"
                aria-label="Get in touch"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>

        {/* Body copy only — removed skills chip grid */}
        <div className="grid md:grid-cols-1">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              About Me
            </h3>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
             I am a Full Stack Developer and AI enthusiast currently pursuing a B.Tech in Artificial Intelligence. I specialize in merging modern web technologies with cutting-edge AI capabilities, including Large Language Models (LLMs) and speech recognition systems. My portfolio includes building real-time voice assistants and accessibility-focused education platforms. A published author at age 14, I blend technical precision with a creative mindset to deliver impactful digital products.
            </p>
            <p className="mt-4 text-gray-400 text-base sm:text-lg">
              I love turning ideas into scalable, user‑friendly products that make an impact. 
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

