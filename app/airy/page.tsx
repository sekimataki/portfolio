"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const footReveal = useRevealOnScroll<HTMLElement>();
  const s1 = useRevealOnScroll<HTMLDivElement>();
  const sUsers = useRevealOnScroll<HTMLDivElement>();
  const sComp = useRevealOnScroll<HTMLDivElement>();
  const sSol = useRevealOnScroll<HTMLDivElement>();
  const sHubs = useRevealOnScroll<HTMLDivElement>();
  const sHubs2 = useRevealOnScroll<HTMLDivElement>();
  const sHubs3 = useRevealOnScroll<HTMLDivElement>();
  const sIA = useRevealOnScroll<HTMLDivElement>();
  const sModalDirections = useRevealOnScroll<HTMLDivElement>();
  const sUsability = useRevealOnScroll<HTMLDivElement>();
  const sInsight1 = useRevealOnScroll<HTMLDivElement>();
  const sInsight2 = useRevealOnScroll<HTMLDivElement>();
  const sInsight3 = useRevealOnScroll<HTMLDivElement>();
  const sWhatsNext = useRevealOnScroll<HTMLDivElement>();
  const sTakeaways = useRevealOnScroll<HTMLDivElement>();
  const s2 = useRevealOnScroll<HTMLDivElement>();
  const s3 = useRevealOnScroll<HTMLDivElement>();
  const s4 = useRevealOnScroll<HTMLDivElement>();
  const sp = useRevealOnScroll<HTMLDivElement>();
  const sg = useRevealOnScroll<HTMLDivElement>();
  const sGoals = useRevealOnScroll<HTMLDivElement>();
  const sf = useRevealOnScroll<HTMLDivElement>();
  const sPam = useRevealOnScroll<HTMLDivElement>();
  const sPset = useRevealOnScroll<HTMLDivElement>();
  const sShare = useRevealOnScroll<HTMLDivElement>();
  const sMate = useRevealOnScroll<HTMLDivElement>();

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


      <main className="relative z-10 mx-auto w-full min-w-0 max-w-[1440px] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 lg:pl-[54px] lg:pr-[65px]">
        <div className="pt-[calc(6.5rem+env(safe-area-inset-top,0px))] pb-20 sm:pt-28 md:pt-32 md:pb-24">
          <FadeSlideSegment show={foldShow} index={0} className="mb-6 w-full text-left sm:mb-8">
            <div className="w-full max-w-[820px]">
              <FadeSlideSegment show={foldShow} index={2} className="w-full min-w-0 text-left">
              <h1 className="font-bangla-mn font-medium text-pretty text-black sm:text-[24px] sm:leading-normal">
              Airy - Manage Scoliosis Health
                </h1>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={3} className="mt-4 w-full text-left">
              <p className="font-manrope font-regular text-black/50 sm:text-[18px] sm:leading-normal">
              A companion app for brace wear time, progress, and rehabilitation—aligned with how patients, parents, and
                  clinicians actually coordinate care.
                </p>
              </FadeSlideSegment>
            </div>
          </FadeSlideSegment>

          <div className="relative w-full overflow-hidden">
            <div className="relative aspect-[16/10] w-full max-h-[min(85vh,720px)]">
              <Image
                src="/airy-cover.png"
                alt="Airy app — manage scoliosis health, case study hero"
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
              />
            </div>
          </div>

          <section
            ref={sg.ref}
            className="mt-8 w-full min-w-0 sm:mt-10 md:mt-12"
            aria-label="Project context, role, and methodologies"
          >
            <div className="grid w-full min-w-0 grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 md:gap-x-10 lg:gap-x-14 xl:gap-x-20 [&>*]:min-w-0">
              <FadeSlideSegment show={sg.show} index={0} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-medium leading-snug text-black sm:text-xl">Project Context</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>2022 Academic Capstone</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sg.show} index={1} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-medium leading-snug text-black sm:text-xl">My Role</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>Sole UX Designer</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sg.show} index={2} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-medium leading-snug text-black sm:text-xl">Methodologies</h2>
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
            ref={s1.ref}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-context-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={s1.show} index={0} className="md:pt-1">
                <h2
                  id="airy-context-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  The context
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={s1.show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    Scoliosis is a lateral curvature of the spine affecting about 7 million people in the US today. About
                    80% of patients are female. If left untreated, it can lead to back pain and potentially require surgery.
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s1.show} index={2} className="w-full">
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
                <FadeSlideSegment show={s1.show} index={4} className="w-full">
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
            ref={s2.ref}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="airy-secondary-research-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={s2.show} index={0} className="md:pt-1">
                <h2
                  id="airy-secondary-research-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  Secondary research
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={s2.show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    &ldquo;Only 10% of guardian knows their child&apos;s actual brace wearing time.&rdquo;
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s2.show} index={2} className="w-full">
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
            ref={sp.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="airy-challenges-heading"
          >
            {/* Desktop / large tablet: matches Figma — sidebar + 3 columns, “If Challenges…” aligned with consequence row */}
            <FadeSlideSegment show={sp.show} index={0} className="hidden w-full lg:block">
              <div className="grid grid-cols-[minmax(0,220px)_repeat(3,minmax(0,1fr))] gap-x-8 gap-y-5">
                <h2
                  id="airy-challenges-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black lg:col-start-1 lg:row-start-1 lg:pt-1 sm:text-2xl"
                >
                  The Challenges
                </h2>
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base lg:col-span-3 lg:col-start-2 lg:row-start-1">
                  However, I found that there are 3 challenges hindering the effectiveness of scoliosis brace.
                </p>

                <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-100 lg:col-start-2 lg:row-start-2">
                  <Image
                    src="/airy-project28.jpg"
                    alt="Patient and parent: emotional weight of tracking brace compliance"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-100 lg:col-start-3 lg:row-start-2">
                  <Image
                    src="/airy-project27.png"
                    alt="Clinical check-up: doctor examining patient wearing a scoliosis brace"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-100 lg:col-start-4 lg:row-start-2">
                  <Image
                    src="/airy-project26.png"
                    alt="Rehab and muscle activation: spine health after bracing"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>

                <h3 className="font-manrope text-base font-bold leading-snug text-black sm:text-lg lg:col-start-2 lg:row-start-3">
                  Track Compliance
                </h3>
                <h3 className="font-manrope text-base font-bold leading-snug text-black sm:text-lg lg:col-start-3 lg:row-start-3">
                  Few Check-Ups
                </h3>
                <h3 className="font-manrope text-base font-bold leading-snug text-black sm:text-lg lg:col-start-4 lg:row-start-3">
                  Rehab Routine
                </h3>

                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px] lg:col-start-2 lg:row-start-4">
                  No better way for patients and parents to track brace time that uncovers compliance issue.
                </p>
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px] lg:col-start-3 lg:row-start-4">
                  Patients are disconnected from doctors until few months later to report compliance issue.
                </p>
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px] lg:col-start-4 lg:row-start-4">
                  Maintaining the routine to activate muscle post-bracing can be challenging.
                </p>

                <h3 className="max-w-[12rem] font-manrope text-xl font-bold leading-snug text-black sm:text-2xl lg:col-start-1 lg:row-start-5 lg:pt-0.5">
                  If Challenges is unresolved...
                </h3>
                <div className="min-w-0 space-y-2 lg:col-start-2 lg:row-start-5">
                  <p className="font-manrope text-sm font-bold leading-snug text-black sm:text-[15px]">
                    Failure to recognize compliance issues as they emerge can:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    <li>Impact life quality due to pain</li>
                    <li>Psychological distress</li>
                  </ul>
                </div>
                <div className="min-w-0 space-y-2 lg:col-start-3 lg:row-start-5">
                  <p className="font-manrope text-sm font-bold leading-snug text-black sm:text-[15px]">
                    Failure to report and address compliance issues can:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    <li>Reduce brace effectiveness</li>
                    <li>Increase the risk of surgery</li>
                  </ul>
                </div>
                <div className="min-w-0 space-y-2 lg:col-start-4 lg:row-start-5">
                  <p className="font-manrope text-sm font-bold leading-snug text-black sm:text-[15px]">
                    Failure to maintain a rehabilitation routine can lead to:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                    <li>Weaken muscles</li>
                    <li>Reduce brace effectiveness</li>
                  </ul>
                </div>
              </div>
            </FadeSlideSegment>

            {/* Mobile: stacked columns with same copy as desktop */}
            <FadeSlideSegment show={sp.show} index={1} className="lg:hidden">
              <h2 className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl">The Challenges</h2>
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
            ref={sGoals.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="airy-design-goals-heading"
          >
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-16 xl:gap-20">
              <FadeSlideSegment show={sGoals.show} index={0} className="min-w-0 text-left">
                <h2
                  id="airy-design-goals-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  Design Goals
                </h2>
                <p className="mt-3 max-w-[20rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  Design an app for scoliosis patients to:
                </p>
              </FadeSlideSegment>
              <div className="grid min-w-0 grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10 lg:gap-12">
                <FadeSlideSegment show={sGoals.show} index={1} className="flex min-w-0 flex-col items-center text-center">
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
                <FadeSlideSegment show={sGoals.show} index={2} className="flex min-w-0 flex-col items-center text-center">
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
                <FadeSlideSegment show={sGoals.show} index={3} className="flex min-w-0 flex-col items-center text-center">
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
            ref={sf.ref}
            className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2 bg-[#F2EEE9] px-[max(1.25rem,env(safe-area-inset-left))] py-14 sm:mt-16 sm:px-8 sm:py-16 md:mt-20 md:py-20 lg:px-[54px] lg:pr-[65px]"
            aria-labelledby="airy-final-design-heading"
          >
            <FadeSlideSegment show={sf.show} index={0} className="mx-auto w-full max-w-[1200px]">
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

            <div className="mx-auto mt-12 grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-14 xl:gap-20">
              <FadeSlideSegment show={sf.show} index={1} className="relative min-w-0">
                <div className="overflow-hidden rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
                  <Image
                    src="/airy-project8.png"
                    alt="Airy product packaging with QR code inviting users to join the Airy community for scoliosis management"
                    width={3096}
                    height={2552}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sf.show} index={2} className="min-w-0 text-left">
                <h2
                  id="airy-final-design-heading"
                  className="font-manrope text-xl font-medium leading-snug text-[#C9A590] sm:text-2xl"
                >
                  Onboarding Prelude
                </h2>
                <p className="mt-6 font-manrope text-sm leading-relaxed text-neutral-900 sm:text-base">
                  User journey begins with the initial touch point - packaging.
                </p>
                <p className="mt-4 font-manrope text-sm leading-relaxed text-neutral-900 sm:text-base">
                  A QR code prompts user to download the Airy app, creating the expectation of a transformative and empowering
                  journey.
                </p>
              </FadeSlideSegment>
            </div>
          </section>

          <section
            ref={sPam.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="airy-onboarding-heading"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
              <div className="min-w-0 space-y-4 text-left lg:max-w-[440px]">
                <FadeSlideSegment show={sPam.show} index={0} className="w-full">
                  <h2
                    id="airy-onboarding-heading"
                    className="font-manrope text-xl font-medium leading-snug text-[#fe6f61] sm:text-2xl"
                  >
                    Onboarding
                  </h2>
                  <p className="mt-4 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                    Launch screens collect information with four optimized questions for precise personalization, while
                    guiding users to the home screen quickly to minimize drop-off.
                  </p>
                </FadeSlideSegment>
              </div>
              <FadeSlideSegment show={sPam.show} index={1} className="min-w-0 w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project25.jpg"
                    alt="Airy onboarding: personalized questions and path to home"
                    width={11568}
                    height={3728}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
            </div>
          </section>

          <section
            ref={sPset.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="airy-onboarding-tutorial-heading"
          >
            <FadeSlideSegment show={sPset.show} index={0} className="w-full max-w-[820px] text-left">
              <h2
                id="airy-onboarding-tutorial-heading"
                className="font-manrope text-xl font-medium leading-snug text-[#fe6f61] sm:text-2xl"
              >
                Onboarding — tutorial
              </h2>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                Tutorial screens introduce the application and increase trust before users commit to daily tracking.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={sPset.show} index={1} className="mt-8 w-full sm:mt-10">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project23.gif"
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
            ref={sShare.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="airy-boost-compliance-heading"
          >
            <FadeSlideSegment show={sShare.show} index={0} className="w-full max-w-[820px] text-left">
              <h2
                id="airy-boost-compliance-heading"
                className="font-manrope text-xl font-medium leading-snug text-[#fe6f61] sm:text-2xl"
              >
                Boost compliance
              </h2>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                Welcome users with an encouraging message, show current wearing progress and achievements to boost
                engagement, then conclude with a call to action to start rehab exercises today.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={sShare.show} index={1} className="mt-8 w-full sm:mt-10">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project22.gif"
                  alt="Airy home: wear progress, achievements, and motivation to complete hours and rehab"
                  width={1920}
                  height={930}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                  className="h-auto w-full object-contain"
                />
              </div>
            </FadeSlideSegment>
          </section>
        </div>

        <section
          ref={sUsers.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-who-users-heading"
        >
          <FadeSlideSegment show={sUsers.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <h2
                  id="airy-who-users-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  Persona
                </h2>
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Based on 6 interviewees: I contacted six scoliosis patients online who had worn a brace and were in three
                  different stages of treatment from a scoliosis support group. I distilled their complaints into one persona
                  shown in the tabs.
                </p>
              </div>
              <div className="min-w-0">
                <HowILandedUsersTabs />
              </div>
            </div>
          </FadeSlideSegment>
        </section>

        <section
          ref={sComp.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-competitor-heading"
        >
          <FadeSlideSegment show={sComp.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <h2
                  id="airy-competitor-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  Competitor Overview
                </h2>
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I analyzed the user experience of three competitors to understand their capabilities, challenges, and
                  opportunities for improvement—helping identify market gaps and where Airy could differentiate.
                </p>
              </div>
              <div className="min-w-0">
                <CompetitorOverviewTabs />
              </div>
            </div>
          </FadeSlideSegment>
        </section>

        <section
          ref={sSol.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-define-solutions-heading"
        >
          <FadeSlideSegment show={sSol.show} index={0} className="w-full max-w-[920px] text-left">
            <h2
              id="airy-define-solutions-heading"
              className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
            >
              Rehab exercises
            </h2>
            <p className="mt-4 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
              An algorithm matches exercises to the user based on profile information, reducing the abandon rate associated
              with planning. Milestone moments surface encouragement during and after exercise to keep engagement high.
            </p>
          </FadeSlideSegment>
          <FadeSlideSegment show={sSol.show} index={1} className="mt-8 w-full sm:mt-10">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/airy-project13.png"
                alt="Airy rehab exercises: personalized recommendations and milestone encouragement"
                width={7680}
                height={2376}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1200px"
                className="h-auto w-full object-contain"
              />
            </div>
          </FadeSlideSegment>
        </section>

        <section
          ref={sHubs.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-ai-assistant-heading"
        >
          <FadeSlideSegment show={sHubs.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8 xl:gap-10 [&>*]:min-w-0">
              <div className="min-w-0 text-left">
                <h2
                  id="airy-ai-assistant-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  AI personal assistant
                </h2>
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  The assistant identifies and resolves compliance issues, addresses user concerns, and eases workload for
                  clinicians by handling outsourceable questions—such as discomfort that may need brace adjustments.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project12.png"
                  alt="Airy AI assistant: compliance prompts and supportive guidance"
                  width={2054}
                  height={1152}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </FadeSlideSegment>
        </section>

        <section
          ref={sHubs2.ref}
          className="mt-12 w-full min-w-0 sm:mt-14 md:mt-16"
          aria-labelledby="airy-after-research-heading"
        >
          <FadeSlideSegment show={sHubs2.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8 xl:gap-10 [&>*]:min-w-0">
              <div className="min-w-0 text-left">
                <h2
                  id="airy-after-research-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  After the research, I conceptualized the design…
                </h2>
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I started with sketches on paper, developed concepts from feature hierarchy and the user flow I wanted
                  people to follow, then moved into mid-fidelity prototypes.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project11.png"
                  alt="Airy early sketches and concept development from research to mid-fi"
                  width={2098}
                  height={1256}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </FadeSlideSegment>
        </section>

        <section
          ref={sHubs3.ref}
          className="mt-12 w-full min-w-0 sm:mt-14 md:mt-16"
          aria-label="Mid-fi home and exercise highlights"
        >
          <FadeSlideSegment show={sHubs3.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8 xl:gap-10 [&>*]:min-w-0">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project1.png"
                  alt="Airy mid-fi: simplified home layout and exercise entry"
                  width={1492}
                  height={685}
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/airy-project10.png"
                  alt="Airy mid-fi: exercise scheduling and engagement on the home surface"
                  width={1790}
                  height={1406}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </FadeSlideSegment>
        </section>

        <section
          ref={sIA.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-information-architecture-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sIA.show} index={0} className="md:pt-1">
              <h2
                id="airy-information-architecture-heading"
                className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
              >
                Information Architecture
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sIA.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Building information architecture organized the logic and gave a framework for the information I wanted to
                  include—reducing redundant repetition in later stages. I placed Home, Exercise, and Message in a sticky
                  bottom menu because they are the most important features and should stay visible across screens. Profile stays
                  in the top-right corner for less frequent tasks and clear separation.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sIA.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project9.gif"
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
          ref={sModalDirections.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-modal-directions-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sModalDirections.show} index={0} className="md:pt-1">
              <h2
                id="airy-modal-directions-heading"
                className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
              >
                Style guide
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sModalDirections.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I used a rose pink hue as the primary color to create a calming visual experience, helping users distance
                  themselves from the stress of scoliosis. Gradient accent colors highlight important information and titles.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sModalDirections.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project14.png"
                    alt="Airy style guide: rose primary palette and gradient accents"
                    width={5760}
                    height={3240}
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sModalDirections.show} index={3} className="w-full space-y-3">
                <h3 className="font-manrope text-lg font-bold text-black sm:text-xl">Mid-fi to high-fi prototype</h3>
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I identified the different styles from the mid-fi prototype and created a visual guide for the interface.
                  While applying visual design, I optimized layout, margins, type sizes, and color to reinforce hierarchy.
                </p>
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project8.png"
                    alt="Airy mid-fi to high-fi: visual refinement and component hierarchy"
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
          ref={sUsability.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-usability-test-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sUsability.show} index={0} className="md:pt-1">
              <div className="min-w-0 text-left">
                <h2
                  id="airy-usability-test-heading"
                  className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
                >
                  Usability test 1.0
                </h2>
                <p className="mt-2 font-manrope text-sm text-[#666666] sm:text-[15px]">
                  First version tested with three designer peers
                </p>
              </div>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sUsability.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I conducted a usability test with three designer friends on the first version of the design. They surfaced
                  issues with navigation and clarity; I incorporated their feedback into the second version.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sUsability.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project7.png"
                    alt="Airy usability test 1.0: synthesis of designer feedback and iteration themes"
                    width={5768}
                    height={1584}
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <section
          ref={sInsight1.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-midfi-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight1.show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="airy-midfi-heading"
                className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
              >
                Mid-fi prototype
              </h2>
              <Image
                src="/airy-project5.png"
                alt="Airy mid-fi: launch questions and personalized onboarding fields"
                width={2304}
                height={1012}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                className="h-auto w-full object-contain"
              />
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sInsight1.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Launch screens collect minimally four questions—name, age, curvature degree, and brace type. To reduce
                  churn, it is crucial to foster positive emotion and motivation. An intuitive, simple home eases cognitive load
                  when users are already managing brace wear: clear wear-time progress, incentives to complete required hours,
                  and motivation to start today&apos;s exercise.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight1.show} index={2} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I used conversational UX to encourage continuity. Placing the exercise schedule on the home page hooks
                  engagement beyond monitoring data alone. Rehab exercises are vital yet often missing in related apps;
                  orthopedists highlighted their role in preventing muscle weakening and relapse—so the exercise section delivers
                  personalized recommendations and motivational prompts.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight1.show} index={3} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project6.png"
                    alt="Airy mid-fi: home experience with wear progress, incentives, and exercise entry"
                    width={6384}
                    height={3796}
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <section
          ref={sInsight2.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-impact-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight2.show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="airy-impact-heading"
                className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
              >
                The impact
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-8 sm:space-y-10">
              <FadeSlideSegment show={sInsight2.show} index={1} className="w-full">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <div className="rounded-2xl border border-black/[0.08] bg-[#fff5f7] p-6 sm:p-8">
                    <p className="font-bangla-mn text-4xl font-semibold text-[#e11d48] sm:text-5xl">36%</p>
                    <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                      more patients say the Airy app helps their doctors analyze whether a treatment plan adjustment is needed,
                      thanks to better engagement in wear time and exercise tracking.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/[0.08] bg-[#fff5f7] p-6 sm:p-8">
                    <p className="font-bangla-mn text-4xl font-semibold text-[#e11d48] sm:text-5xl">76%</p>
                    <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                      of testers could find how to check wear time, access exercise tutorials, and update scoliosis progression
                      within the first three attempts.
                    </p>
                  </div>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight2.show} index={2} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Orthopedists have limited availability, which delays addressing brace compliance until appointments months
                  later—often too late. Inspired by apps like Lemonade, I explored an AI assistant to resolve outsourceable
                  compliance issues such as discomfort that may require brace modifications.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight2.show} index={3} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project4.png"
                    alt="Airy profile and sharing compliance reports with guardian privacy options"
                    width={2304}
                    height={1012}
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <section
          ref={sInsight3.ref}
          className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="airy-usability-2-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight3.show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="airy-usability-2-heading"
                className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
              >
                Usability test 2.0
              </h2>
              <Image
                src="/airy-project3.png"
                alt="Airy maze.co usability study for the high-fidelity prototype"
                width={1659}
                height={2394}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                className="h-auto w-full object-contain"
              />
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sInsight3.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I tested the high-fidelity prototype in maze.co with eight users. Key findings: (1) users missed
                  &ldquo;notification&rdquo; when it lived under an unrelated script like privacy settings; (2) onboarding
                  pages were essential—without them, almost no one could infer the app&apos;s purpose at first glance.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight3.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/airy-project2.png"
                    alt="Airy usability test 2.0: findings on notifications, onboarding, and discoverability"
                    width={5024}
                    height={2952}
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <section
          ref={sTakeaways.ref}
          className="mt-16 mb-24 w-full min-w-0 sm:mt-20 sm:mb-32 md:mt-24 md:mb-40"
          aria-labelledby="airy-takeaways-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sTakeaways.show} index={0} className="md:pt-1">
              <h2
                id="airy-takeaways-heading"
                className="font-manrope text-xl font-medium leading-snug text-black sm:text-2xl"
              >
                Takeaways
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-8 sm:space-y-10">
              <FadeSlideSegment show={sTakeaways.show} index={1} className="w-full space-y-3">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Experience starts earlier than I thought
                </p>
                <p className="font-manrope text-sm italic leading-relaxed text-black/85 sm:text-base">
                  I once believed the user experience started with the launch screen of an app, but it truly begins much
                  earlier. It can be the first advertisement seen, initial website search, or unboxing a product. Even
                  packaging that entices users with a seamless onboarding process shapes expectations. Considering the entire
                  user journey, from awareness to advocacy, allows for a cohesive experience that helps a product stand out.
                  Designing holistically across all touchpoints creates a more impactful overall experience than just thinking
                  about the screens.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={2} className="w-full space-y-3">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Experience design follows design intent
                </p>
                <p className="font-manrope text-sm italic leading-relaxed text-black/85 sm:text-base">
                  I realize that the interface serves as a vehicle for communicating information efficiently and guiding user
                  actions in a clear, intuitive manner given hardware constraints. The goal is to direct users down a desired
                  path by prioritizing calls to action. Designers must thoughtfully utilize limited screen space to optimize
                  this experience.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={3} className="w-full space-y-3">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Typographic consistency across all interfaces
                </p>
                <p className="font-manrope text-sm italic leading-relaxed text-black/85 sm:text-base">
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
        ref={footReveal.ref}
        className="relative z-10 w-full bg-black pb-[40px] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-16 sm:pl-8 sm:pr-8 sm:pt-[107px] lg:pl-[74px] lg:pr-[min(427px,28vw)]"
      >
        <div className="flex flex-col items-start text-left">
          <FadeSlideSegment show={footReveal.show} index={0}>
            <p className="font-bangla-mn text-xl leading-normal text-white sm:text-[24px]">
              Interested in building together?
            </p>
          </FadeSlideSegment>
          <FadeSlideSegment show={footReveal.show} index={1} className="mt-4 sm:mt-2">
            <a
              href="mailto:sangyuxi@gmail.com"
              className="font-bangla-mn text-xl text-white underline underline-offset-8 transition-opacity hover:opacity-80 sm:text-[24px]"
            >
              Let&apos;s connect 
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
    </div>
  );
}
