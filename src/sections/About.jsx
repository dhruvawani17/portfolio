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

    const particleCount = 700; // Increased count for better detail
    const particles = [];
    const connectionDistance = 60;
    const mouse = { x: -1000, y: -1000 };

    // Function to get points inside a top-down brain shape (2 hemispheres)
    const getBrainPoint = (isOutline = false) => {
      // Top-Down View (Axial View) - Organic Ovoid Shape
      // Two hemispheres, smoother curve, no sharp edges
      
      let inside = false;
      let x = 0, y = 0;
      
      while (!inside) {
        if (isOutline) {
            // Generate points specifically ON the boundary
            // We can pick a random angle and side
            const theta = Math.random() * Math.PI * 2;
            const side = Math.random() > 0.5 ? 1 : -1;
            
            // Map theta (0-2PI) to Y range (-1 to 1) for distribution?
            // Actually, let's just use the parametric logic:
            // y goes from -0.9 to 0.9 roughly.
            // Let's generate y directly
            y = (Math.random() - 0.5) * 2.0;

            // Constrain y to [-1, 1] essentially
            if (y < -0.95 || y > 0.95) continue;

            const rx = 0.46 + (y * 0.06); 
            // x = center +/- rx * cos(theta)? NO.
            // The boundary is the ellipse edge.
            // (x - xc)^2 / rx^2 + y^2 / ry^2 = 1
            // x - xc = +/- rx * sqrt( 1 - y^2/ry^2 )
            
            const ry = 0.76;
            const term = 1 - (y*y)/(ry*ry);
            
            if (term < 0) continue; 
            
            // Outer edge is away from center
            // Left (xc < 0): we want the negative root -> x < xc
            // Right (xc > 0): we want the positive root -> x > xc
            // But we also want the inner edge (fissure)?
            // "Outline" usually implies the heavy outer silhouette.
            
            const xc = 0.5 * side; // Left or Right center
            const xOffset = rx * Math.sqrt(term);
            
            // We want the outer boundary specifically? 
            // For left side, outer is x = xc - xOffset
            // For right side, outer is x = xc + xOffset
            // Let's also add some inner fissure points for definition
            
            if (Math.random() > 0.3) {
                // Outer edge
                x = xc + (side * xOffset);
            } else {
                 // Inner Fissure Edge
                 x = xc - (side * xOffset * 0.95); // Slightly inside to define the gap
            }
            
            inside = true;
        } else {
            // Existing Logic for "filling"
            // Random point in range
            x = (Math.random() - 0.5) * 2.5; 
            y = (Math.random() - 0.5) * 2.5;

            // Hemisphere Centers
            // Left: -0.6, Right: +0.6
            // Decreased offset slightly to reduce central gap
            const xSign = x >= 0 ? 1 : -1;
            const xCent = 0.52 * xSign; 
            
            const dx = x - xCent;
            const dy = y;

            // Organic Tapering
            const rx = 0.46 + (y * 0.06); 
            const ry = 0.76; 

            // Superellipse-ish 
            const normalizedDist = (dx*dx)/(rx*rx) + (dy*dy)/(ry*ry);

            if (normalizedDist <= 1) {
                 if (Math.random() > 0.02) inside = true;
            }
        }
      }
      return { x, y };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        // Dedicate ~30% particles to defining the outline
        const isOutline = i < particleCount * 0.3;
        const brainPos = getBrainPoint(isOutline);
        
        // Coloring based on Lobe Position (Top-Down)
        // ...existing code...
        // ...
        
        let color = "#ffffff";
        
        if (brainPos.y < -0.4) {
            color = "#FF4d4d"; // Frontal - Bright Red
        } else if (brainPos.y > 0.4) {
             color = "#4d94ff"; // Occipital - Bright Blue
        } else {
            color = "#00e676"; // Parietal - Bright Green
        }

        particles.push({
            // Chaos: scattered widely across the screen/canvas
            // ...existing code...
            chaosX: (Math.random() - 0.5) * window.innerWidth * 1.5 + window.innerWidth / 2,
            chaosY: (Math.random() - 0.5) * window.innerHeight * 1.5 + window.innerHeight / 2,
            brainXNormalized: brainPos.x,
            brainYNormalized: brainPos.y,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: isOutline ? Math.random() * 2 + 2 : Math.random() * 3 + 2, // varied size
            baseAlpha: isOutline ? 0.9 : Math.random() * 0.5 + 0.3, // Outline is more opaque
            color: color,
            isOutline: isOutline 
        });
    }

    const state = { progress: 0 }; // 0 = chaos, 1 = brain formed

    // Animate from chaos (top of section) to brain structure (mid section)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom", // Start when top of section hits bottom of viewport
            end: "center center", // End when center of section hits center of viewport (midway)
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

        // Optimization: Skip rendering if canvas is hidden (mobile view)
        if (canvas.offsetParent === null) {
            requestAnimationFrame(render);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Position brain in the visual center of the section content
        // We'll put it slightly behind or around the content
        
        // Let's position it to the right side if desktop, center if mobile
        // Or simply center it as a background watermark
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2; 
        const scale = Math.min(canvas.width, canvas.height) * 0.55; // Slightly smaller size per request

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
            
            // Add refined glow for outline particles
            if (p.isOutline && state.progress > 0.5) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = p.color || "#ffffff"; // Use assign color
            ctx.globalAlpha = p.baseAlpha * 0.8 + (state.progress * 0.2); 
            ctx.fill();
            ctx.shadowBlur = 0; // Reset for next particle
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
        className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none z-0 opacity-100"
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
                href="#work"
                className="inline-flex items-center justify-center rounded-lg bg-white text-black font-semibold px-5 py-3 hover:bg-gray-200 transition"
                aria-label="View my work"
              >
                View Work
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

