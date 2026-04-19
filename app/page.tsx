"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

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
  children,
}: {
  tag: string;
  title: string;
  meta: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
  children?: ReactNode;
}) {
  const { ref, show } = useRevealOnScroll<HTMLElement>();

  const pill = (
    <div className="inline-flex shrink-0 items-center justify-center self-start rounded-full bg-[#f5f4f1] px-4 py-3">
      <span className="whitespace-nowrap font-manrope text-base font-medium capitalize text-black">{tag}</span>
    </div>
  );

  const titleBlock = (
    <h3 className="font-playfair text-[clamp(32px,7vw,48px)] font-medium leading-[1.2] text-black lg:text-[48px] lg:leading-[60px]">
      {title}
    </h3>
  );

  const imageColumn = (
    <div className="group relative mx-auto aspect-square w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl sm:max-w-[320px] md:max-w-[400px] lg:mx-0 lg:max-w-[min(623px,72vh)] lg:rounded-[48px]">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-full w-full object-cover opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-70"
      />
    </div>
  );

  const textStart = imageSide === "left" ? 1 : 0;
  let ti = textStart;
  const textStack = (
    <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-[691px] lg:min-h-[623px]">
      <div className="flex flex-col gap-4">
        <FadeSlideSegment show={show} index={ti++} className="w-fit max-w-full">
          {pill}
        </FadeSlideSegment>
        <FadeSlideSegment show={show} index={ti++} className="w-full">
          {titleBlock}
        </FadeSlideSegment>
      </div>
      <div className="flex flex-col gap-4 lg:mt-auto">
        <FadeSlideSegment show={show} index={ti++} className="w-full">
          <div className="h-px w-full bg-[#CCCCCC]" aria-hidden />
        </FadeSlideSegment>
        <FadeSlideSegment show={show} index={ti++} className="w-full">
          <p className="font-manrope text-[clamp(14px,2.8vw,18px)] font-semibold capitalize leading-snug text-black lg:text-lg lg:leading-relaxed">
            {meta}
          </p>
        </FadeSlideSegment>
        <FadeSlideSegment show={show} index={ti++} className="w-full">
          <div className="h-px w-full bg-[#CCCCCC]" aria-hidden />
        </FadeSlideSegment>
        <FadeSlideSegment show={show} index={ti++} className="w-full">
          <p className="font-manrope text-[clamp(14px,2.8vw,18px)] font-normal leading-relaxed text-black/50 lg:text-base">
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
      ref={ref}
      className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-[59px]"
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
          {textStack}
          <FadeSlideSegment
            show={show}
            index={imageIndexRight}
            className="w-full shrink-0 lg:ml-auto lg:w-fit"
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
  const speakReveal = useRevealOnScroll<HTMLDivElement>();
  const footReveal = useRevealOnScroll<HTMLElement>();
  const [recShowDelayed, setRecShowDelayed] = useState(false);

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

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">

      <header
        className={`fixed top-0 left-0 right-0 z-30 flex items-start justify-between px-5 pb-5 pt-[39px] transition-[background-color,backdrop-filter,border-color] duration-300 sm:px-8 lg:pl-[54px] lg:pr-[65px] ${
          headerScrolled
            ? "border-b border-black/[0.06] bg-white/75 backdrop-blur-md backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <FadeSlideSegment show={foldShow} index={0} className="flex items-center gap-2">
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
        <nav className="mt-[5px] flex items-center gap-10 capitalize sm:gap-[60px]">
          <FadeSlideSegment show={foldShow} index={1} className="inline-flex">
            <Link
              href="/#work"
              className="font-manrope text-[18px] font-normal text-black transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              Work
            </Link>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={2} className="inline-flex">
            <Link
              href="/about"
              className="font-manrope text-[18px] font-normal text-black transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              About
            </Link>
          </FadeSlideSegment>
        </nav>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-24 sm:px-8 lg:pl-[54px] lg:pr-[65px]">
        {/* Top hero — matches Figma node 964:70 (spacing from 1440 artboard) */}
        <section className="relative pt-[200px] sm:pt-[248px] md:pt-[272px]">
          <FadeSlideSegment show={foldShow} index={3} className="max-w-[768px]">
            <h2 className="font-playfair text-[clamp(36px,5.5vw,80px)] font-medium leading-[1.05] tracking-tight text-black">
              Design for <span className="font-playfair italic">humanity </span>
              to thrive with AI
            </h2>
          </FadeSlideSegment>

          <div className="mt-[18px] max-w-[992px] font-manrope text-[18px] font-normal leading-normal text-black sm:text-[20px] md:mt-[25px] lg:mt-[35px]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8">
              <FadeSlideSegment show={foldShow} index={4} className="min-w-0">
                <p>
                  Hello, I&apos;m Sangyu, a product designer currently designing AI Teammates at{" "}
                  <a
                    href="https://asana.com/product/ai/ai-teammates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-black hover:opacity-70"
                  >
                    Asana
                  </a>
                  , building the future of multi-agent collaboration.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={5} className="min-w-0">
                <p>
                  Graduated from{" "}
                  <a
                    href="https://mde.harvard.edu/sangyu-xi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-black hover:opacity-70"
                  >
                    Harvard{" "}
                  </a>
                  Design Engineering, my passion lies at the intersection of design, business and technology. This passion
                  drives my work on helping humanity thrives with AI-powered products.
                </p>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        {/* Press / awards logos — Figma 964:79 (no sidebar label) */}
        <div ref={recReveal.ref} className="mx-auto mt-36 max-w-[826px] md:mt-48 lg:mt-[200px]">
          <FadeSlideSegment show={recShowDelayed} index={0} className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-6 md:justify-between md:gap-4">
              {RECOGNITION.map((item, i) => (
                <a
                  key={`recognition-${i + 1}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                >
                  <img
                    src={item.src}
                    alt=""
                    className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[20px] sm:h-[24px] md:h-[30px]"} w-auto max-w-[120px] object-contain md:max-w-none`}
                  />
                </a>
              ))}
            </div>
          </FadeSlideSegment>
        </div>

        {/* Work — layout from Figma 964:70 project cards; copy unchanged */}
        <section id="work" className="mt-14 flex flex-col gap-14 md:mt-16 lg:gap-[60px]">
          <WorkProjectCard
            tag="SaaS product"
            title="Asana project settings"
            meta="2024 | UX design"
            description="Led the proposal to revamp Asana’s project settings hub, driving cross-surface exploration and aligning stakeholders across teams to establish a unified strategic direction."
            imageSrc="/asana-cover.png"
            imageAlt="Asana project settings"
            imageSide="left"
          />

          <WorkProjectCard
            tag="Digital health"
            title="Airy scoliosis monitor"
            meta="2022 | UX design, strategy"
            description="Led the end-to-end design of an integrated physical and digital solution for scoliosis care, driving user engagement and improving brace compliance among patients."
            imageSrc="/airy-cover.png"
            imageAlt="Airy scoliosis monitor"
            imageSide="right"
          />

          <WorkProjectCard
            tag="Chrome Plug-in"
            title="Enlight"
            meta="2024 | UX design"
            description='Led the design of an AI-powered accessibility tool, exploring how AI can proactively support users with visual impairments to "see" webpages.'
            imageSrc="/enlight-cover.png"
            imageAlt="Enlight"
            imageSide="left"
          />

          <WorkProjectCard
            tag="Home fitness"
            title="Google Nest Fit"
            meta="2022 | UX design"
            description="Designed an engaging home fitness experience, creating a product concept that motivates and sustains user participation in at-home workouts."
            imageSrc="/nestfit-cover.jpg"
            imageAlt="Google Nest Fit"
            imageSide="right"
          />

          <WorkProjectCard
            tag="Therapy app"
            title="Amimi"
            meta="2025 | Vibe coding, UX design"
            description="Pioneered the concept of an AI-mediated group chat for couples, introducing AI therapist to support healthier communication, and built the front-end experience through Vibe Coding."
            imageSrc="/amimi-cover.png"
            imageAlt="Amimi"
            imageSide="left"
          >
            <a
              href="https://www.amimi.ai/"
              className="mt-2 font-manrope text-base font-bold text-black/50 transition-colors hover:text-black/90 md:text-lg"
            >
              Download app
            </a>
          </WorkProjectCard>
        </section>

        {/* Speaking at + speech gallery — one scroll reveal */}
        <div ref={speakReveal.ref}>
          <section
            id="featured"
            className="mt-20 flex flex-col gap-8 pt-12 md:mt-24 md:flex-row md:items-center md:justify-between"
          >
            <FadeSlideSegment show={speakReveal.show} index={0} className="w-full md:w-auto">
              <p className="font-manrope text-lg font-medium text-[#000000] md:text-xl" style={{ color: TEXT.muted }}>
                Speaking at
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={speakReveal.show} index={1} className="flex flex-wrap items-center gap-6">
              {SPEAKING_LOGOS.map((item, i) => (
                <img
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[20px] sm:h-[24px] md:h-[30px]"} w-auto object-contain`}
                />
              ))}
            </FadeSlideSegment>
          </section>

          <div className="mt-10 flex flex-wrap gap-4 md:gap-6">
            {SPEECH_IMAGES.map((i) => (
              <FadeSlideSegment
                key={i}
                show={speakReveal.show}
                index={2 + i}
                className="min-w-0 flex-1"
              >
                <img
                  src={`/speech${i}.jpeg`}
                  alt={`Speech${i}`}
                  className="h-[180px] w-full min-w-[180px] flex-1 rounded-sm object-cover sm:max-w-[221px]"
                />
              </FadeSlideSegment>
            ))}
          </div>
        </div>

        <footer
          ref={footReveal.ref}
          className="mt-12 sm:mt-16 md:mt-20 border-t border-gray-300 pt-8 sm:pt-12"
        >
            <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
              <FadeSlideSegment show={footReveal.show} index={0} className="space-y-2">
                <h4 className="font-playfair text-[20px] font-bold uppercase leading-none text-black sm:text-[24px]">Sangyu Xi</h4>
                <p className="font-manrope text-xs text-gray-600 sm:text-sm">
                  Are you an engineer or an entrepreneur?<br />
                  I always welcome new opportunities to exchange ideas and to explore collaborations.<br />
                </p>
                <a href="mailto:sangyuxi@gmail.com">
                  <p className="font-manrope text-xs text-[#FF4500] sm:text-sm">Let&apos;s connect!</p>
                </a>
              </FadeSlideSegment>
              <FadeSlideSegment show={footReveal.show} index={1} className="space-y-2">
                <h4 className="font-manrope text-sm font-bold text-[#000000] sm:text-base">Email</h4>
                <p className="font-manrope text-xs text-[#FF4500] sm:text-sm">sangyuxi@gmail.com</p>
                <h4 className="mt-4 font-manrope text-sm font-bold text-[#000000] sm:text-base">Phone</h4>
                <p className="font-manrope text-xs text-gray-600 sm:text-sm">5136380161</p>
              </FadeSlideSegment>
            </div>
            <FadeSlideSegment show={footReveal.show} index={3} className="mt-6 sm:mt-8">
              <p className="font-manrope text-xs text-gray-500">
                Copyright &copy; 2026 sangyuxi.com. All rights reserved.
              </p>
            </FadeSlideSegment>
          </footer>
      </div>
    </main>
  );
}
