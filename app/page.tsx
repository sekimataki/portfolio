"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function HomeHero({ foldShow }: { foldShow: boolean }) {
  return (
    <section className="relative z-10 max-w-[1200px] pl-[clamp(1rem,5vw,3.5rem)] pr-[clamp(1rem,4vw,3.5rem)] sm:pl-[clamp(1.5rem,5vw,3.5rem)] sm:pr-[clamp(1.5rem,5vw,3.5rem)]">
      <FadeSlideSegment show={foldShow} index={3}>
        <h2 className="font-bangla-mn text-[clamp(1.5rem,4vw,3.5rem)] font-thin leading-[1.08] tracking-loose text-pretty text-black sm:text-[clamp(1.5rem,4vw,3.5rem)] sm:leading-[1.5]">
          Designing human*AI collaboration for the future of work
        </h2>
      </FadeSlideSegment>

      <div className="mt-[18px] max-w-[1200px] min-w-0 pl-0 md:mt-[25px] lg:mt-[35px]">
          <div className="flex flex-col gap-2 sm:gap-2">
            <FadeSlideSegment show={foldShow} index={4} className="min-w-0">
              <p className="font-manrope text-base font-medium text-pretty text-black sm:text-[20px]">
              Product designer at {" "}
                <a
                  href="https://asana.com/product/ai/ai-teammates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black transition-opacity hover:opacity-70"
                >
                  Asana AI Teammates
                </a>
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={foldShow} index={5} className="min-w-0">
              <p className="font-manrope text-base font-medium text-pretty text-black sm:text-[20px]">
                Harvard{" "}
                <a
                  href="https://mde.harvard.edu/sangyu-xi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black transition-opacity hover:opacity-70"
                >
                  Design Engineering
                </a>
              </p>
            </FadeSlideSegment>
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
  title,
  description,
  imageSrc,
  imageAlt,
  imageSide,
  imageHref,
  anchorId,
  children,
}: {
  title: string;
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

  const titleBlock = imageHref ? (
    <Link
      href={imageHref}
      className="block text-inherit no-underline outline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/25"
      aria-label={`${title} — open case study`}
    >
      <h3 className="font-bangla-mn text-[clamp(0.75rem,2.5vw,1.25rem)] font-semibold text-pretty text-black sm:text-[clamp(0.75rem,2.5vw,1.25rem)] lg:text-[22px] lg:leading-[28px]">
        {title}
      </h3>
    </Link>
  ) : (
    <h3 className="font-bangla-mn text-[clamp(0.75rem,2.5vw,1.25rem)] font-medium text-pretty text-black sm:text-[clamp(0.75rem,2.5vw,1.25rem)] lg:text-[22px] lg:leading-[28px]">
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
    <div className="group relative mx-auto aspect-[4/3] w-full max-w-[min(100%,561px)] shrink-0 overflow-hidden sm:max-w-[660px] md:max-w-[858px] lg:mx-0 lg:max-w-[min(1188px,90.75vw)]">
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
    <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-[691px] lg:pt-8">
      <FadeSlideSegment show={show} index={ti++} className="w-full">
        {titleBlock}
      </FadeSlideSegment>
      <FadeSlideSegment show={show} index={ti++} className="w-full">
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
  );

  const imageIndexRight = ti;

  return (
    <article
      id={anchorId}
      ref={ref}
      className="flex w-full min-w-0 scroll-mt-28 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8"
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
        className="fixed top-0 left-0 right-0 z-30 flex min-w-0 items-start justify-between gap-3 bg-transparent pb-4 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[calc(39px+env(safe-area-inset-top,0px))] mix-blend-difference sm:gap-4 sm:pb-5 sm:pl-8 sm:pr-8 lg:pl-[56px] lg:pr-[65px]"
      >
        <FadeSlideSegment show={foldShow} index={0} className="flex min-w-0 items-center gap-2">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <h1 className="font-bangla-mn text-[20px] font-medium uppercase text-white sm:text-[24px]">
              Sangyu Xi
            </h1>
          </Link>
        </FadeSlideSegment>
        <nav className="mt-[5px] flex shrink-0 items-center gap-5 capitalize sm:gap-8 md:gap-10 lg:gap-[60px]">
          <FadeSlideSegment show={foldShow} index={1} className="inline-flex">
            <HomeNavLink
              href="/#asana-project-settings"
              className="font-manrope text-base font-medium text-white transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              Work
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={2} className="inline-flex">
            <HomeNavLink
              href="/#featured-on"
              className="font-manrope text-base font-medium text-white transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              Featured
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={3} className="inline-flex">
            <Link
              href="/about"
              className="font-manrope text-base font-medium text-white transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              About
            </Link>
          </FadeSlideSegment>
        </nav>
      </header>

      <div className="relative z-10 ml-[max(1.25rem,env(safe-area-inset-left))] mr-[max(1.25rem,env(safe-area-inset-right))] mt-[clamp(12rem,16vw,16em)] mb-[clamp(0.75rem,2.5em,2.5em)] sm:ml-8 sm:mr-8 lg:ml-[56px] lg:mr-[65px]">
        <HomeHero foldShow={foldShow} />
      </div>

      <div className="relative z-10 w-full min-w-0 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 lg:pl-[56px] lg:pr-[65px]">
        {/* Work — layout from Figma 964:70 project cards; copy unchanged */}
        <section id="work" className="mt-20 flex min-w-0 flex-col gap-10 sm:mt-24 sm:gap-14 md:mt-28 lg:mt-32 lg:gap-[60px]">
        <WorkProjectCard
            anchorId="asana-ai-teammates"
            title="Asana AI Teammates"
            description= "Multi-agent collaboration"
            imageSrc="/ait-motion.gif"
            imageAlt="Asana AI Teammates"
            imageSide="left"
          />

        <WorkProjectCard
            anchorId="asana-project-settings"
            title="Asana project settings"
            description="Revamp Asana’s project settings hub"
            imageSrc="/asana-cover.png"
            imageAlt="Asana project settings"
            imageSide="left"
            //imageHref="/asana"
          />

        <WorkProjectCard
            title="Airy scoliosis brace"
            description="Integrated physical and digital solution for scoliosis"
            imageSrc="/airy-cover.png"
            imageAlt="Airy scoliosis brace"
            imageSide="left"
            //imageHref="/airy"
          />
          
          <WorkProjectCard
            title="Enlight"
            description='AI-powered accessibility tool that enables the visually impaired to "see" webpages'
            imageSrc="/enlight-cover.png"
            imageAlt="Enlight"
            imageSide="left"
            //imageHref= "/enlight" // to do in the future
          />

            {/*<WorkProjectCard
            title="Amimi"
            description="AI relationship coach built from 0 to 1"
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
          </WorkProjectCard>*/}

          <WorkProjectCard
            title="Google Nest Fit"
            description="Home fitness experience reimagined"
            imageSrc="/nestfit-cover.jpg"
            imageAlt="Google Nest Fit"
            imageSide="left"
          />

        </section>

        {/* Speaking at + speech gallery — one scroll reveal */}
        <div id="featured-on" ref={speakReveal.ref} className="scroll-mt-28 mb-32">
          <section
            ref={recReveal.ref}
            className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4 pt-8 sm:mt-20 sm:gap-x-8 sm:pt-12 md:mt-24 lg:flex-nowrap lg:justify-between"
          >
            <FadeSlideSegment show={speakReveal.show} index={0} className="shrink-0">
              <p className="font-manrope text-base font-medium text-[#000000] sm:text-lg md:text-xl">
                Featured on
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment
              show={recShowDelayed}
              index={0}
              className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-x-10 md:flex-nowrap md:justify-left md:gap-x-6 lg:gap-x-8"
            >
              {RECOGNITION.map((item, i) => (
                <a
                  key={`recognition-${i + 1}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group shrink-0 transition-opacity"
                >
                  <img
                    src={item.src}
                    alt=""
                    className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[18px] sm:h-[24px] md:h-[30px]"} max-h-8 w-auto max-w-[min(100%,120px)] object-contain opacity-100 transition-opacity group-hover:opacity-40 sm:max-w-[140px] md:max-w-none`}
                  />
                </a>
              ))}
            </FadeSlideSegment>
          </section>

          <FadeSlideSegment show={speakReveal.show} index={2} className="mt-8 sm:mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {SPEECH_IMAGES.map((i) => (
                <div key={i} className="group overflow-hidden">
                  <img
                    src={`/speech${i}.jpeg`}
                    alt={`Speech${i}`}
                    className="aspect-[221/180] w-full object-cover grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </FadeSlideSegment>
        </div>
      </div>

      <footer
        ref={footReveal.ref}
        className="relative z-10 w-full bg-black pb-[80px] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-16 sm:pl-8 sm:pr-8 sm:pt-[107px] lg:pl-[74px] lg:pr-[min(427px,28vw)]"
      >
        <div className="flex flex-col items-start text-left">
          <FadeSlideSegment show={footReveal.show} index={0}>
            <p className="font-bangla-mn text-xl leading-normal text-white sm:text-[24px]">
              Interested in building together?
            </p>
          </FadeSlideSegment>
          <FadeSlideSegment show={footReveal.show} index={1} className="mt-10 sm:mt-[12px]">
            <a
              href="mailto:sangyuxi@gmail.com"
              className="font-bangla-mn text-xl text-white transition-opacity hover:opacity-80 sm:text-[24px]"
            >
              ↳ Let&apos;s connect 
            </a>
          </FadeSlideSegment>
          <FadeSlideSegment show={footReveal.show} index={2} className="mt-16 sm:mt-[84px]">
            <div className="flex items-center">
              <p className="font-manrope text-base text-white">
                Copyright &copy; 2026 sangyuxi.com. All rights reserved.
              </p>
            </div>
          </FadeSlideSegment>
        </div>
      </footer>
    </main>
  );
}
