"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { HomeNavLink } from "@/components/HomeNavLink";

/** ease-out cubic — all entrance + hover motion */
const MOTION_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const STAGGER_MS = 110;
const REVEAL_DURATION_MS = 640;
const RECOGNITION_REVEAL_DELAY_MS = 800;

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FadeSlideSegment({
  show,
  index,
  className,
  children,
}: {
  show: boolean;
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const [noMotion, setNoMotion] = useState(false);
  useLayoutEffect(() => {
    setNoMotion(readPrefersReducedMotion());
  }, []);

  if (noMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translate3d(0,0,0)" : "translate3d(0,28px,0)",
        transitionProperty: "opacity, transform",
        transitionDuration: `${REVEAL_DURATION_MS}ms`,
        transitionTimingFunction: MOTION_EASE,
        transitionDelay: show ? `${index * STAGGER_MS}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

function useRevealOnMount() {
  const [show, setShow] = useState(false);
  useLayoutEffect(() => {
    if (readPrefersReducedMotion()) {
      setShow(true);
      return;
    }
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return show;
}

function useRevealOnScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (readPrefersReducedMotion()) {
      setShow(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, show };
}

/** Full-bleed hero: warm blobs, cursor-reactive “+” grid, gradient into page white. */
function HomeHero({ foldShow }: { foldShow: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const plusGrid = useMemo(() => {
    const cols = 48;
    const rows = 32;
    const cellW = 32;
    const cellH = 32;
    const plusArm = 3;
    const vbW = cols * cellW;
    const vbH = rows * cellH;
    const els: ReactNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2;
        const y = r * cellH + cellH / 2;
        els.push(
          <g key={`${r}-${c}`} transform={`translate(${x} ${y})`}>
            <line x1={-plusArm} y1="0" x2={plusArm} y2="0" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1={-plusArm} x2="0" y2={plusArm} stroke="currentColor" strokeWidth="0.5" />
          </g>,
        );
      }
    }
    return { vbW, vbH, els };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = heroRef.current;
    if (!el) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      });
    };
    const leave = () => {
      el.style.setProperty("--mx", "70%");
      el.style.setProperty("--my", "35%");
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero relative min-h-[min(68vh,760px)] overflow-hidden pb-8 pt-24 sm:min-h-[min(70vh,800px)] sm:pt-28 md:pt-32 md:pb-10"
    >
      <div className="hero-blob" aria-hidden />
      <div className="hero-plus-matrix" aria-hidden>
        <svg preserveAspectRatio="xMidYMid slice" viewBox={`0 0 ${plusGrid.vbW} ${plusGrid.vbH}`}>
          {plusGrid.els}
        </svg>
      </div>
      <div className="hero-content relative z-10 mx-auto w-full min-w-0 px-[clamp(1.5rem,5vw,3.5rem)]">
      <FadeSlideSegment show={foldShow} index={3} className="max-w-[992px] min-w-0 pl-[clamp(1.5rem,7vw,5.5rem)]">
          <h2 className="font-playfair text-[clamp(2rem,5.5vw,5rem)] font-medium leading-[1.08] tracking-loose text-pretty text-black sm:text-[clamp(1.75rem,5.5vw,5rem)] sm:leading-[1.5]">
            Designing{" "}
            <span
              className="font-playfair-variable italic"
              style={{
                fontVariationSettings: "'opsz' 5, 'wdth' 112.5",
                letterSpacing: "0.02em",
              }}
            >
              Human*AI
            </span>
          </h2>
          <h2 className="font-playfair text-[clamp(2rem,5.5vw,5rem)] font-medium leading-[1.08] tracking-loose text-pretty text-black sm:text-[clamp(1.75rem,5.5vw,5rem)] sm:leading-[1.05]">
          collaboration
          </h2>
        </FadeSlideSegment>

        <div className="mt-[18px] max-w-[992px] min-w-0 pl-[clamp(1.5rem,7vw,5.5rem)] font-manrope text-base font-regular leading-relaxed text-black sm:text-[18px] sm:leading-normal md:mt-[25px] md:text-[20px] lg:mt-[35px]">
          <div className="flex flex-col gap-2 sm:gap-2">
            <FadeSlideSegment show={foldShow} index={4} className="min-w-0">
              <p>
              Product designer at {" "}
                <a
                  href="https://asana.com/product/ai/ai-teammates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-black hover:opacity-70"
                >
                  Asana AI Teammates
                </a>
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={foldShow} index={5} className="min-w-0">
              <p>
                Harvard{" "}
                <a
                  href="https://mde.harvard.edu/sangyu-xi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-black hover:opacity-70"
                >
                Design Engineering{" "}
                </a>
              </p>
            </FadeSlideSegment>
          </div>
        </div>
      </div>
    </section>
  );
}

const TEXT = {
  muted: "#000000",
  accent: "#fe6f61",
};

const RECOGNITION = [
  { src: "/recognition1.svg", href: "https://www.designboom.com/technology/sangyu-xi-airy-scoliosis-brace-james-dyson-award-10-10-2022/" },
  { src: "/recognition2.svg", href: "https://designawards.core77.com/health-wellness/112463/Airy-scoliosis-brace" },
  { src: "/recognition3.svg", href: "https://innovationlabs.harvard.edu/venture/amimi" },
  { src: "/recognition4.svg", href: "https://vimeo.com/758864079" },
  { src: "/recognition5.svg", href: "https://www.dezeen.com/2022/10/10/sangyu-xi-airy-scoliosis-brace-teenagers-confidence/" },
  { src: "/recognition6.svg", href: "https://www.prototypesforhumanity.com/project/airy/" },
  { src: "/recognition7.svg", href: "https://www.dyson.com/newsroom/news/corporate/airy-james-dyson-award" },
];

const SPEAKING_LOGOS = [
  { src: "/speaking1.png", alt: "Speaking1" },
  { src: "/speaking2.png", alt: "Speaking2" },
  { src: "/speaking3.png", alt: "Speaking3" },
  { src: "/speaking4.png", alt: "Speaking4" },
] as const;

const SPEECH_IMAGES = [1, 2, 3, 4, 5] as const;

/** Project row — matches Figma 964:70 “project card” frames (969:831, 969:798, …). */
function WorkProjectCard({
  tag,
  title,
  meta,
  description,
  imageSrc,
  imageAlt,
  imageSide,
  imageHref,
  anchorId,
  children,
}: {
  tag: string;
  title: string;
  meta: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
  /** When set, the project image is clickable and navigates to this path (e.g. case study). */
  imageHref?: string;
  /** Optional id for in-page anchor navigation (e.g. nav “Work”). */
  anchorId?: string;
  children?: ReactNode;
}) {
  const { ref, show } = useRevealOnScroll<HTMLElement>();

  const pill = (
    <div className="inline-flex max-w-full shrink-0 items-center justify-center self-start rounded-full bg-[#f5f4f1] px-3 py-2 sm:px-4 sm:py-3">
      <span className="text-center font-manrope text-sm font-medium leading-snug text-black sm:text-base sm:whitespace-nowrap">
        {tag}
      </span>
    </div>
  );

  const titleBlock = imageHref ? (
    <Link
      href={imageHref}
      className="block text-inherit no-underline outline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/25"
      aria-label={`${title} — open case study`}
    >
      <h3 className="font-playfair text-[clamp(1.5rem,6vw,3rem)] font-medium leading-[1.2] text-pretty text-black sm:text-[clamp(1.75rem,7vw,3rem)] lg:text-[48px] lg:leading-[60px]">
        {title}
      </h3>
    </Link>
  ) : (
    <h3 className="font-playfair text-[clamp(1.5rem,6vw,3rem)] font-medium leading-[1.2] text-pretty text-black sm:text-[clamp(1.75rem,7vw,3rem)] lg:text-[48px] lg:leading-[60px]">
      {title}
    </h3>
  );

  const coverImage = (
    <img
      src={imageSrc}
      alt={imageAlt}
      className="h-full w-full object-cover opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-70"
    />
  );

  const imageColumn = (
    <div className="group relative mx-auto aspect-[4/3] w-full max-w-[min(100%,340px)] shrink-0 overflow-hidden rounded-[2em] sm:max-w-[400px] md:max-w-[520px] lg:mx-0 lg:max-w-[min(720px,55vw)]">
      {imageHref ? (
        <Link
          href={imageHref}
          className="block h-full w-full outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/25"
          aria-label={`${title} — open case study`}
        >
          {coverImage}
        </Link>
      ) : (
        coverImage
      )}
    </div>
  );

  const textStart = imageSide === "left" ? 1 : 0;
  let ti = textStart;
  const textStack = (
    <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-[691px]">
      <FadeSlideSegment show={show} index={ti++} className="w-fit max-w-full">
        {pill}
      </FadeSlideSegment>
      <div className="flex flex-col gap-4">
        <FadeSlideSegment show={show} index={ti++} className="w-full">
          {titleBlock}
        </FadeSlideSegment>
        <FadeSlideSegment show={show} index={ti++} className="flex w-full flex-col gap-4">
          <div className="h-px w-full bg-[#e9e9e9]" aria-hidden />
          <p className="font-manrope font-regular capitalize text-black sm:text-[18px] sm:leading-normal md:text-[20px]">
            {meta}
          </p>
        </FadeSlideSegment>
        <FadeSlideSegment show={show} index={ti++} className="flex w-full flex-col gap-4">
          <div className="h-px w-full bg-[#e9e9e9]" aria-hidden />
          <p className="font-manrope font-regular text-black/50 sm:text-[18px] sm:leading-normal">
            {description}
          </p>
        </FadeSlideSegment>
        {children ? (
          <FadeSlideSegment show={show} index={ti++} className="w-full">
            {children}
          </FadeSlideSegment>
        ) : null}
      </div>
    </div>
  );

  const imageIndexRight = ti;

  return (
    <article
      id={anchorId}
      ref={ref}
      className="flex w-full min-w-0 scroll-mt-28 flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-[59px]"
    >
      {imageSide === "left" ? (
        <>
          <FadeSlideSegment show={show} index={0} className="w-full shrink-0 lg:w-fit">
            {imageColumn}
          </FadeSlideSegment>
          {textStack}
        </>
      ) : (
        <>
          <div className="order-2 w-full min-w-0 lg:order-none">
            {textStack}
          </div>
          <FadeSlideSegment
            show={show}
            index={imageIndexRight}
            className="order-1 w-full shrink-0 lg:order-none lg:ml-auto lg:w-fit"
          >
            {imageColumn}
          </FadeSlideSegment>
        </>
      )}
    </article>
  );
}

export default function Home() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const foldShow = useRevealOnMount();
  const recReveal = useRevealOnScroll<HTMLDivElement>();
  const missionReveal = useRevealOnScroll<HTMLDivElement>();
  const speakReveal = useRevealOnScroll<HTMLDivElement>();
  const footReveal = useRevealOnScroll<HTMLElement>();
  const [recShowDelayed, setRecShowDelayed] = useState(false);
  const [showMoreProjects, setShowMoreProjects] = useState(false);

  useEffect(() => {
    if (!recReveal.show) return;
    const t = setTimeout(() => setRecShowDelayed(true), RECOGNITION_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [recReveal.show]);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: readPrefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">

      <header
        className={`fixed top-0 left-0 right-0 z-30 flex min-w-0 items-start justify-between gap-3 px-[max(1.25rem,env(safe-area-inset-left))] pb-4 pt-[calc(39px+env(safe-area-inset-top,0px))] pr-[max(1.25rem,env(safe-area-inset-right))] transition-[background-color,backdrop-filter,border-color] duration-300 sm:gap-4 sm:px-8 sm:pb-5 lg:px-[6em] ${
          headerScrolled
            ? "border-b border-black/[0.06] bg-white/75 backdrop-blur-md backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <FadeSlideSegment show={foldShow} index={0} className="flex min-w-0 items-center gap-2">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <h1 className="font-playfair text-[20px] font-bold uppercase leading-none text-black sm:text-[24px]">
              Sangyu Xi
            </h1>
          </Link>
          <a
            href="https://www.linkedin.com/in/sangyuxi/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-6 shrink-0 items-center hover:opacity-70"
            aria-label="LinkedIn"
          >
            <svg width="20" height="20" fill="#000000" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </FadeSlideSegment>
        <nav className="mt-[5px] flex shrink-0 items-center gap-5 capitalize sm:gap-8 md:gap-10 lg:gap-[60px]">
          <FadeSlideSegment show={foldShow} index={1} className="inline-flex">
            <HomeNavLink
              href="/#asana-project-settings"
              className="font-manrope text-base font-normal text-black/50 transition-colors hover:text-black/90 sm:text-[16px] md:text-[18px]"
            >
              Work
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={2} className="inline-flex">
            <HomeNavLink
              href="/#speaking"
              className="font-manrope text-base font-normal text-black/50 transition-colors hover:text-black/90 sm:text-[16px] md:text-[18px]"
            >
              Speaking
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={3} className="inline-flex">
            <Link
              href="/about"
              className="font-manrope text-base font-normal text-black/50 transition-colors hover:text-black/90 sm:text-[16px] md:text-[18px]"
            >
              About
            </Link>
          </FadeSlideSegment>
        </nav>
      </header>

      <div className="hero-panel relative z-10 mx-[clamp(1.25rem,6em,6em)] mt-[clamp(6.5rem,6em,6em)] mb-[clamp(0.75rem,2.5em,2.5em)] overflow-hidden rounded-[2em] bg-[#F8F7F6]">
        <HomeHero foldShow={foldShow} />
      </div>

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1440px] pb-20 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:pb-24 sm:pl-8 sm:pr-8 lg:pl-[54px] lg:pr-[65px]">
        <div ref={recReveal.ref} className="mx-auto mt-4 max-w-[826px] min-w-0 md:mt-8 lg:mt-12">
          <FadeSlideSegment show={recShowDelayed} index={0} className="w-full min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-6 md:justify-between md:gap-4">
              {RECOGNITION.map((item, i) => (
                <a
                  key={`recognition-${i + 1}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group transition-opacity"
                >
                  <img
                    src={item.src}
                    alt=""
                    className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[18px] sm:h-[24px] md:h-[30px]"} max-h-8 w-auto max-w-[min(100%,120px)] object-contain opacity-40 transition-opacity group-hover:opacity-65 sm:max-w-[140px] md:max-w-none`}
                  />
                </a>
              ))}
            </div>
          </FadeSlideSegment>
        </div>
        <div ref={missionReveal.ref} className="mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <FadeSlideSegment show={missionReveal.show} index={0} className="mx-auto max-w-[880px] text-center">
            <p className="font-manrope text-[clamp(0.85rem,2.35vw,1.75rem)] font-light leading-snug text-black">
              I design AI systems where{" "}
              <span
                className="font-playfair-variable text-[clamp(1rem,3vw,2rem)] italic leading-[1.15]"
                style={{
                  fontVariationSettings: "'opsz' 5",
                }}
              >
                humans
              </span>{" "}
              and autonomous{" "}
              <span
                className="font-playfair-variable text-[clamp(1rem,3vw,2rem)]  italic leading-[1.15]"
                style={{
                  fontVariationSettings: "'opsz' 5",
                }}
              >
                agents
              </span>{" "}
              collaborate, delegate, build trust, and accomplish more together.
            </p>
          </FadeSlideSegment>
        </div>

        {/* Work — layout from Figma 964:70 project cards; copy unchanged */}
        <section id="work" className="mt-20 flex min-w-0 flex-col gap-10 sm:mt-24 sm:gap-14 md:mt-28 lg:mt-32 lg:gap-[60px]">
        <WorkProjectCard
            anchorId="asana-ai-teammates"
            tag="AI for Collaboration"
            title="Asana AI Teammates"
            meta="2026 | Product design"
            description="Designing multi-agent collaboration for the future of work, from discovery and proactive suggestions to enterprise AI governance."
            imageSrc="/ait-motion.gif"
            imageAlt="Asana AI Teammates"
            imageSide="left"
          />

        <WorkProjectCard
            anchorId="asana-project-settings"
            tag="SaaS CWM"
            title="Asana project settings"
            meta="2024 | UX design"
            description="Led the proposal to revamp Asana’s project settings hub, driving cross-surface exploration and aligning stakeholders across teams to establish a unified strategic direction."
            imageSrc="/asana-cover.png"
            imageAlt="Asana project settings"
            imageSide="left"
            //imageHref="/asana"
          />

        <WorkProjectCard
            tag="AI for Health"
            title="Airy scoliosis brace"
            meta="2022 | UX design, strategy"
            description="Led the end-to-end design of an integrated physical and digital solution for scoliosis care, driving user engagement and improving brace compliance among patients."
            imageSrc="/airy-cover.png"
            imageAlt="Airy scoliosis brace"
            imageSide="left"
            //imageHref="/airy"
          />

          {!showMoreProjects ? (
            <button
              type="button"
              onClick={() => setShowMoreProjects(true)}
              className="self-start font-manrope text-base font-regular text-black/50 transition-colors hover:text-black/90 md:text-lg"
            >
              ↳ View more
            </button>
          ) : null}

          {showMoreProjects ? (
            <>
          <WorkProjectCard
            tag="AI for Accessibility"
            title="Enlight"
            meta="2024 | UX design"
            description='How AI can support visually impaired individuals in a new way to "see" webpages.'
            imageSrc="/enlight-cover.png"
            imageAlt="Enlight"
            imageSide="left"
            //imageHref= "/enlight" // to do in the future
          />

          <WorkProjectCard
            tag="AI for Relationships"
            title="Amimi"
            meta="2025 | Vibe coding, UX design"
            description="Introducing AI therapist to support healthy communication"
            imageSrc="/amimi-cover.png"
            imageAlt="Amimi"
            imageSide="left"
            //imageHref= "/amimi" // to do in the future
          >
            <a
              href="https://www.amimi.ai/"
              className="mt-2 font-manrope text-base font-bold text-black/50 transition-colors hover:text-black/90 md:text-lg"
            >
              Try it in Testflight
            </a>
          </WorkProjectCard>

          <WorkProjectCard
            tag="Home fitness"
            title="Google Nest Fit"
            meta="2022 | UX design"
            description="Designed an engaging home fitness experience, creating a product concept that motivates and sustains user participation in at-home workouts."
            imageSrc="/nestfit-cover.jpg"
            imageAlt="Google Nest Fit"
            imageSide="left"
          />

          <button
            type="button"
            onClick={() => setShowMoreProjects(false)}
            className="self-start font-manrope text-base font-bold text-black/50 transition-colors hover:text-black/90 md:text-lg"
          >
            Hide 
          </button>
            </>
          ) : null}
        </section>

        {/* Speaking at + speech gallery — one scroll reveal */}
        <div id="speaking" ref={speakReveal.ref} className="scroll-mt-28">
          <section
            className="mt-14 flex flex-wrap items-center gap-4 pt-8 sm:mt-20 sm:gap-6 sm:pt-12 md:mt-24"
          >
            <FadeSlideSegment show={speakReveal.show} index={0} className="shrink-0">
              <p className="font-manrope text-base font-medium text-[#000000] sm:text-lg md:text-xl" style={{ color: TEXT.muted }}>
                Speaking at
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={speakReveal.show} index={1} className="flex min-w-0 flex-wrap items-center gap-4 sm:gap-6">
              {SPEAKING_LOGOS.map((item, i) => (
                <img
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[18px] sm:h-[24px] md:h-[30px]"} max-w-full w-auto object-contain`}
                />
              ))}
            </FadeSlideSegment>
          </section>

          <FadeSlideSegment show={speakReveal.show} index={2} className="mt-8 sm:mt-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-5">
              {SPEECH_IMAGES.map((i) => (
                <img
                  key={i}
                  src={`/speech${i}.jpeg`}
                  alt={`Speech${i}`}
                  className="aspect-[221/180] w-full rounded-[.5em] object-cover"
                />
              ))}
            </div>
          </FadeSlideSegment>
        </div>

        <footer
          ref={footReveal.ref}
          className="mt-10 pt-8 sm:mt-16 sm:pt-12 md:mt-20"
        >
          <div className="flex flex-col items-center text-center">
            <FadeSlideSegment show={footReveal.show} index={0}>
              <p className="max-w-xl font-manrope text-sm leading-relaxed text-gray-500 sm:text-base md:text-lg">
                Interested in building the future of Human-AI Collaboration together?
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={footReveal.show} index={1} className="mt-6 sm:mt-8">
              <a
                href="mailto:sangyuxi@gmail.com"
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 font-manrope text-sm font-medium text-white transition-opacity hover:opacity-80 sm:px-10 sm:py-3.5 sm:text-base"
              >
                Let&apos;s connect!
              </a>
            </FadeSlideSegment>
            <FadeSlideSegment show={footReveal.show} index={2} className="mt-24 sm:mt-32 md:mt-40">
              <p className="font-manrope text-xs text-gray-400">
                Copyright &copy; 2026 sangyu.com All rights reserved.
              </p>
            </FadeSlideSegment>
          </div>
        </footer>
      </div>
    </main>
  );
}
