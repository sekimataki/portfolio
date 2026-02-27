"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Project = {
  id: "airy" | "asana" | "enlight" | "capitalcue" | "nest fit";
  label: string;
  subtitle: string;
  description: string;
  image: string;
};

const PROJECTS: Project[] = [
  {
    id: "airy",
    label: "01 Airy",
    subtitle: "2022 | UX design",
    description: "Engage Scoliosis patients towards brace compliance",
    image: "/airy-cover.png",
  },
  {
    id: "asana",
    label: "02 Asana",
    subtitle: "2025 | Product design",
    description: "Design AI Teammates experience for collaborative workflows",
    image: "/asana-cover.png",
  },
  {
    id: "enlight",
    label: "03 Enlight",
    subtitle: "2024 | Product design",
    description: "Unlocking digital entrepreneurship for billions of visually impaired individuals",
    image: "/enlight-cover.png",
  },
  {
    id: "capitalcue",
    label: "04 CapitalCue",
    subtitle: "2023 | Data visualization",
    description: "Deciphering gen AI investment and how it might impact our day-to-day life",
    image: "/capitalcue-cover.png",
  },
  {
    id: "nest fit",
    label: "05 Nest Fit",
    subtitle: "2021 | Product design",
    description: "Instill confidence in home fitness",
    image: "/nestfit-cover.jpg",
  },
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [highlightPosition, setHighlightPosition] = useState({ x: 50, y: 50 });
  const [activeProjectId, setActiveProjectId] = useState<Project["id"]>("airy");
  const [displayedProject, setDisplayedProject] = useState<Project>(PROJECTS[0]);
  const [previewVisible, setPreviewVisible] = useState(true);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const transitionTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateGradientPosition = () => {
      const targetX = (mousePosition.x / window.innerWidth) * 100;
      const targetY = (mousePosition.y / window.innerHeight) * 100;

      setHighlightPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * 0.1;
        const newY = prev.y + (targetY - prev.y) * 0.1;
        return { x: newX, y: newY };
      });

      setGradientPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * 0.02;
        const newY = prev.y + (targetY - prev.y) * 0.02;
        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(updateGradientPosition);
    };

    animationFrameRef.current = requestAnimationFrame(updateGradientPosition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const handleProjectClick = (project: Project) => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    setActiveProjectId(project.id);

    if (!displayedProject) {
      setDisplayedProject(project);
      setPreviewVisible(true);
      return;
    }

    if (displayedProject.id === project.id) {
      return;
    }

    setPreviewVisible(false);
    transitionTimerRef.current = window.setTimeout(() => {
      setDisplayedProject(project);
      setPreviewVisible(true);
    }, 200);
  };

  return (
    <main className="relative h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-[#F9F8F8]">
      {/* Slow-moving background gradient (long tail) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #FBD8C9 15%, #FBE4BE 45%, #F6F5F4 80%)`,
        }}
      />
      
      {/* Fast-moving highlight gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(circle at ${highlightPosition.x}% ${highlightPosition.y}%, #FBD5C1 0%, transparent 20%)`,
        }}
      />

      {/* Fixed global header */}
      <header className="fixed top-0 left-0 right-0 z-20 h-[10vh] md:h-[13vh] flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-20">
        <Link href="/">
          <h1 className="font-mazeani text-[#71767D] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all uppercase">
            Sangyu Xi
          </h1>
        </Link>
        <Link href="/about">
          <h2 className="font-mazeani text-[#71767D] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight uppercase cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all">
            About
          </h2>
        </Link>
      </header>

      {/* Section 1 */}
      <section className="relative z-10 h-screen snap-start">
        <div className="absolute top-[10vh] md:top-[13vh] left-0 right-0 bottom-[200px] sm:bottom-[240px] md:bottom-[265px] flex items-center justify-center z-10">
          <div className="font-montserrat font-regular text-[#F9F8F8] text-2xl sm:text-3xl md:text-4xl leading-[60px] sm:leading-[80px] md:leading-[100px] tracking-[20px] sm:tracking-[30px] md:tracking-[40px] uppercase text-left">
            <p className="mb-0">DESIGN</p>
            <p className="mb-0">FOR/WITH</p>
            <p className="mb-0">AI</p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 w-screen h-[200px] sm:h-[240px] md:h-[265px] border-t border-white/30 z-10"
          style={{
            backdropFilter: "blur(80px) saturate(80%)",
            WebkitBackdropFilter: "blur(80px) saturate(80%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start px-5 sm:px-8 md:px-20 pt-6 sm:pt-10 md:pt-16 gap-4 sm:gap-0">
            <div className="flex flex-col gap-2 sm:gap-4">
              <h3 className="font-mazeani text-[#71767D] text-2xl sm:text-3xl md:text-4xl font-normal">
                Product Designer
              </h3>
              <div className="font-montserrat font-medium text-[#71767D] text-sm sm:text-base md:text-lg leading-relaxed">
                <p className="mb-1">
                  Designing AI Teammates at{" "}
                  <a
                    href="https://asana.com/product/ai/ai-teammates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#FF4500] hover:underline transition-all"
                  >
                    Asana
                  </a>
                </p>
                <p className="mb-1">
                  Master's in Design Engineering at{" "}
                  <a
                    href="https://mde.harvard.edu/sangyu-xi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#FF4500] hover:underline transition-all"
                  >
                    Harvard
                  </a>
                </p>
                <p className="mb-0 font-medium hidden sm:block">
                  Passionate about designing for AI-powered SaaS products
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-8 flex-wrap sm:flex-nowrap">
              {[
                { src: "recognition1.svg", href: "https://www.designboom.com/technology/sangyu-xi-airy-scoliosis-brace-james-dyson-award-10-10-2022/" },
                { src: "recognition2.svg", href: "https://designawards.core77.com/health-wellness/112463/Airy-scoliosis-brace" },
                { src: "recognition3.svg", href: "https://innovationlabs.harvard.edu/venture/amimi" },
                { src: "recognition4.svg", href: "https://vimeo.com/758864079" },
                { src: "recognition5.svg", href: "https://www.dezeen.com/2022/10/10/sangyu-xi-airy-scoliosis-brace-teenagers-confidence/" },
                { src: "recognition6.svg", href: "https://www.prototypesforhumanity.com/project/airy/" },
                { src: "recognition7.svg", href: "https://www.dyson.com/newsroom/news/corporate/airy-james-dyson-award" },
              ].map((item, i) => (
                <a
                  key={`recognition-${i + 1}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={item.src}
                    alt={`Recognition ${i + 1}`}
                    className="w-[32px] sm:w-[40px] md:w-[60px] h-auto object-contain hover:opacity-70 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Project Preview */}
      <section className="relative z-10 h-screen snap-start px-5 sm:px-8 md:px-12 lg:px-16 pt-[10vh] md:pt-[12vh] pb-8 md:pb-20">

        <div className="mt-4 md:mt-8 flex flex-col lg:grid h-[calc(100%-1rem)] md:h-[calc(100%-2rem)] gap-4 sm:gap-6 lg:gap-24 lg:grid-cols-[7fr_3fr]">
          <div className="relative h-[45vh] sm:h-[50vh] lg:h-[90%] rounded-sm bg-white/20 shadow-[4px_4px_10px_0px_rgba(171,171,171,0.75)] overflow-hidden order-2 lg:order-1">
            <div
              className={`absolute inset-0 transition-opacity duration-[400ms] ${previewVisible ? "opacity-100" : "opacity-0"}`}
            >
              {displayedProject ? (
                displayedProject.image.endsWith(".mp4") ? (
                  <video
                    src={displayedProject.image}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={displayedProject.image}
                    alt={displayedProject.label}
                    className="h-full w-full object-cover"
                  />
                )
              ) : null}
            </div>
            {!displayedProject ? (
              <div className="absolute inset-0 flex items-center justify-center font-montserrat text-base md:text-xl text-black/35">
                Select a project preview
              </div>
            ) : null}
          </div>

          <div className="pt-0 lg:pt-2 order-1 lg:order-2">
            <div className="flex lg:flex-col gap-3 sm:gap-4 lg:gap-0 lg:space-y-8 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {PROJECTS.map((project) => {
                const active = activeProjectId === project.id;
                return (
                  <div key={project.id} className="transition-all duration-300 flex-shrink-0 lg:flex-shrink">
                    <button
                      type="button"
                      onClick={() => handleProjectClick(project)}
                      className={`block text-left font-mazeani text-lg sm:text-2xl lg:text-4xl leading-tight sm:leading-snug lg:leading-[60px] transition-colors duration-300 whitespace-nowrap lg:whitespace-normal ${
                        active ? "text-[#ff5432]" : "text-black/50 hover:text-black/70"
                      }`}
                    >
                      {project.label}
                    </button>
                    {active ? (
                      <div className="mt-1 space-y-1 sm:space-y-2 lg:space-y-3 text-[#ff5432] transition-all duration-300 hidden lg:block">
                        <p className="font-montserrat text-lg lg:text-2xl font-semibold">{project.subtitle}</p>
                        <p className="font-montserrat text-sm lg:text-lg leading-tight max-w-[24rem]">
                          {project.description}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {activeProjectId && (
              <div className="mt-2 text-[#ff5432] lg:hidden">
                {(() => {
                  const active = PROJECTS.find((p) => p.id === activeProjectId);
                  if (!active) return null;
                  return (
                    <>
                      <p className="font-montserrat text-sm sm:text-base font-semibold">{active.subtitle}</p>
                      <p className="font-montserrat text-xs sm:text-sm leading-tight">{active.description}</p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
