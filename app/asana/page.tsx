"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

function CaseSection({
  title,
  children,
  reveal,
  baseIndex,
}: {
  title: string;
  children: ReactNode;
  reveal: { show: boolean };
  baseIndex: number;
}) {
  return (
    <section className="space-y-4 sm:space-y-5">
      <FadeSlideSegment show={reveal.show} index={baseIndex} className="w-full min-w-0">
        <h2 className="font-playfair text-2xl text-pretty text-black sm:text-3xl">{title}</h2>
      </FadeSlideSegment>
      <div className="space-y-4 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
        {children}
      </div>
    </section>
  );
}

type UsersPersonaTab = "operator" | "manager" | "ic";

const USERS_PERSONA_TABS: {
  id: UsersPersonaTab;
  label: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}[] = [
  {
    id: "operator",
    label: "Marketing Operator",
    src: "/asana-project20.png",
    width: 7680,
    height: 4320,
    alt: "Marketing Operator persona: how users interact with Asana project templates and settings",
  },
  {
    id: "manager",
    label: "Marketing Manager",
    src: "/asana-project19.png",
    width: 7680,
    height: 4320,
    alt: "Marketing Manager persona: how users interact with Asana project templates and settings",
  },
  {
    id: "ic",
    label: "Marketing IC",
    src: "/asana-project18.png",
    width: 8328,
    height: 4320,
    alt: "Marketing IC persona: how users interact with Asana projects and tasks",
  },
];

