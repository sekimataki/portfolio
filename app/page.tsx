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
        <div className="flex items-center gap-3">
          <Link href="/">
            <h1 className="font-mazeani text-[#71767D] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all uppercase">
              Sangyu Xi
            </h1>
          </Link>
        </div>
        <nav className="flex items-center gap-6 sm:gap-8 md:gap-12">
          <a
            href="#work"
            className="font-manrope text-[#71767D] text-lg sm:text-xl md:text-2xl font-normal tracking-[0.5px] cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all"
          >
            Work
          </a>
          <Link
            href="/about"
            className="font-manrope text-[#71767D] text-lg sm:text-xl md:text-2xl font-normal tracking-[0.5px] cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Section 1 */}
     <section className="relative z-10 h-screen snap-start">
        <div className="absolute top-[9vh] md:top-[12vh] left-0 right-0 bottom-[80px] sm:bottom-[100px] md:bottom-[120px] flex items-center justify-center z-10 px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <h2 className="font-manrope font-medium text-[#71767D] tracking-[0.5px] text-xl sm:text-2xl md:text-3xl leading-snug sm:leading-snug md:leading-snug tracking-[0px] mb-6 sm:mb-8">
              Designing a future where humanity thrives with AI
            </h2>

            <div className="font-manrope font-normal text-[#71767D] text-base sm:text-lg md:text-xl leading-relaxed mb-10 sm:mb-14 md:mb-16">
              <p className="mb-4">
                Hello, I&apos;m Sangyu, a product designer with{" "}
                <a
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FE6F61] hover:underline transition-all"
                >
                  3 years
                </a>
                {" "}of experience across consulting and tech - currently designing AI Teammates at{" "}
                <a
                  href="https://asana.com/product/ai/ai-teammates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FE6F61] hover:underline transition-all"
                >
                  Asana
                </a>
                , building the future of multi-agent collaboration.
              </p>
              <p>
                Graduated from Master&apos;s in Design Engineering at{" "}
                <a
                  href="https://mde.harvard.edu/sangyu-xi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FE6F61] hover:underline transition-all"
                >
                  Harvard
                </a>
                , my passion lies at the intersection of design, business and technology. Today, that passion drives my work on helping humanity thrives with AI-powered products.
              </p>
            </div>

            
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[80px] sm:h-[100px] md:h-[120px] border-t border-white/30 z-10"
          style={{
            backdropFilter: "blur(80px) saturate(80%)",
            WebkitBackdropFilter: "blur(80px) saturate(80%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap h-full px-5 sm:px-8 md:px-20">
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
                    className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[20px] sm:h-[24px] md:h-[30px]"} w-auto object-contain hover:opacity-70 transition-opacity`}
                  />
                </a>
              ))}
            </div>
        </div>
      </section>

      {/* Section 2: Project Preview */}
      <section id="work" className="relative z-10 h-screen snap-start px-5 sm:px-8 md:px-12 lg:px-16 pt-[10vh] md:pt-[12vh] pb-8 md:pb-20">

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
              <div className="absolute inset-0 flex items-center justify-center font-manrope text-base md:text-xl text-black/35">
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
                        <p className="font-manrope text-lg lg:text-2xl font-semibold">{project.subtitle}</p>
                        <p className="font-manrope text-sm lg:text-lg leading-tight max-w-[24rem]">
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
                      <p className="font-manrope text-sm sm:text-base font-semibold">{active.subtitle}</p>
                      <p className="font-manrope text-xs sm:text-sm leading-tight">{active.description}</p>
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
