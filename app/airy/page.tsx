"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeNavLink } from "@/components/HomeNavLink";

/** Same motion tokens as `app/page.tsx` */
const MOTION_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const STAGGER_MS = 110;
const REVEAL_DURATION_MS = 640;

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FadeSlideSegment({
  show,
  index,
  className,
  slideFrom = "bottom",
  children,
}: {
  show: boolean;
  index: number;
  className?: string;
  slideFrom?: "bottom" | "top";
  children: ReactNode;
}) {
  const [noMotion, setNoMotion] = useState(false);
  useLayoutEffect(() => {
    setNoMotion(readPrefersReducedMotion());
  }, []);

  const hiddenOffset = slideFrom === "top" ? "-28px" : "28px";

  if (noMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translate3d(0,0,0)" : `translate3d(0,${hiddenOffset},0)`,
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

type UsersPersonaTab = "early" | "active" | "post";

const USERS_PERSONA_TABS: {
  id: UsersPersonaTab;
  label: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}[] = [
  {
    id: "early",
    label: "Early in treatment",
    src: "/airy-project20.png",
    width: 7680,
    height: 4320,
    alt: "Persona distilled from interviews: patient early in scoliosis bracing journey",
  },
  {
    id: "active",
    label: "Active bracing",
    src: "/airy-project19.gif",
    width: 7680,
    height: 4320,
    alt: "Persona distilled from interviews: patient in active daily bracing",
  },
  {
    id: "post",
    label: "Transitioning off brace",
    src: "/airy-project18.jpg",
    width: 8328,
    height: 4320,
    alt: "Persona distilled from interviews: patient transitioning post-brace",
  },
];

function HowILandedUsersTabs() {
  const [active, setActive] = useState<UsersPersonaTab>("early");

  const current = USERS_PERSONA_TABS.find((t) => t.id === active) ?? USERS_PERSONA_TABS[0];

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        className="flex flex-wrap justify-start gap-2 sm:gap-3"
        role="tablist"
        aria-label="Treatment stages from interviews"
      >
        {USERS_PERSONA_TABS.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className={`rounded-full px-4 py-2.5 font-manrope text-sm font-medium transition-colors sm:px-5 sm:text-[15px] ${
                selected
                  ? "bg-[#e11d48] text-white shadow-sm"
                  : "bg-[#e8e8e8] text-neutral-800 hover:bg-[#dedede]"
              }`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        className="mt-6 w-full sm:mt-8"
        aria-label={`${current.label} — persona research`}
      >
        <div className="overflow-hidden rounded-2xl">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            unoptimized={current.src.endsWith(".gif")}
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

type CompetitorTab = "c1" | "c2" | "c3";

const COMPETITOR_TABS: {
  id: CompetitorTab;
  label: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}[] = [
  {
    id: "c1",
    label: "Competitor 1",
    src: "/airy-project17.png",
    width: 7680,
    height: 4320,
    alt: "Competitor app 1: UX analysis for scoliosis management and brace tracking",
  },
  {
    id: "c2",
    label: "Competitor 2",
    src: "/airy-project16.png",
    width: 7680,
    height: 4320,
    alt: "Competitor app 2: UX analysis for scoliosis management and brace tracking",
  },
  {
    id: "c3",
    label: "Competitor 3",
    src: "/airy-project15.png",
    width: 7680,
    height: 4320,
    alt: "Competitor app 3: UX analysis for scoliosis management and brace tracking",
  },
];

function CompetitorOverviewTabs() {
  const [active, setActive] = useState<CompetitorTab>("c1");

  const current = COMPETITOR_TABS.find((t) => t.id === active) ?? COMPETITOR_TABS[0];

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        className="flex flex-wrap justify-start gap-2 sm:gap-3"
        role="tablist"
        aria-label="Competitor products"
      >
        {COMPETITOR_TABS.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className={`rounded-full px-4 py-2.5 font-manrope text-sm font-medium transition-colors sm:px-5 sm:text-[15px] ${
                selected
                  ? "bg-[#e11d48] text-white shadow-sm"
                  : "bg-[#e8e8e8] text-neutral-800 hover:bg-[#dedede]"
              }`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        className="mt-6 w-full sm:mt-8"
        aria-label={`${current.label} — competitor analysis`}
      >
        <div className="overflow-hidden rounded-2xl">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            unoptimized={current.src.endsWith(".gif")}
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function AiryCaseStudyPage() {
  const foldShow = useRevealOnMount();
  const { ref: footRevealRef, show: footRevealShow } = useRevealOnScroll<HTMLElement>();
  const { ref: s1Ref, show: s1Show } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sUsersRef, show: sUsersShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sCompRef, show: sCompShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sHubs2Ref, show: sHubs2Show } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sIARef, show: sIAShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sModalDirectionsRef, show: sModalDirectionsShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sUsabilityRef, show: sUsabilityShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sInsight1Ref, show: sInsight1Show } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sInsight2Ref, show: sInsight2Show } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sTakeawaysRef, show: sTakeawaysShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: s2Ref, show: s2Show } = useRevealOnScroll<HTMLDivElement>();
  const { ref: s3Ref, show: s3Show } = useRevealOnScroll<HTMLDivElement>();
  const { ref: spRef, show: spShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sgRef, show: sgShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sGoalsRef, show: sGoalsShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sfRef, show: sfShow } = useRevealOnScroll<HTMLDivElement>();
  const { ref: sPsetRef, show: sPsetShow } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <header
        className="fixed top-0 left-0 right-0 z-30 flex min-w-0 items-start justify-between gap-3 bg-white pb-4 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[calc(39px+env(safe-area-inset-top,0px))] sm:gap-4 sm:pb-5 sm:pl-8 sm:pr-8 lg:bg-transparent lg:mix-blend-difference lg:pl-[56px] lg:pr-[65px]"
      >
        <FadeSlideSegment show={foldShow} index={0} slideFrom="top" className="flex min-w-0 items-center gap-2">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <h1 className="font-bangla-mn text-[20px] font-medium uppercase text-black sm:text-[24px] lg:text-white">
              Sangyu Xi
            </h1>
          </Link>
        </FadeSlideSegment>
        <nav className="mt-[5px] flex shrink-0 items-center gap-5 capitalize sm:gap-8 md:gap-10 lg:gap-[60px]">
          <FadeSlideSegment show={foldShow} index={1} slideFrom="top" className="hidden lg:inline-flex">
            <HomeNavLink
              href="/#ai-teammates"
              className="font-manrope text-base font-medium text-black transition-opacity hover:opacity-70 sm:text-[20px] lg:text-white"
            >
              Work
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={2} slideFrom="top" className="inline-flex">
            <HomeNavLink
              href="/#featured-on"
              className="font-manrope text-base font-medium text-black transition-opacity hover:opacity-70 sm:text-[20px] lg:text-white"
            >
              Featured
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={3} slideFrom="top" className="inline-flex">
            <Link
              href="/about"
              className="font-manrope text-base font-medium text-black transition-opacity hover:opacity-70 sm:text-[20px] lg:text-white"
            >
              About
            </Link>
          </FadeSlideSegment>
        </nav>
      </header>


      <main className="relative z-10 mx-auto w-full min-w-0 max-w-[1440px] pb-24 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:pb-32 sm:pl-8 sm:pr-8 md:pb-40 lg:pl-[54px] lg:pr-[65px]">
        <div className="pt-[calc(6.5rem+env(safe-area-inset-top,0px))] pb-20 sm:pt-28 md:pt-32 md:pb-24">
          <FadeSlideSegment show={foldShow} index={0} className="mb-6 w-full text-left sm:mb-8">
            <div className="w-full max-w-[820px]">
              <FadeSlideSegment show={foldShow} index={2} className="w-full min-w-0 text-left">
                <h1 className="font-bangla-mn text-[32px] font-regular leading-[1.15] text-pretty text-black">
                  Airy
                </h1>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={3} className="mt-4 w-full text-left">
                <p className="font-manrope text-[clamp(1.25rem,3vw,1.75rem)] font-medium leading-snug text-black sm:text-2xl">
                  Manage scoliosis health
                </p>
                <p className="mt-4 font-manrope text-lg font-normal leading-snug text-black/80 sm:text-xl">
                  A companion app for brace wear time, progress, and rehabilitation—aligned with how patients, parents, and
                  clinicians actually coordinate care.
                </p>
              </FadeSlideSegment>
            </div>
          </FadeSlideSegment>

          <div className="relative w-full overflow-hidden rounded-lg sm:rounded-[16px] lg:rounded-[24px]">
            <div className="relative aspect-[16/10] w-full max-h-[min(85vh,720px)]">
              <Image
                src="/airy-project12.png"
                alt="Airy app — manage scoliosis health, case study hero"
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
              />
            </div>
          </div>

          <section
            ref={sgRef}
            className="mt-8 w-full min-w-0 sm:mt-10 md:mt-12"
            aria-label="Project context, role, and methodologies"
          >
            <div className="grid w-full min-w-0 grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 md:gap-x-10 lg:gap-x-14 xl:gap-x-20 [&>*]:min-w-0">
              <FadeSlideSegment show={sgShow} index={0} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Project Context</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>2022 Academic Capstone</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sgShow} index={1} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">My Role</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>Sole UX Designer</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sgShow} index={2} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Methodologies</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>User interview</p>
                  <p>Wireframes</p>
                  <p>Prototype</p>
                  <p>Animation</p>
                  <p>Usability research</p>
                </div>
              </FadeSlideSegment>
            </div>
          </section>

          <section
            ref={s1Ref}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-context-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={s1Show} index={0} className="md:pt-1">
                <h2
                  id="airy-context-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  The context
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={s1Show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    Scoliosis is a lateral curvature of the spine affecting about 7 million people in the US today. About
                    80% of patients are female. If left untreated, it can lead to back pain and potentially require surgery.
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s1Show} index={2} className="w-full">
                  <p className="font-manrope text-sm font-semibold text-black sm:text-base">The standard treatment involves:</p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    <li>
                      Wearing a rigid brace for an average of 18 hours per day to help slow the progression of curvature.
                    </li>
                    <li>Wearing a monitor to track brace-wearing time and ensure compliance.</li>
                    <li>
                      Rehabilitation exercise after taking off the brace to prevent muscle from weakening.
                    </li>
                  </ol>
                  <p className="mt-4 font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    This design project aims to support effective scoliosis treatment and management.
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s1Show} index={4} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/airy-project24.png"
                      alt="Airy app context: scoliosis care, bracing, and monitoring overview"
                      width={7680}
                      height={2436}
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={s2Ref}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-secondary-research-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={s2Show} index={0} className="md:pt-1">
                <h2
                  id="airy-secondary-research-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Secondary research
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={s2Show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    &ldquo;Only 10% of guardian knows their child&apos;s actual brace wearing time.&rdquo;
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s2Show} index={2} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/airy-project23.gif"
                      alt="Airy app context: scoliosis care, bracing, and monitoring overview"
                      width={7680}
                      height={2436}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={s3Ref}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-persona"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={s3Show} index={0} className="md:pt-1">
                <h2
                  id="airy-persona"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Persona
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={s3Show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    I contacted 6 scoliosis patients online who had worn brace and now in 3 different stages of
                    treatment from scoliosis support group. Then I distilled their complaints for scoliosis
                    management service into 1 persona shown below.
                  </p>
                </FadeSlideSegment>
                <Image src="/airy-project17.png" alt="Airy user persona: scoliosis patient" width={7680} height={2436} unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px" className="h-auto w-full object-contain" />
              </div>
            </div>
          </section>

          <section
            ref={sCompRef}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-competitor-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={sCompShow} index={0} className="md:pt-1">
                <h2
                  id="airy-competitor-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Competitor overview
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={sCompShow} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    I did the user experience analysis to 3 competitors, to understand their capabilities,
                    challenges, and opportunities for improvement. This helped me to identify market gaps and
                    potential opportunities.
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={sCompShow} index={2} className="w-full">
                  <div className="overflow-hidden">
                    <Image
                      src="/airy-project14.png"
                      alt="Competitor overview analysis"
                      width={7680}
                      height={2436}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={spRef}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-challenges-heading"
          >
            {/* Desktop / large tablet: matches Figma — sidebar + 3 columns, “If Challenges…” aligned with consequence row */}
            <FadeSlideSegment show={spShow} index={0} className="hidden w-full lg:block">
              <div className="grid grid-cols-[minmax(0,200px)_1fr] items-stretch gap-x-12 gap-y-5 lg:gap-x-16 xl:gap-x-24">
                <div className="flex flex-col">
                  <h2
                    id="airy-challenges-heading"
                    className="pt-1 font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                  >
                    The Challenges
                  </h2>
                  <h3 className="mt-auto max-w-[12rem] pt-0.5 font-manrope text-xl font-bold leading-snug text-black sm:text-2xl">
                    If Challenges is unresolved...
                  </h3>
                </div>
                <div className="min-w-0 grid grid-cols-3 gap-x-8 gap-y-5">
                  <p className="col-span-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                    However, I found that there are 3 challenges hindering the effectiveness of scoliosis brace.
                  </p>

                  <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src="/airy-project28.jpg"
                      alt="Patient and parent: emotional weight of tracking brace compliance"
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src="/airy-project18.jpg"
                      alt="Clinical check-up: doctor examining patient wearing a scoliosis brace"
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src="/airy-project25.jpg"
                      alt="Rehab and muscle activation: spine health after bracing"
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="font-manrope text-base font-bold leading-snug text-black sm:text-lg">
                    Track Compliance
                  </h3>
                  <h3 className="font-manrope text-base font-bold leading-snug text-black sm:text-lg">
                    Few Check-Ups
                  </h3>
                  <h3 className="font-manrope text-base font-bold leading-snug text-black sm:text-lg">
                    Rehab Routine
                  </h3>

                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    No better way for patients and parents to track brace time that uncovers compliance issue.
                  </p>
                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    Patients are disconnected from doctors until few months later to report compliance issue.
                  </p>
                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    Maintaining the routine to activate muscle post-bracing can be challenging.
                  </p>

                  <div className="min-w-0 space-y-2">
                    <p className="font-manrope text-sm font-bold leading-snug text-black sm:text-[15px]">
                      Failure to recognize compliance issues as they emerge can:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                      <li>Impact life quality due to pain</li>
                      <li>Psychological distress</li>
                    </ul>
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="font-manrope text-sm font-bold leading-snug text-black sm:text-[15px]">
                      Failure to report and address compliance issues can:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                      <li>Reduce brace effectiveness</li>
                      <li>Increase the risk of surgery</li>
                    </ul>
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="font-manrope text-sm font-bold leading-snug text-black sm:text-[15px]">
                      Failure to maintain a rehabilitation routine can lead to:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                      <li>Weaken muscles</li>
                      <li>Reduce brace effectiveness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeSlideSegment>

            {/* Mobile: stacked columns with same copy as desktop */}
            <FadeSlideSegment show={spShow} index={1} className="lg:hidden">
              <h2 className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl">The Challenges</h2>
              <p className="mt-4 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                However, I found that there are 3 challenges hindering the effectiveness of scoliosis brace.
              </p>
              <h3 className="mt-10 font-manrope text-lg font-bold leading-snug text-black sm:text-xl">
                If Challenges Left Unresolved...
              </h3>
              <div className="mt-8 flex flex-col gap-12">
                <div className="min-w-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src="/airy-project28.jpg"
                      alt="Patient and parent: emotional weight of tracking brace compliance"
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 font-manrope text-base font-bold text-black sm:text-lg">Track Compliance</h3>
                  <p className="mt-2 font-manrope text-sm leading-relaxed text-[#666666]">
                    No better way for patients and parents to track brace time that uncovers compliance issue.
                  </p>
                  <p className="mt-6 font-manrope text-sm font-bold text-black">
                    Failure to recognize compliance issues as they emerge can:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-manrope text-sm text-[#666666]">
                    <li>Impact life quality due to pain</li>
                    <li>Psychological distress</li>
                  </ul>
                </div>
                <div className="min-w-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src="/airy-project27.png"
                      alt="Clinical check-up: doctor examining patient wearing a scoliosis brace"
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 font-manrope text-base font-bold text-black sm:text-lg">Few Check-Ups</h3>
                  <p className="mt-2 font-manrope text-sm leading-relaxed text-[#666666]">
                    Patients are disconnected from doctors until few months later to report compliance issue.
                  </p>
                  <p className="mt-6 font-manrope text-sm font-bold text-black">
                    Failure to report and address compliance issues can:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-manrope text-sm text-[#666666]">
                    <li>Reduce brace effectiveness</li>
                    <li>Increase the risk of surgery</li>
                  </ul>
                </div>
                <div className="min-w-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src="/airy-project26.png"
                      alt="Rehab and muscle activation: spine health after bracing"
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 font-manrope text-base font-bold text-black sm:text-lg">Rehab Routine</h3>
                  <p className="mt-2 font-manrope text-sm leading-relaxed text-[#666666]">
                    Maintaining the routine to activate muscle post-bracing can be challenging.
                  </p>
                  <p className="mt-6 font-manrope text-sm font-bold text-black">
                    Failure to maintain a rehabilitation routine can lead to:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-manrope text-sm text-[#666666]">
                    <li>Weaken muscles</li>
                    <li>Reduce brace effectiveness</li>
                  </ul>
                </div>
              </div>
            </FadeSlideSegment>
          </section>

          <section
            ref={sGoalsRef}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="airy-design-goals-heading"
          >
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-16 xl:gap-20">
              <FadeSlideSegment show={sGoalsShow} index={0} className="min-w-0 text-left">
                <h2
                  id="airy-design-goals-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Design Goals
                </h2>
                <p className="mt-3 max-w-[20rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  Design an app for scoliosis patients to:
                </p>
              </FadeSlideSegment>
              <div className="grid min-w-0 grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10 lg:gap-12">
                <FadeSlideSegment show={sGoalsShow} index={1} className="flex min-w-0 flex-col items-center text-center">
                  <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
                    <Image
                      src="/airy-project1.png"
                      alt="Primary design goal — encourage brace-wearing habits"
                      width={120}
                      height={120}
                      sizes="96px"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="mt-6 font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Primary</h3>
                  <p className="mt-3 max-w-[14rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    Encourage better brace-wearing habits in users
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={sGoalsShow} index={2} className="flex min-w-0 flex-col items-center text-center">
                  <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
                    <Image
                      src="/airy-project2.png"
                      alt="Secondary design goal — report and address compliance"
                      width={120}
                      height={120}
                      sizes="96px"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="mt-6 font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Secondary</h3>
                  <p className="mt-3 max-w-[14rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    Report and address compliance issues efficiently
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={sGoalsShow} index={3} className="flex min-w-0 flex-col items-center text-center">
                  <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
                    <Image
                      src="/airy-project3.png"
                      alt="Lastly design goal — consistent rehabilitation routines"
                      width={120}
                      height={120}
                      sizes="96px"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="mt-6 font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Lastly</h3>
                  <p className="mt-3 max-w-[14rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    Establish consistent rehabilitation routines
                  </p>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={sfRef}
            className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2 bg-[#E6E1DB] px-[max(1.25rem,env(safe-area-inset-left))] py-14 sm:mt-16 sm:px-8 sm:py-16 md:mt-20 md:py-20 lg:px-[54px] lg:pr-[65px]"
            aria-label="Final design showcase"
          >
            <FadeSlideSegment show={sfShow} index={0} className="mx-auto w-full max-w-[1200px]">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6">
                <Image
                  src="/airy-project13.png"
                  alt="Designed for Empowerment"
                  width={7680}
                  height={2376}
                  sizes="(max-width: 640px) 360px, (max-width: 1024px) 480px, 560px"
                  className="h-20 w-auto max-w-[min(100%,22rem)] shrink-0 object-contain object-center sm:h-28 sm:max-w-[min(100%,34rem)] md:h-32 md:max-w-[min(100%,40rem)] sm:object-left"
                />
              </div>
            </FadeSlideSegment>

            <FadeSlideSegment
              show={sfShow}
              index={1}
              className="mx-auto mt-[7.5rem] grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:mt-40 lg:grid-cols-2 lg:gap-14 xl:gap-20"
            >
              <div className="relative min-w-0">
                <div className="overflow-hidden">
                  <Image
                    src="/airy-project8.png"
                    alt="Airy product packaging with QR code inviting users to join the Airy community for scoliosis management"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0 text-left">
                <h2
                  className="font-manrope text-lg font-semibold leading-snug text-[#E3A48A] sm:text-xl"
                >
                  Onboarding Prelude
                </h2>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                  User journey begins with the initial touch point - packaging.
                  A QR code prompts user to download the Airy app, creating the expectation of a transformative and empowering
                  journey.
                </p>
              </div>
            </FadeSlideSegment>

            <FadeSlideSegment
              show={sfShow}
              index={1}
              className="mx-auto mt-[7.5rem] grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:mt-40 lg:grid-cols-2 lg:gap-14 xl:gap-20"
            >
              <div className="relative min-w-0">
                <div className="overflow-hidden">
                  <Image
                    src="/airy-project6.png"
                    alt="Airy product packaging with QR code inviting users to join the Airy community for scoliosis management"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0 text-left">
                <h2
                  className="font-manrope text-lg font-semibold leading-snug text-[#E3A48A] sm:text-xl"
                >
                  Onboarding
                </h2>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                The launch screens collect user information with four optimized questions for precise personalization, while also guiding user to home screen quickly to minimize the risk of dropoff.
                </p>
              </div>
            </FadeSlideSegment>

            <FadeSlideSegment
              show={sfShow}
              index={1}
              className="mx-auto mt-[7.5rem] grid w-full max-w-[min(100%,1400px)] grid-cols-1 items-center gap-10 lg:mt-40 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.75fr)] lg:gap-10 xl:gap-14"
            >
              <div className="relative min-w-0 lg:-ml-[10em]">
                <div className="overflow-visible">
                  <Image
                    src="/airy-project11.png"
                    alt="Airy onboarding tutorial screens introducing the application"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="h-auto w-full min-w-[min(100%,42rem)] max-w-none object-contain lg:min-w-0 lg:w-[103.5%] lg:max-w-[103.5%]"
                  />
                </div>
              </div>
              <div className="min-w-0 text-left lg:max-w-[22rem] lg:justify-self-end xl:max-w-[26rem]">
                <h2
                  className="font-manrope text-lg font-semibold leading-snug text-[#E3A48A] sm:text-xl"
                >
                  Onboarding
                </h2>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                Tutorial screens
                provide the user with an introduction to the application and increases the level of trust in it
                </p>
              </div>
            </FadeSlideSegment>

            <FadeSlideSegment
              show={sfShow}
              index={1}
              className="mx-auto mt-[7.5rem] grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:mt-40 lg:grid-cols-2 lg:gap-14 xl:gap-20"
            >
              <div className="relative min-w-0">
                <div className="overflow-hidden">
                  <Image
                    src="/airy-project9.gif"
                    alt="Airy product packaging with QR code inviting users to join the Airy community for scoliosis management"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0 text-left">
                <h2
                  className="font-manrope text-lg font-semibold leading-snug text-[#E3A48A] sm:text-xl"
                >
                  Boost Compliance
                </h2>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                Welcome users with an encouraging message, display their current wearing progress and achievements to boost engagement. Then conclude with a call to action to start rehab exercises today
                </p>
              </div>
            </FadeSlideSegment>

            <FadeSlideSegment
              show={sfShow}
              index={1}
              className="mx-auto mt-[7.5rem] grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:mt-40 lg:grid-cols-2 lg:gap-14 xl:gap-20"
            >
              <div className="relative min-w-0">
                <div className="overflow-hidden">
                  <Image
                    src="/airy-project7.png"
                    alt="Airy product packaging with QR code inviting users to join the Airy community for scoliosis management"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0 text-left">
                <h2
                  className="font-manrope text-lg font-semibold leading-snug text-[#E3A48A] sm:text-xl"
                >
                  Rehab exercises
                </h2>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                Algorithm matches exercises to user based on profile information, saving the abandon rate associated with exercise planning
                </p>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                When reaching a specific milestone, encouragement message pops up to enhance engagement both during and after the exercise
                </p>
              </div>
            </FadeSlideSegment>

            <FadeSlideSegment
              show={sfShow}
              index={1}
              className="mx-auto mt-[7.5rem] grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:mt-40 lg:grid-cols-2 lg:gap-14 xl:gap-20"
            >
              <div className="relative min-w-0">
                <div className="overflow-hidden">
                  <Image
                    src="/airy-project22.gif"
                    alt="Airy product packaging with QR code inviting users to join the Airy community for scoliosis management"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0 text-left">
                <h2
                  className="font-manrope text-lg font-semibold leading-snug text-[#E3A48A] sm:text-xl"
                >
                  AI personal assistant
                </h2>
                <p className="mt-8 font-manrope text-[clamp(.75rem,1.5vw,1.5rem)] font-normal leading-[1.35] text-black sm:leading-[1.4]">
                The AI personal assistant promptly identifies and resolves compliance issues, addressing user concerns and easing the workload for clinicians
                </p>
              </div>
            </FadeSlideSegment>
          </section>

          <section
            ref={sPsetRef}
            className="mt-[8.75rem] w-full min-w-0 sm:mt-40 md:mt-[12.5rem]"
            aria-labelledby="airy-onboarding-tutorial-heading"
          >
            <FadeSlideSegment show={sPsetShow} index={0} className="w-full max-w-[820px] text-left">
              <h2
                id="airy-onboarding-tutorial-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
               After the research, I conceptualized the design...
              </h2>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
              I started with sketch on paper, then developed concepts based on the features hierarchy, the user flow that I wish users to follow. Then I created mid-fi prototypes based on the paper sketch.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={sPsetShow} index={1} className="mt-20 w-full sm:mt-[6.25rem]">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project26.png"
                  alt="Airy onboarding tutorial walkthrough screens"
                  width={1920}
                  height={741}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                  className="h-auto w-full object-contain"
                />
              </div>
            </FadeSlideSegment>
          </section>

          <section
            ref={sIARef}
            className="mt-[8.75rem] w-full min-w-0 sm:mt-40 md:mt-[12.5rem]"
            aria-labelledby="airy-information-architecture-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={sIAShow} index={0} className="md:pt-1">
                <h2
                  id="airy-information-architecture-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Information architecture
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={sIAShow} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Building information architecture helped organizing my logic, provided a framework for the information I intend to include. It notably eliminate redundant repetition in information for later stages.

I made Home, Exercise, and Message to be in the sticky bottom menu, because they are the most important features that should be easily accessible and consistently visible across various screens. While Profile stays on the right top corner due to less frequent interaction and logical separation.</p>
                </FadeSlideSegment>
                <FadeSlideSegment show={sIAShow} index={2} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/airy-project4.png"
                      alt="Information architecture: brace, app, and care touchpoints with hierarchy and tradeoffs"
                      width={7424}
                      height={3664}
                      unoptimized
                      sizes="(max-width: 768px) 80vw, (max-width: 1440px) calc((100vw - 2.5rem) * 0.8), 1152px"
                      className="mx-auto h-auto w-[80%] object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={sUsabilityRef}
            className="mt-[8.75rem] w-full min-w-0 sm:mt-40 md:mt-[12.5rem]"
            aria-labelledby="airy-usability-test-1-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={sUsabilityShow} index={0} className="md:pt-1">
                <h2
                  id="airy-usability-test-1-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Usability test 1.0
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={sUsabilityShow} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I conducted a usability test with 3 designer friends on the first version of design, and they pointed out the following problems. Taking their feedback into consideration, I created the second version.</p>
                </FadeSlideSegment>
                <FadeSlideSegment show={sUsabilityShow} index={2} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/airy-project29.png"
                      alt="Information architecture: brace, app, and care touchpoints with hierarchy and tradeoffs"
                      width={7424}
                      height={3664}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>
        </div>

        <section
          ref={sUsersRef}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-who-users-heading"
        >
          <FadeSlideSegment show={sUsersShow} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <h2
                  id="airy-who-users-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Mid-fi prototype
                </h2>
                <Image
                  src="/airy-icon1.png"
                  alt="Airy mid-fi prototype"
                  width={742}
                  height={366}
                  unoptimized
                  sizes="(min-width: 640px) 72px, 48px"
                  className="mt-1 h-12 w-12 object-contain sm:h-[96px] sm:w-[96px]"
                />
                <p className="mt-1 font-manrope text-sm leading-relaxed text-[#666666] sm:mt-1.5 sm:text-base">
                  The launch screens collect user&apos;s information with minimally 4 questions, which are user&apos;s name, age, curvature degree and brace type.
                </p>
              </div>
              <Image src="/airy-project5.png" alt="Airy mid-fi prototype" width={7424} height={3664} unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px" className="h-auto w-full object-contain" />
            </div>
          </FadeSlideSegment>

          <FadeSlideSegment show={sUsersShow} index={1} className="mt-16 w-full sm:mt-20 md:mt-24">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <Image
                  src="/airy-icon2.png"
                  alt="Home"
                  width={742}
                  height={366}
                  unoptimized
                  sizes="(min-width: 640px) 72px, 48px"
                  className="mt-1 h-12 w-12 object-contain sm:mt-1.5 sm:h-[48px] sm:w-[48px]"
                />
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:mt-4 sm:text-base">
                  To reduce churn rate, it&apos;s crucial to foster positive emotions and motivation in users. An intuitive,
                  simple home page can ease cognitive load, especially when users are already dealing with brace-wearing
                  challenges. It needs to be:
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  <li>Clear display of wear time progress.</li>
                  <li>Incentives to complete required wearing hours.</li>
                  <li>Motivation to start today&apos;s exercise.</li>
                </ol>
                <p className="mt-6 font-manrope text-sm leading-relaxed text-[#666666] sm:mt-8 sm:text-base">
                  I used conversational UX to encourage brace-wearing continuity. Additionally, I placed the exercise
                  schedule on the home page, hooking users to engage with the app beyond just monitoring data.
                </p>
              </div>
              <Image src="/airy-project10.png" alt="Airy mid-fi prototype" width={7424} height={3664} unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px" className="h-auto w-full object-contain" />
            </div>
          </FadeSlideSegment>

          <FadeSlideSegment show={sUsersShow} index={2} className="mt-16 w-full sm:mt-20 md:mt-24">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <Image
                  src="/airy-icon3.png"
                  alt="Exercise"
                  width={742}
                  height={366}
                  unoptimized
                  sizes="(min-width: 640px) 72px, 48px"
                  className="mt-1 h-12 w-12 object-contain sm:mt-1.5 sm:h-[48px] sm:w-[48px]"
                />
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:mt-4 sm:text-base">
                Rehab exercises are vital for scoliosis management, yet often overlooked in related apps. During my interviews with orthopedists, they highlighted these exercises in preventing muscle weakening and scoliosis relapse due to bracing. Therefore, I designed the app&apos;s exercise section to provide personalized exercise recommendations through an algorithm and motivational prompts to increase user engagement.
                </p>
              </div>
              <Image src="/airy-project21.png" alt="Airy mid-fi prototype" width={7424} height={3664} unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px" className="h-auto w-full object-contain" />
            </div>
          </FadeSlideSegment>

          <FadeSlideSegment show={sUsersShow} index={3} className="mt-16 w-full sm:mt-20 md:mt-24">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <Image
                  src="/airy-icon4.png"
                  alt="AI assistant"
                  width={742}
                  height={366}
                  unoptimized
                  sizes="(min-width: 640px) 72px, 48px"
                  className="mt-1 h-12 w-12 object-contain sm:mt-1.5 sm:h-[48px] sm:w-[48px]"
                />
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:mt-4 sm:text-base">
                Orthopedists have limited availability, resulting in delays addressing patient compliance issues with braces until appointment several month later, which can be too late. I was inspired by Lemonade app, to implement an AI assistant to help address outsourceable compliance problems, such as needing brace modifications due to discomfort.</p>
              </div>
              <Image src="/airy-project15.png" alt="Airy mid-fi prototype" width={7424} height={3664} unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px" className="h-auto w-full object-contain" />
            </div>
          </FadeSlideSegment>

          <FadeSlideSegment show={sUsersShow} index={4} className="mt-16 w-full sm:mt-20 md:mt-24">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <Image
                  src="/airy-icon5.png"
                  alt="Profile"
                  width={742}
                  height={366}
                  unoptimized
                  sizes="(min-width: 640px) 72px, 48px"
                  className="mt-1 h-12 w-12 object-contain sm:mt-1.5 sm:h-[48px] sm:w-[48px]"
                />
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:mt-4 sm:text-base">
                The profile page displays a user&apos;s information and allows sharing compliance diagnostic reports with guardians. Users can select in 3 privacy preferences when sending the reports.
                </p>              </div>
              <Image src="/airy-project20.png" alt="Airy mid-fi prototype" width={7424} height={3664} unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px" className="h-auto w-full object-contain" />
            </div>
          </FadeSlideSegment>
        </section>

        <section
            ref={sInsight1Ref}
            className="mt-[8.75rem] w-full min-w-0 sm:mt-40 md:mt-[12.5rem]"
            aria-labelledby="airy-style-guide-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={sInsight1Show} index={0} className="md:pt-1">
                <h2
                  id="airy-style-guide-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Style guide
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={sInsight1Show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I employed a rose pink hue as the primary color to create a calming visual experience, helping users distance themselves from the struggles of scoliosis. Gradient pop colors highlight important information or titles.
                  </p>
                  </FadeSlideSegment>
                <FadeSlideSegment show={sInsight1Show} index={2} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/airy-project27.png"
                      alt="Information architecture: brace, app, and care touchpoints with hierarchy and tradeoffs"
                      width={7424}
                      height={3664}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={sHubs2Ref}
            className="mt-[8.75rem] w-full min-w-0 sm:mt-40 md:mt-[12.5rem]"
            aria-labelledby="airy-midfi-highfi-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={sHubs2Show} index={0} className="md:pt-1">
                <h2
                  id="airy-midfi-highfi-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Mid-fi to High-fi Prototype
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={sHubs2Show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I identified the different styles from the mid-fi prototype and created a visual guide for the app interface design. While applying the visual design, I optimized the layout, utilized margin spaces, adjusted font and component sizes and color to highlight the information hierarchy. </p>
                  </FadeSlideSegment>
                <FadeSlideSegment show={sHubs2Show} index={2} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/airy-project19.gif"
                      alt="Information architecture: brace, app, and care touchpoints with hierarchy and tradeoffs"
                      width={7424}
                      height={3664}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

        <section
          ref={sModalDirectionsRef}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-modal-directions-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sModalDirectionsShow} index={0} className="md:pt-1">
              <h2
                id="airy-modal-directions-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Usability test 2.0
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sModalDirectionsShow} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I conducted a usability test of the high fidelity prototype in maze.co with a group of 8 users. I found that:
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  <li>
                    Users miss &apos;notification&apos; when it is under irrelevant UX script, &apos;privacy setting&apos;.
                  </li>
                  <li>
                    Onboarding pages are crucial at helping user understand the app&apos;s purpose. Without it, almost no user can determine the app&apos;s purpose at first glance.
                  </li>
                </ol>
              </FadeSlideSegment>
              <FadeSlideSegment show={sModalDirectionsShow} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project16.png"
                    alt="Airy style guide: rose primary palette and gradient accents"
                    width={5760}
                    height={3240}
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <section
          ref={sInsight2Ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-impact-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight2Show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="airy-impact-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                The impact
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-8 sm:space-y-10">
              <FadeSlideSegment show={sInsight2Show} index={1} className="w-full">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <div className="rounded-2xl bg-[#F5F3F1] p-6 sm:p-8">
                    <p className="font-manrope text-2xl font-semibold text-[#D5A287] sm:text-5xl">36%</p>
                    <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                      more patients say the Airy app helps their doctors analyze whether a treatment plan adjustment is needed,
                      thanks to better engagement in wear time and exercise tracking.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F5F3F1] p-6 sm:p-8">
                    <p className="font-manrope text-2xl font-semibold text-[#D5A287] sm:text-5xl">76%</p>
                    <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                      of testers could find how to check wear time, access exercise tutorials, and update scoliosis progression
                      within the first three attempts.
                    </p>
                  </div>
                </div>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <section
          ref={sTakeawaysRef}
          className="mt-16 mb-10 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-takeaways-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sTakeawaysShow} index={0} className="md:pt-1">
              <h2
                id="airy-takeaways-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Takeaways
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-8 sm:space-y-10">
              <FadeSlideSegment show={sTakeawaysShow} index={1} className="w-full space-y-3">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Experience starts earlier than I thought
                </p>
                <p className="font-manrope text-sm leading-relaxed text-black/85 sm:text-base">
                  I once believed the user experience started with the launch screen of an app, but it truly begins much
                  earlier. It can be the first advertisement seen, initial website search, or unboxing a product. Even
                  packaging that entices users with a seamless onboarding process shapes expectations. Considering the entire
                  user journey, from awareness to advocacy, allows for a cohesive experience that helps a product stand out.
                  Designing holistically across all touchpoints creates a more impactful overall experience than just thinking
                  about the screens.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeawaysShow} index={2} className="w-full space-y-3">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Experience design follows design intent
                </p>
                <p className="font-manrope text-sm leading-relaxed text-black/85 sm:text-base">
                  I realize that the interface serves as a vehicle for communicating information efficiently and guiding user
                  actions in a clear, intuitive manner given hardware constraints. The goal is to direct users down a desired
                  path by prioritizing calls to action. Designers must thoughtfully utilize limited screen space to optimize
                  this experience.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeawaysShow} index={3} className="w-full space-y-3">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Typographic consistency across all interfaces
                </p>
                <p className="font-manrope text-sm leading-relaxed text-black/85 sm:text-base">
                  Typography hierarchies are constrained by space and accessibility. Designers must analyze a system&apos;s
                  type usage holistically to communicate informational importance at first view. Merely using the largest type
                  on a page does not guarantee consistent hierarchy across interfaces. Establishing typographic guidelines
                  promotes uniformity by strategically employing type sizes for optimal user orientation.
                </p>
              </FadeSlideSegment>
            </div>
          </div>
        </section>
      </main>

      <footer
        ref={footRevealRef}
        className="relative z-10 w-full bg-black pb-[40px] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-16 sm:pl-8 sm:pr-8 sm:pt-[107px] lg:pl-[74px] lg:pr-[min(427px,28vw)]"
      >
        <div className="flex flex-col items-start text-left">
          <FadeSlideSegment show={footRevealShow} index={0}>
            <p className="font-bangla-mn text-xl leading-normal text-white sm:text-[24px]">
              Interested in building together?
            </p>
          </FadeSlideSegment>
          <FadeSlideSegment show={footRevealShow} index={1} className="mt-4 sm:mt-2">
            <a
              href="mailto:sangyuxi@gmail.com"
              className="font-bangla-mn text-xl text-white underline underline-offset-8 transition-opacity hover:opacity-80 sm:text-[24px]"
            >
              Let&apos;s connect 
            </a>
          </FadeSlideSegment>
          <FadeSlideSegment show={footRevealShow} index={2} className="mt-16 sm:mt-[84px]">
            <div className="flex items-center">
              <p className="font-manrope text-base text-white">
                Copyright &copy; 2026 sangyuxi.com. All rights reserved.
              </p>
            </div>
          </FadeSlideSegment>
        </div>
      </footer>
    </div>
  );
}
