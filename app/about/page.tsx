"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

export default function About() {
  const foldShow = useRevealOnMount();
  const footReveal = useRevealOnScroll<HTMLElement>();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <header
        className="fixed top-0 left-0 right-0 z-30 flex min-w-0 items-start justify-between gap-3 bg-transparent pb-4 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[calc(39px+env(safe-area-inset-top,0px))] sm:gap-4 sm:pb-5 sm:pl-8 sm:pr-8 lg:pl-[56px] lg:pr-[65px]"
      >
        <FadeSlideSegment show={foldShow} index={0} className="flex min-w-0 items-center gap-2">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <h1 className="font-bangla-mn text-[20px] font-medium uppercase text-black sm:text-[24px]">
              Sangyu Xi
            </h1>
          </Link>
        </FadeSlideSegment>
        <nav className="mt-[5px] flex shrink-0 items-center gap-5 capitalize sm:gap-8 md:gap-10 lg:gap-[60px]">
          <FadeSlideSegment show={foldShow} index={1} className="inline-flex">
            <HomeNavLink
              href="/#asana-project-settings"
              className="font-manrope text-base font-medium text-black transition-colors hover:text-black/90 sm:text-[20px]"
            >
              Work
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={2} className="inline-flex">
            <HomeNavLink
              href="/#featured-on"
              className="font-manrope text-base font-medium text-black transition-colors hover:text-black/90 sm:text-[20px]"
            >
              Featured
            </HomeNavLink>
          </FadeSlideSegment>
          <FadeSlideSegment show={foldShow} index={3} className="inline-flex">
            <Link
              href="/about"
              className="font-manrope text-base font-medium text-black transition-colors hover:text-black/90 sm:text-[20px] "
            >
              About
            </Link>
          </FadeSlideSegment>
        </nav>
      </header>

      <div className="relative z-10 mx-auto min-h-screen w-full min-w-0 max-w-7xl pb-12 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[calc(6rem+env(safe-area-inset-top,0px))] sm:pb-16 sm:pl-8 sm:pr-8 sm:pt-28 md:px-16 md:pb-20 md:pt-32">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 md:gap-16">
          <FadeSlideSegment
            show={foldShow}
            index={3}
            className="order-1 flex min-w-0 shrink-0 items-start justify-center md:order-2"
          >
            <div className="h-48 w-48 overflow-hidden sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
              <Image
                src="/about-profile.png"
                alt="Sangyu Xi profile"
                width={320}
                height={320}
                className="h-full w-full object-cover"
                style={{ borderRadius: "2000px" }}
                priority
              />
            </div>
          </FadeSlideSegment>

          <div className="order-2 min-w-0 space-y-6 sm:space-y-8 md:order-1">
            <FadeSlideSegment show={foldShow} index={4} className="w-full min-w-0">
            <h2 className="font-bangla-mn text-3xl leading-tight text-pretty text-[#000000] sm:text-4xl md:text-5xl lg:text-6xl">
                Hello,
                <br />
                I&apos;m <span className="italic">Sangyu</span>
              </h2>
            </FadeSlideSegment>

            <FadeSlideSegment show={foldShow} index={6} className="w-full">
              <p className="font-manrope text-sm leading-relaxed text-[#000000] sm:text-base">
                Every major computing shift changes how humans collaborate:
                <br />
                Personal computers changed documents;
                <br />
                Smartphones changed communication;
                <br />
                AI agents will change work itself.
              </p>
            </FadeSlideSegment>
            <FadeSlideSegment show={foldShow} index={7} className="w-full">
              <p className="font-manrope text-sm leading-relaxed text-[#000000] sm:text-base">
               My work explores how{" "}
                <span
                  className="font-bangla-mn text-[clamp(.5rem,2vw,1.25rem)] italic"
                >
                  humans
                </span>{" "}
                and autonomous{" "}
                <span
                  className="font-bangla-mn text-[clamp(.5rem,2vw,1.25rem)] italic"
                >
                  agents
                </span>{" "}
                collaborate, delegate, build trust, and accomplish more together.
              </p>
            </FadeSlideSegment>

          <FadeSlideSegment show={foldShow} index={9} className="flex gap-2 pt-4">
          <a
                href="https://www.linkedin.com/in/sangyuxi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black px-8 py-3 font-manrope text-sm font-medium text-white transition-opacity hover:opacity-80 sm:px-10 sm:py-3.5 sm:text-base"
              >
                Linkedin
              </a>
              <a
                href="https://drive.google.com/file/d/1iNzWgRB9CnThwg9L5a2vhXtQhlASznpK/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black px-8 py-3 font-manrope text-sm font-medium text-white transition-opacity hover:opacity-80 sm:px-10 sm:py-3.5 sm:text-base"
              >
                Résumé
              </a>
            </FadeSlideSegment>
          </div>
        </div>

        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12 md:mt-20 md:space-y-16">
          <section>
            <FadeSlideSegment show={foldShow} index={10} className="w-full min-w-0">
              <h3 className="mb-4 font-bangla-mn text-2xl text-pretty text-[#000000] sm:mb-6 sm:text-3xl">Education</h3>
            </FadeSlideSegment>
            <div className="space-y-4 font-manrope text-[#000000] sm:space-y-6">
              <FadeSlideSegment show={foldShow} index={11} className="w-full">
                <div>
                  <h4 className="break-words text-base font-bold sm:text-lg">Harvard - MS. Design Engineering</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2023 - 2025</p>
                  <p className="text-xs sm:text-sm">Design Strategy, Data Science</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={12} className="w-full">
                <div>
                  <h4 className="break-words text-base font-bold sm:text-lg">MIT Sloan - Cross-registered</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2024 - 2025</p>
                  <p className="text-xs sm:text-sm">Marketing, Game Theory</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={13} className="w-full">
                <div>
                  <h4 className="break-words text-base font-bold sm:text-lg">University of Cincinnati - BS. Industrial Design</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2017 - 2022</p>
                  <p className="text-xs sm:text-sm">Industrial Design, Mechanical engineering, Psychology, Film Art</p>
                </div>
              </FadeSlideSegment>
            </div>
          </section>

          <section>
            <FadeSlideSegment show={foldShow} index={14} className="w-full min-w-0">
              <h3 className="mb-4 font-bangla-mn text-2xl text-pretty text-[#000000] sm:mb-6 sm:text-3xl">Awards & Recognition</h3>
            </FadeSlideSegment>
            <div className="space-y-4 font-manrope text-[#000000]">
              <FadeSlideSegment show={foldShow} index={15} className="w-full">
                <div>
                  <h4 className="break-words text-sm font-bold sm:text-base">VP Content & Operations of MIT Product & Tech conference</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2025 - Worked with a team of 50 to plan a 300+ attendee conference.</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={16} className="w-full">
                <div>
                  <h4 className="break-words text-sm font-bold sm:text-base">Third Place at MIT Product Hackathon</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2024 - Placed 3rd place among 30 Harvard and MIT competitive entries. (Sponsored by Google)</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={17} className="w-full">
                <div>
                  <h4 className="break-words text-sm font-bold sm:text-base">Global Grad Show at Dubai Design Week</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2022 - Placed top 100 / 2000 design entries.</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={18} className="w-full">
                <div>
                  <h4 className="break-words text-sm font-bold sm:text-base">James Dyson Award International Winner & Global Top 20</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2022 - Placed top 20 / 1650 entries internationally.</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={19} className="w-full">
                <div>
                  <h4 className="break-words text-sm font-bold sm:text-base">Industrial Design Society of America Student Merit Award Winner</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    2022 - Awarded as one of the top 5 undergraduate design students nationwide for the Class of 2022, representing the Central District of the U.S.
                  </p>
                </div>
              </FadeSlideSegment>
            </div>
          </section>
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
    </div>
  );
}