function HowILandedUsersTabs() {
  const [active, setActive] = useState<UsersPersonaTab>("operator");

  const current = USERS_PERSONA_TABS.find((t) => t.id === active) ?? USERS_PERSONA_TABS[0];

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        className="flex flex-wrap justify-start gap-2 sm:gap-3"
        role="tablist"
        aria-label="Marketing personas"
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
                  ? "bg-[#2563eb] text-white shadow-sm"
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
        aria-label={`${current.label} — user research`}
      >
        <div className="overflow-hidden rounded-2xl">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

type CompetitorTab = "slack" | "notion" | "monday" | "linear";

const COMPETITOR_TABS: {
  id: CompetitorTab;
  label: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}[] = [
  {
    id: "slack",
    label: "Slack",
    src: "/asana-project17.png",
    width: 7680,
    height: 4320,
    alt: "Slack: competitor settings UX — screenshots and analysis vs Asana",
  },
  {
    id: "notion",
    label: "Notion",
    src: "/asana-project16.png",
    width: 7680,
    height: 4320,
    alt: "Notion: competitor settings UX — screenshots and analysis vs Asana",
  },
  {
    id: "monday",
    label: "Monday",
    src: "/asana-project15.png",
    width: 7680,
    height: 4320,
    alt: "Monday.com: competitor settings UX — screenshots and analysis vs Asana",
  },
  {
    id: "linear",
    label: "Linear",
    src: "/asana-project14.png",
    width: 7680,
    height: 4320,
    alt: "Linear: competitor settings UX — screenshots and analysis vs Asana",
  },
];

function CompetitorOverviewTabs() {
  const [active, setActive] = useState<CompetitorTab>("slack");

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
                  ? "bg-[#3b82f6] text-white shadow-sm"
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
        aria-label={`${current.label} — competitor overview`}
      >
        <div className="overflow-hidden rounded-2xl">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function AsanaCaseStudyPage() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <header
        className={`fixed top-0 left-0 right-0 z-30 flex min-w-0 items-start justify-between gap-3 px-[max(1.25rem,env(safe-area-inset-left))] pb-4 pt-[calc(39px+env(safe-area-inset-top,0px))] pr-[max(1.25rem,env(safe-area-inset-right))] transition-[background-color,backdrop-filter,border-color] duration-300 sm:gap-4 sm:px-8 sm:pb-5 lg:pl-[54px] lg:pr-[65px] ${
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
            <Link
              href="/#work"
              className="font-manrope text-base font-normal text-black transition-opacity hover:opacity-70 sm:text-[18px] md:text-[20px]"
            >
              Work
            </Link>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={2} className="inline-flex">
            <Link
              href="/about"
              className="font-manrope text-base font-normal text-black transition-opacity hover:opacity-70 sm:text-[18px] md:text-[20px]"
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
                <h1 className="font-playfair text-[32px] font-bold leading-[1.15] text-pretty text-black">
                  Asana project settings
                </h1>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={3} className="mt-4 w-full text-left">
                <p className="font-manrope text-lg font-normal leading-snug text-black sm:text-xl">
                  Make project settings consistent across pages,
                  <br />
                  Make permissions settings easily discoverable.
                </p>
              </FadeSlideSegment>
            </div>
          </FadeSlideSegment>

          <div className="relative w-full overflow-hidden rounded-lg sm:rounded-[16px] lg:rounded-[24px]">
            <div className="relative aspect-[16/10] w-full max-h-[min(85vh,720px)]">
              <Image
                src="/cover-asana.png"
                alt="Asana project settings — case study hero"
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
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Project Context</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>FY25 Roadmap</p>
                  <p>Sharing &amp; Permission team</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sg.show} index={1} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">My Role</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>Product Designer</p>
                  <p>(UX + PM)</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={sg.show} index={2} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">Methodologies</h2>
                <div className="mt-3 space-y-1 font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  <p>Data science reports</p>
                  <p>Product specification</p>
                  <p>Wireframes</p>
                  <p>Prototype</p>
                  <p>Usability Research</p>
                </div>
              </FadeSlideSegment>
            </div>
          </section>

          <section
            ref={s1.ref}
            className="mt-16 w-full min-w-0 sm:mt-20 md:mt-24"
            aria-labelledby="asana-overview-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={s1.show} index={0} className="md:pt-1">
                <h2
                  id="asana-overview-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Overview
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-6 sm:space-y-8">
                <FadeSlideSegment show={s1.show} index={1} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    Project settings on different pages in Asana are currently <strong className="font-semibold text-black">scattered</strong>, making it hard for non-expert users to find them. This results in users being frustrated and confused, which can lead to less work being put in Asana.
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s1.show} index={2} className="w-full">
                  <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                    We believe that simplifying settings on project, portfolio, goals, and dashboard pages into an intuitive framework will make our users happier and increase usage of Asana.
                  </p>
                </FadeSlideSegment>
                <FadeSlideSegment show={s1.show} index={3} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/asana-project29.png"
                      alt="Before and after: scattered project settings consolidated into one intuitive framework"
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
            ref={sp.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="asana-problem-heading"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
              <FadeSlideSegment show={sp.show} index={0} className="md:pt-1">
                <h2
                  id="asana-problem-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Problem statement
                </h2>
              </FadeSlideSegment>
              <div className="min-w-0 space-y-4 sm:space-y-6">
                <FadeSlideSegment show={sp.show} index={1} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/asana-project28.png"
                      alt="Problem exploration — project settings context 1"
                      width={2636}
                      height={1672}
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
                <FadeSlideSegment show={sp.show} index={2} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/asana-project27.png"
                      alt="Problem exploration — project settings context 2"
                      width={2636}
                      height={1672}
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
                <FadeSlideSegment show={sp.show} index={3} className="w-full">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="/asana-project26.png"
                      alt="Problem exploration — project settings context 3"
                      width={2636}
                      height={1672}
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 6rem), 1200px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </FadeSlideSegment>
              </div>
            </div>
          </section>

          <section
            ref={sGoals.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-label="Design goals"
          >
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-8 xl:gap-12">
              <FadeSlideSegment show={sGoals.show} index={0} className="flex min-w-0 flex-col items-start text-left">
                <h2 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">
                  Design Goals <span aria-hidden>🎯</span>
                </h2>
                <p className="mt-3 max-w-[18rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  The new settings framework should be:
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sGoals.show} index={1} className="flex min-w-0 flex-col items-start text-left">
                <h3 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">
                  Scalable For New Settings
                </h3>
                <p className="mt-3 max-w-[18rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  Able to accommodate new settings as features expand
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sGoals.show} index={2} className="flex min-w-0 flex-col items-start text-left">
                <h3 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">
                  Clarity &amp; Consistency
                </h3>
                <p className="mt-3 max-w-[18rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  Consistent framework of control settings across work graph objects
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sGoals.show} index={3} className="flex min-w-0 flex-col items-start text-left">
                <h3 className="font-manrope text-lg font-bold leading-snug text-black sm:text-xl">
                  Predictability
                </h3>
                <p className="mt-3 max-w-[18rem] font-manrope text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  Place relevant settings to be proximate to each other
                </p>
              </FadeSlideSegment>
            </div>
          </section>

          <section
            ref={sf.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="asana-final-design-heading"
          >
            <FadeSlideSegment show={sf.show} index={0} className="w-full max-w-[820px] text-left">
              <h2
                id="asana-final-design-heading"
                className="font-manrope text-xl font-bold leading-snug text-[#fe6f61] sm:text-2xl"
              >
                Final design
              </h2>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                Preserve the familiar entry points for each setting. Ensure that each modal serves a distinct function.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={sf.show} index={1} className="mt-8 w-full sm:mt-10">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/asana-project25.png"
                  alt="Final design: before and after comparison of consolidated project settings and share modals in Asana"
                  width={11568}
                  height={3728}
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                  className="h-auto w-full object-contain"
                />
              </div>
            </FadeSlideSegment>
          </section>

          <section
            ref={sPam.ref}
            className="mt-14 w-full min-w-0 sm:mt-16 md:mt-20"
            aria-labelledby="asana-project-action-menu-heading"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
              <div className="min-w-0 space-y-4 text-left lg:max-w-[440px]">
                <FadeSlideSegment show={sPam.show} index={0} className="w-full">
                  <h2
                    id="asana-project-action-menu-heading"
                    className="font-manrope text-xl font-bold leading-snug text-[#fe6f61] sm:text-2xl"
                  >
                    Project action menu
                  </h2>
                  <p className="mt-4 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                    Based on data science reports, I consolidated multiple settings into &ldquo;Edit project settings&rdquo;,
                    placed frequently used actions higher and grouped similar actions together.
                  </p>
                  <p className="mt-4 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                    The proposed menu is less cluttered and easier for users to access desired actions.
                  </p>
                </FadeSlideSegment>
              </div>
              <FadeSlideSegment show={sPam.show} index={1} className="min-w-0 w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project24.png"
                    alt="Before and after comparison of the consolidated project action menu in Asana"
                    width={3096}
                    height={2552}
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
            aria-labelledby="asana-project-settings-heading"
          >
            <FadeSlideSegment show={sPset.show} index={0} className="w-full max-w-[820px] text-left">
              <h2
                id="asana-project-settings-heading"
                className="font-manrope text-xl font-bold leading-snug text-[#fe6f61] sm:text-2xl"
              >
                Project settings
              </h2>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                A modal with side nav offers scalability for settings, accommodating the expanding needs of enterprise users.
                Top search bar enables quick access to desired settings.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={sPset.show} index={1} className="mt-8 w-full sm:mt-10">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/asana-project23.gif"
                  alt="Before and after: unified project settings modal with sidebar navigation and search"
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
            aria-labelledby="asana-share-settings-heading"
          >
            <FadeSlideSegment show={sShare.show} index={0} className="w-full max-w-[820px] text-left">
              <h2
                id="asana-share-settings-heading"
                className="font-manrope text-xl font-bold leading-snug text-[#fe6f61] sm:text-2xl"
              >
                Share settings
              </h2>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-black/80 sm:text-base">
                Move the permission settings under a clear tab rather than an ambiguous icon.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={sShare.show} index={1} className="mt-8 w-full sm:mt-10">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/asana-project22.gif"
                  alt="Before and after: Share dialog with Share, Permissions, and Notifications tabs replacing gear icon and scattered controls"
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
          aria-labelledby="asana-who-users-heading"
        >
          <FadeSlideSegment show={sUsers.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <h2
                  id="asana-who-users-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Who are our users?
                </h2>
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  How do they interact with Asana project today?
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
          aria-labelledby="asana-competitor-heading"
        >
          <FadeSlideSegment show={sComp.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14">
              <div className="min-w-0 text-left">
                <h2
                  id="asana-competitor-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Competitor Overview
                </h2>
                <p className="mt-3 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I analyzed the user experience of four competitors to understand their settings&apos; frameworks, identifying
                  the strengths, weaknesses, and potential opportunities in their approaches.
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
          aria-labelledby="asana-define-solutions-heading"
        >
          <FadeSlideSegment show={sSol.show} index={0} className="w-full max-w-[920px] text-left">
            <h2
              id="asana-define-solutions-heading"
              className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
            >
              Define the solutions
            </h2>
            <p className="mt-4 font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
              To re-organize the currently scattered settings in Asana project, I started with information architecture,
              re-organized relevant settings to be on the same surface. Then I started very broad concept explorations, from
              proposing incremental changes to radical innovation.
            </p>
          </FadeSlideSegment>
          <FadeSlideSegment show={sSol.show} index={1} className="mt-8 w-full sm:mt-10">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/asana-project13.png"
                alt="Solution spectrum: from incremental hubs to radical AI-assisted settings concepts"
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
          aria-label="Three hubs and three entry points"
        >
          <FadeSlideSegment show={sHubs.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8 xl:gap-10 [&>*]:min-w-0">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/asana-tab1.png"
                  alt="Tab entry points for project settings, share, and customize in Asana"
                  width={1492}
                  height={685}
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="overflow-hidden">
              <p>Pro: Distinct entry points for distinct modals</p>
                <Image
                  src="/asana-project12.png"
                  alt="3 hubs / 3 entry points: Settings sidebar, Share modal, and Customize sidebar focused on main entry points"
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
          aria-label="Solution exploration — duo hubs"
        >
          <FadeSlideSegment show={sHubs2.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8 xl:gap-10 [&>*]:min-w-0">
              <div className="overflow-hidden">
                <Image
                  src="/asana-tab3.png"
                  alt="Entry points for duo hubs / two entry points concept in Asana"
                  width={1492}
                  height={685}
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
              <p>Con: Downplay the hierarchy of Share modal</p>
                <Image
                  src="/asana-project11.png"
                  alt="Duo hubs solution: two entry points with focused modals and flows"
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
          aria-label="Solution exploration — single modal"
        >
          <FadeSlideSegment show={sHubs3.show} index={0} className="w-full">
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8 xl:gap-10 [&>*]:min-w-0">
              <div className="overflow-hidden">
                <Image
                  src="/asana-tab2.png"
                  alt="Entry points for single modal / consolidated settings concept in Asana"
                  width={1492}
                  height={683}
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/asana-project10.png"
                  alt="Single modal solution: all-in-one settings with shared entry points"
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
          aria-labelledby="asana-information-architecture-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sIA.show} index={0} className="md:pt-1">
              <h2
                id="asana-information-architecture-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Information Architecture
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sIA.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  At the end of my solution explorations, the Project icon, Project action menu, Share button, and Customize
                  button continue to serve as the 4 entry points for all settings on the project page. Especially Share and
                  Customize have established a mental model for Asana users and are essential value propositions and upsell
                  features that must remain prominent.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sIA.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project9.png"
                    alt="Information architecture: four entry points and settings hierarchy diagrams with pros and cons"
                    width={7424}
                    height={3664}
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
          aria-labelledby="asana-modal-directions-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sModalDirections.show} index={0} className="md:pt-1">
              <h2
                id="asana-modal-directions-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                2 Directions For Settings Modal
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sModalDirections.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  These 2 treatments then went through usability test.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sModalDirections.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project8.png"
                    alt="Two directions for project settings: flyout versus modal concepts with pros and cons"
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
          aria-labelledby="asana-usability-test-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sUsability.show} index={0} className="md:pt-1">
              <div className="min-w-0 text-left">
                <h2
                  id="asana-usability-test-heading"
                  className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
                >
                  Usability Test
                </h2>
                <p className="mt-2 font-manrope text-sm text-[#666666] sm:text-[15px]">
                  Usability tests for 15 users conducted on 8/14/24
                </p>
              </div>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sUsability.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  I conducted an unmoderated usability test of the high-fidelity prototype with the assistance of the UXR
                  team, involving a randomly selected group of 15 project managers.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sUsability.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project7.png"
                    alt="Usability test results: participant heatmap for prototype A, B, and C across Customize, Share, and project settings observations"
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
          aria-labelledby="asana-usability-insight-1-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight1.show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="asana-usability-insight-1-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Usability Test Insight #1
              </h2>
              <Image
                src="/asana-project5.png"
                alt="Usability insight 1: supplementary figure for project title and project details entry"
                width={2304}
                height={1012}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                className="h-auto w-full object-contain"
              />
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sInsight1.show} index={1} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Users click the project title to change project details because they are less likely to navigate through
                  multiple menu layers to find them.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight1.show} index={2} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project6.png"
                    alt="Usability insight: behaviors around project title versus action menu, and proposed project settings entry from Edit project settings to Project details"
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
          aria-labelledby="asana-usability-insight-2-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight2.show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="asana-usability-insight-2-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Usability Test Insight #2
              </h2>
               <Image
                src="/asana-project1.png"
                alt="Usability insight 3: supplementary figure for custom fields and Customize permissions"
                width={1659}
                height={2394}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                className="h-auto w-full object-contain"
              />
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sInsight2.show} index={1} className="w-full">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Don&apos;t know where to change permission inside share modal
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight2.show} index={2} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Participants struggled to find permission settings in the Share modal—many missed the control or used Access
                  settings by mistake. A text-based tab for Permissions improves discoverability versus an ambiguous icon alone.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight2.show} index={3} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project4.png"
                    alt="Usability insight 2: sticky-note feedback, behaviors and implications, and Today versus Proposed Share modal with Share, Permissions, and Notifications tabs"
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
          aria-labelledby="asana-usability-insight-3-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sInsight3.show} index={0} className="flex flex-col gap-2 md:pt-1">
              <h2
                id="asana-usability-insight-3-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Usability Test Insight #3
              </h2>
              <Image
                src="/asana-project1.png"
                alt="Usability insight 3: supplementary figure for custom fields and Customize permissions"
                width={1659}
                height={2394}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) calc(100vw - 2.5rem), 1440px"
                className="h-auto w-full object-contain"
              />
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sInsight3.show} index={1} className="w-full">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Don&apos;t know editing custom fields is under &apos;Customize&apos; button, and can&apos;t find where the
                  permission setting for it is at
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight3.show} index={2} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-[#666666] sm:text-base">
                  Many participants tapped fields on the project surface first; the Customize entry point and
                  &ldquo;workflow &amp; appearance&rdquo; language in permissions were easy to miss. Clearer labeling and
                  field-adjacent paths reduce confusion between editing fields and managing their permissions.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sInsight3.show} index={3} className="w-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/asana-project2.png"
                    alt="Usability insight 3: sticky notes, behaviors, implications, and proposed Project settings with Customize and Fields"
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
          className="mt-16 mb-10 w-full min-w-0 sm:mt-20 md:mt-24"
          aria-labelledby="asana-takeaways-heading"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,200px)_1fr] md:items-start md:gap-12 lg:gap-16 xl:gap-24">
            <FadeSlideSegment show={sTakeaways.show} index={0} className="md:pt-1">
              <h2
                id="asana-takeaways-heading"
                className="font-manrope text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                Takeaways
              </h2>
            </FadeSlideSegment>
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <FadeSlideSegment show={sTakeaways.show} index={1} className="w-full">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Navigate my way through constraints
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={2} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                  I initially believed I could complete this project within my internship by following the playbook. However, I
                  encountered several unexpected delays and back-and-forths. The playbook is designed to align projects with
                  broader company goals and strategies while incorporating multiple perspectives for a thorough review.
                  Despite this, everyone has their own priorities, and understanding and navigating these has become crucial.
                  Developing the ability to align with my work partners&apos; priorities while motivating them to focus on mine
                  is a skill I want to further refine.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={3} className="w-full">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Resources are finite, prioritize and strategize
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={4} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                  Resources like engineering hours, time and budget are limited. Even if we&apos;re passionate about a feature,
                  the team must prioritize the most critical ones or break it into multiple releases. My project is an
                  improvement to a larger project, but the team lacks the capacity to implement it soon due to other important
                  user stories in the pipeline. Therefore, we always need to prioritize and strategize what and when to
                  implement.
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={5} className="w-full">
                <p className="font-manrope text-base font-semibold leading-snug text-black sm:text-lg">
                  Design is a part of my job, but not all of it
                </p>
              </FadeSlideSegment>
              <FadeSlideSegment show={sTakeaways.show} index={6} className="w-full">
                <p className="font-manrope text-sm leading-relaxed text-black/90 sm:text-base">
                  I realized that design is fundamentally a leadership role. It involves working with cross-functional teams to
                  gather interests and push towards the company&apos;s goals. While design is a significant part of my job, it
                  is not all of it—collaborating with others is equally important.
                </p>
              </FadeSlideSegment>
            </div>
          </div>
        </section>

        <footer
          ref={footReveal.ref}
          className="border-t border-gray-300 pt-8 pb-20 sm:pt-12 md:pt-16"
        >
          <div className="flex min-w-0 flex-col gap-6 sm:gap-8 md:flex-row md:items-start md:justify-between">
            <FadeSlideSegment show={footReveal.show} index={0} className="min-w-0 space-y-2 md:max-w-xl">
              <h4 className="font-playfair text-[20px] font-bold uppercase leading-none text-black sm:text-[24px]">Sangyu Xi</h4>
              <p className="font-manrope text-xs leading-relaxed text-gray-600 sm:text-sm">
                Are you an engineer or an entrepreneur?<br />
                I always welcome new opportunities to exchange ideas and to explore collaborations.<br />
              </p>
              <a href="mailto:sangyuxi@gmail.com" className="inline-flex min-h-11 items-center py-1">
                <p className="font-manrope text-xs text-[#FF4500] sm:text-sm">Let&apos;s connect!</p>
              </a>
            </FadeSlideSegment>
            <FadeSlideSegment show={footReveal.show} index={1} className="min-w-0 space-y-2 md:shrink-0">
              <h4 className="font-manrope text-sm font-bold text-[#000000] sm:text-base">Email</h4>
              <p className="break-all font-manrope text-xs text-[#FF4500] sm:text-sm">sangyuxi@gmail.com</p>
              <h4 className="mt-4 font-manrope text-sm font-bold text-[#000000] sm:text-base">Phone</h4>
              <p className="font-manrope text-xs text-gray-600 sm:text-sm">
                <a href="tel:+15136380161" className="hover:text-black">
                  5136380161
                </a>
              </p>
            </FadeSlideSegment>
          </div>
          <FadeSlideSegment show={footReveal.show} index={3} className="mt-6 sm:mt-8">
            <p className="font-manrope text-xs text-gray-500">
              Copyright &copy; 2026 sangyuxi.com. All rights reserved.
            </p>
          </FadeSlideSegment>
        </footer>
      </main>
    </div>
  );
}
