import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ExperienceParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="experience-particles"
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Connects lines from mouse to particles
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          color: {
            value: "#eaeef1", // Deep blue-ish/cyan
          },
          links: {
            color: "#eff6fa",
            distance: 150,
            enable: true,
            opacity: 0.2, // Very dim
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1, // Slow moving
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 40, // Low count
          },
          opacity: {
            value: 0.3, // Dim
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ExperienceParticles;
