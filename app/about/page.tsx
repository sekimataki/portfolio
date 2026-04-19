"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

export default function About() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const foldShow = useRevealOnMount();

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
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

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 pb-12 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:px-16 md:pb-20 md:pt-32">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 md:gap-16">
          <FadeSlideSegment
            show={foldShow}
            index={3}
            className="order-1 flex shrink-0 justify-center items-start md:order-2"
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

          <div className="order-2 space-y-6 sm:space-y-8 md:order-1">
            <FadeSlideSegment show={foldShow} index={4} className="w-full">
            <h2 className="font-playfair text-3xl leading-tight text-[#000000] sm:text-4xl md:text-5xl lg:text-6xl">
                Hello,
                <br />
                I&apos;m <span className="italic">Sangyu</span>
              </h2>
            </FadeSlideSegment>

            <FadeSlideSegment show={foldShow} index={5} className="w-full">
              <p className="font-manrope text-sm leading-relaxed text-[#71767D] sm:text-base">
                &ldquo;Sangyu(桑榆)&rdquo; comes from a Chinese ancient poem, meaning &ldquo;Sunset&rdquo;. In the poem, it suggests that if one loses something at the sunrise, she will gain something else at the sunset. Growing up, I embraced an adventurous spirit, always prioritizing the richness of experience of my journey.
              </p>
            </FadeSlideSegment>

            <FadeSlideSegment show={foldShow} index={6} className="w-full">
              <p className="font-manrope text-sm leading-relaxed text-[#71767D] sm:text-base">
                Born and raised in China, I worked in Japan in 2019 and have spent the past ten years in the U.S. Passionate about culture and languages, I&apos;ve solo backpacked to 15 countries, fluent in Mandarin, English, and Japanese.
              </p>
            </FadeSlideSegment>

            <FadeSlideSegment show={foldShow} index={7} className="w-full">
              <p className="font-manrope text-sm leading-relaxed text-[#71767D] sm:text-base">
                Actively engaged in the intersection among Design, Engineering and Business, I found my way to Master in Design Engineering@Harvard University. At Harvard, I listen, learn and discuss about{" "}
                <span className="font-bold">Design for Tech</span> at Harvard SEAS and MIT Sloan.
              </p>
            </FadeSlideSegment>

            <FadeSlideSegment show={foldShow} index={8} className="flex items-center gap-8 pt-4">
              <a
                href="https://www.linkedin.com/in/sangyuxi/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:text-[#000000] hover:opacity-70"
              >
                <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="#71767D" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </FadeSlideSegment>
          </div>
        </div>

        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12 md:mt-20 md:space-y-16">
          <section>
            <FadeSlideSegment show={foldShow} index={9} className="w-full">
              <h3 className="mb-4 font-playfair text-2xl text-[#000000] sm:mb-6 sm:text-3xl">Education</h3>
            </FadeSlideSegment>
            <div className="space-y-4 font-manrope text-[#71767D] sm:space-y-6">
              <FadeSlideSegment show={foldShow} index={10} className="w-full">
                <div>
                  <h4 className="text-base font-bold sm:text-lg">Harvard - MS. Design Engineering</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2023 - 2025</p>
                  <p className="text-xs sm:text-sm">Design Strategy, Data Science</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={11} className="w-full">
                <div>
                  <h4 className="text-base font-bold sm:text-lg">MIT Sloan - Cross-registered</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2024 - 2025</p>
                  <p className="text-xs sm:text-sm">Marketing, Game Theory</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={12} className="w-full">
                <div>
                  <h4 className="text-base font-bold sm:text-lg">University of Cincinnati - BS. Industrial Design</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2017 - 2022</p>
                  <p className="text-xs sm:text-sm">Industrial Design, Mechanical engineering, Psychology, Film Art</p>
                </div>
              </FadeSlideSegment>
            </div>
          </section>

          <section>
            <FadeSlideSegment show={foldShow} index={13} className="w-full">
              <h3 className="mb-4 font-playfair text-2xl text-[#000000] sm:mb-6 sm:text-3xl">Awards & Recognition</h3>
            </FadeSlideSegment>
            <div className="space-y-4 font-manrope text-[#71767D]">
              <FadeSlideSegment show={foldShow} index={14} className="w-full">
                <div>
                  <h4 className="text-sm font-bold sm:text-base">VP Content & Operations of MIT Product & Tech conference</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2025 - Worked with a team of 50 to plan a 300+ attendee conference.</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={15} className="w-full">
                <div>
                  <h4 className="text-sm font-bold sm:text-base">Third Place at MIT Product Hackathon</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2024 - Placed 3rd place among 30 Harvard and MIT competitive entries. (Sponsored by Google)</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={16} className="w-full">
                <div>
                  <h4 className="text-sm font-bold sm:text-base">Global Grad Show at Dubai Design Week</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2022 - Placed top 100 / 2000 design entries.</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={17} className="w-full">
                <div>
                  <h4 className="text-sm font-bold sm:text-base">James Dyson Award International Winner & Global Top 20</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">2022 - Placed top 20 / 1650 entries internationally.</p>
                </div>
              </FadeSlideSegment>
              <FadeSlideSegment show={foldShow} index={18} className="w-full">
                <div>
                  <h4 className="text-sm font-bold sm:text-base">Industrial Design Society of America Student Merit Award Winner</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    2022 - Awarded as one of the top 5 undergraduate design students nationwide for the Class of 2022, representing the Central District of the U.S.
                  </p>
                </div>
              </FadeSlideSegment>
            </div>
          </section>
        </div>

        <footer className="mt-12 border-t border-gray-300 pt-8 sm:mt-16 sm:pt-12 md:mt-20">
          <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 md:flex-row md:items-center">
            <FadeSlideSegment show={foldShow} index={19} className="w-full space-y-2 md:max-w-xl">
              <h4 className="font-playfair text-[20px] font-bold uppercase leading-none text-black sm:text-[24px]">Sangyu Xi</h4>
              <p className="font-manrope text-xs text-gray-600 sm:text-sm">
                Are you an engineer or an entrepreneur?
                <br />
                I always welcome new opportunities to exchange ideas and to explore collaborations.
                <br />
              </p>
              <a href="mailto:sangyuxi@gmail.com">
                <p className="font-manrope text-xs text-[#FF4500] sm:text-sm">Let&apos;s connect!</p>
              </a>
            </FadeSlideSegment>
            <FadeSlideSegment show={foldShow} index={20} className="w-full space-y-2 md:w-auto">
              <h4 className="font-manrope text-sm font-bold text-[#71767D] sm:text-base">Email</h4>
              <p className="font-manrope text-xs text-[#FF4500] sm:text-sm">sangyuxi@gmail.com</p>
              <h4 className="mt-4 font-manrope text-sm font-bold text-[#71767D] sm:text-base">Phone</h4>
              <p className="font-manrope text-xs text-gray-600 sm:text-sm">5136380161</p>
            </FadeSlideSegment>
          </div>
          <FadeSlideSegment show={foldShow} index={22} className="mt-6 w-full sm:mt-8">
            <p className="font-manrope text-xs text-gray-500">Copyright &copy; 2026 sangyuxi.com. All rights reserved.</p>
          </FadeSlideSegment>
        </footer>
      </div>
    </div>
  );
}
