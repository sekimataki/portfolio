"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

const TEXT = {
  muted: "#6c6c6c",
  accent: "#fe6f61",
  cardBg: "#f5f4ed",
  nestEnlightPanel: "#F3F3ED",
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

function AccentLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-bold text-[#fe6f61] hover:underline ${className}`}
    >
      {children}
    </a>
  );
}

export default function Home() {
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">

      <header
        className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pb-5 pt-10 transition-[background-color,backdrop-filter,border-color] duration-300 sm:px-8 md:px-12 lg:px-20 ${
          headerScrolled
            ? "border-b border-black/[0.06] bg-white/75 backdrop-blur-md backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <h1 className="font-mazeani text-[#71767D] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all uppercase">
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
            <svg width="24" height="24" fill="#6c6c6c" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
        <nav className="flex items-center gap-10 capitalize sm:gap-12 md:gap-[60px]">
          <Link
            href="/#work"
            className="font-manrope text-[#6c6c6c] text-lg sm:text-xl md:text-2xl font-normal tracking-[0.5px] cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all"
          >
            Work
          </Link>
          <Link
            href="/about"
            className="font-manrope text-[#6c6c6c] text-lg sm:text-xl md:text-2xl font-normal tracking-[0.5px] cursor-pointer hover:text-[#000000] hover:opacity-70 transition-all"
          >
            About
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto max-w-[1350px] px-5 pb-24 sm:px-8 md:px-[85px]">
        {/* Hero — top inset ~40px via header pt-10; headline starts ~186px from viewport (reference) */}
        <section className="mx-auto flex max-w-[842px] flex-col items-start gap-10 pt-[112px] sm:pt-[140px] md:gap-[60px] md:pt-[186px]">
          <h2 className="font-mazeani text-[36px] font-normal leading-tight text-[#6c6c6c] sm:text-[48px] md:max-w-[562px] md:text-[64px]">
            Design for <span className="italic">humanity</span> to thrive with <span className="italic">AI</span>
          </h2>
          <div className="flex w-full flex-col font-manrope text-base font-normal leading-normal text-[#6c6c6c] sm:text-lg md:text-xl">
            <p>
              Hello, I&apos;m Sangyu, a product designer with{" "}
              <AccentLink href="https://drive.google.com/file/d/1m6Dl7iCkKMU1fXzKkmmilk1AKGV0Cj8A/view?usp=sharing">
                3 years
              </AccentLink>{" "}
              of experiences - currently designing AI Teammates at{" "}
              <AccentLink href="https://asana.com/product/ai/ai-teammates">Asana</AccentLink>, building the future of
              multi-agent collaboration.
            </p>
            <p>
              Graduated from <AccentLink href="https://mde.harvard.edu/sangyu-xi/">Harvard </AccentLink>
              Design Engineering, my passion lies at the intersection of design, business and technology. Today, that
              passion drives my work on helping humanity thrives with AI-powered products.
            </p>
          </div>
        </section>

        {/* Work featured on */}
        <div className="mt-16 flex flex-col gap-6 pt-10 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-8 md:pt-12">
          <p className="font-manrope text-lg font-normal text-[#6c6c6c] md:text-xl" style={{ color: TEXT.muted }}>
            Work featured on
          </p>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {RECOGNITION.map((item, i) => (
              <a
                key={`recognition-${i + 1}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 hover:opacity-70"
              >
                <img
                  src={item.src}
                  alt=""
                  className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[20px] sm:h-[24px] md:h-[30px]"} w-auto object-contain`}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Work */}
        <section id="work" className="mt-14 space-y-10 md:mt-16 md:space-y-12">
          {/* Asana — full-width card */}
          <article
            className="flex flex-col overflow-hidden rounded-md md:flex-row md:items-stretch gap-[40px]"
            style={{ backgroundColor: TEXT.cardBg }}
          >
            <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-md sm:h-[320px] md:h-[418px] md:w-[45%] md:rounded-none">
              <img src="/asana-cover.png" alt="Asana project settings" className="h-full w-full object-cover" />
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-6 px-6 pb-8 pt-0 md:min-h-[418px] md:px-0 md:pb-10 md:pr-10 md:pt-10 md:pl-0">
              <div className="space-y-1">
                <h3 className="font-mazeani text-2xl font-normal text-black md:text-3xl md:leading-[1.15]">
                  Asana project settings
                </h3>
                <p className="font-montserrat text-lg font-medium uppercase leading-snug text-black/50 md:text-xl md:leading-snug">
                  2024 | UX design
                </p>
                <p className="font-montserrat text-base font-normal leading-relaxed text-black/45 md:text-lg md:leading-relaxed">
                Led the proposal to revamp Asana’s project settings hub, driving cross-surface exploration and aligning stakeholders across teams to establish a unified strategic direction.
                </p>
              </div>
              <a
                href="mailto:xisangyu@gmail.com?subject=Case%20study%20request"
                className="font-manrope text-lg font-bold text-black/50 transition-colors hover:text-black/90 md:text-xl"
              >
                Request case study
              </a>
            </div>
          </article>

          {/* Bento: Airy spans 2 rows so its height = Nest + gap + Enlight (lg+) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,45%)_minmax(0,1fr)] lg:gap-10">
            <article
              className="flex min-h-0 w-full flex-col overflow-hidden rounded-md lg:row-span-2 lg:h-full"
              style={{ backgroundColor: TEXT.cardBg }}
            >
              <div className="relative min-h-[280px] flex-1 basis-0 overflow-hidden rounded-md lg:min-h-0">
                <img
                  src="/airy-cover.png"
                  alt="Airy scoliosis monitor"
                  className="absolute inset-0 h-full w-full object-cover lg:min-h-0"
                />
              </div>
              <div className="shrink-0 space-y-1 p-6 md:p-8">
                <h3 className="font-mazeani text-2xl font-normal text-black md:text-3xl md:leading-[1.15]">
                  Airy scoliosis monitor
                </h3>
                <p className="font-montserrat text-lg font-medium uppercase leading-snug text-black/50 md:text-xl md:leading-snug">
                  2022 | UX design, strategy
                </p>
                <p className="font-montserrat text-base font-normal leading-relaxed text-black/45 md:text-lg md:leading-relaxed">
                Led the end-to-end design of an integrated physical and digital solution for scoliosis care, driving user engagement and improving brace compliance among patients.
                </p>
              </div>
            </article>

            <article className="flex min-w-0 flex-col overflow-hidden rounded-md md:flex-row md:items-stretch">
              <div className="relative h-[260px] w-full shrink-0 overflow-hidden md:h-auto md:min-h-[340px] md:w-1/2">
                <img src="/nestfit-cover.jpg" alt="Google Nest Fit" className="h-full w-full object-cover" />
              </div>
              <div
                className="flex min-w-0 flex-1 flex-col justify-center space-y-1 p-8 md:w-1/2 md:p-10 lg:p-12"
                style={{ backgroundColor: TEXT.nestEnlightPanel }}
              >
                <h3 className="font-mazeani text-2xl font-normal text-black md:text-3xl md:leading-[1.15]">
                  Google Nest Fit
                </h3>
                <p className="font-montserrat text-lg font-medium uppercase leading-snug text-black/50 md:text-xl md:leading-snug">
                  2022 | UX design
                </p>
                <p className="font-montserrat text-base font-normal leading-relaxed text-black/45 md:text-lg md:leading-relaxed">
                Designed an engaging home fitness experience, creating a product concept that motivates and sustains user participation in at-home workouts.
                </p>
              </div>
            </article>

            <article className="flex min-w-0 flex-col overflow-hidden rounded-md md:flex-row md:items-stretch">
              <div className="relative h-[260px] w-full shrink-0 overflow-hidden md:h-auto md:min-h-[340px] md:w-1/2">
                <img src="/enlight-cover.png" alt="Enlight" className="h-full w-full object-cover" />
              </div>
              <div
                className="flex min-w-0 flex-1 flex-col justify-center space-y-1 p-8 md:w-1/2 md:p-10 lg:p-12"
                style={{ backgroundColor: TEXT.nestEnlightPanel }}
              >
                <h3 className="font-mazeani text-2xl font-normal text-black md:text-3xl md:leading-[1.15]">
                  Enlight
                </h3>
                <p className="font-montserrat text-lg font-medium uppercase leading-snug text-black/50 md:text-xl md:leading-snug">
                  2024 | UX design
                </p>
                <p className="font-montserrat text-base font-normal leading-relaxed text-black/45 md:text-lg md:leading-relaxed">
                Led the design of an AI-powered accessibility tool, exploring how AI can proactively support users with visual impairments to "see" webpages.
                </p>
              </div>
            </article>
          </div>

          {/* Amimi — text left (~45%), image right (~55%), matches Nest/Enlight / reference */}
          <article className="flex flex-col overflow-hidden rounded-md md:flex-row-reverse md:items-stretch">
            <div className="relative h-[260px] w-full shrink-0 overflow-hidden md:h-auto md:min-h-[340px] md:w-[55%]">
              <img
                src="/amimi-cover.png"
                alt="Amimi"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="flex min-w-0 flex-1 flex-col justify-center gap-6 p-8 md:w-[45%] md:p-10 lg:p-12"
              style={{ backgroundColor: TEXT.nestEnlightPanel }}
            >
              <div className="space-y-1">
                <h3 className="font-mazeani text-2xl font-normal text-black md:text-3xl md:leading-[1.15]">
                  Amimi
                </h3>
                <p className="font-montserrat text-lg font-medium uppercase leading-snug text-black/50 md:text-xl md:leading-snug">
                  2025 | Vibe coding, UX design
                </p>
                <p className="font-montserrat text-base font-normal leading-relaxed text-black/45 md:text-lg md:leading-relaxed">
                Pioneered the concept of an AI-mediated group chat for couples, introducing AI therapist to support healthier communication, and built the front-end experience through Vibe Coding.
                </p>
              </div>
              <a
                href="https://www.amimi.ai/"
                className="font-manrope text-base font-bold text-black/50 transition-colors hover:text-black/90 md:text-lg"
              >
                Download app
              </a>
            </div>
          </article>
        </section>

        {/* Speaking at */}
        <section id="featured" className="mt-20 flex flex-col gap-8 pt-12 md:mt-24 md:flex-row md:items-center md:justify-between">
          <p className="font-manrope text-lg font-medium text-[#6c6c6c] md:text-xl" style={{ color: TEXT.muted }}>
            Speaking at
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {SPEAKING_LOGOS.map((item, i) => (
              <img
                key={item.src}
                src={item.src}
                alt={item.alt}
                className={`${i < 2 ? "h-[10px] sm:h-[12px] md:h-[15px]" : "h-[20px] sm:h-[24px] md:h-[30px]"} w-auto object-contain`}
              />
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-4 md:gap-6">
          {SPEECH_IMAGES.map((i) => (
            <img
              key={i}
              src={`/speech${i}.jpeg`}
              alt={`Speech${i}`}
              className="h-[180px] w-full min-w-[180px] flex-1 rounded-sm object-cover sm:max-w-[221px]"
            />
          ))}
        </div>

        <footer className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-12 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8">
              <div className="space-y-2">
                <h4 className="font-mazeani text-[#71767D] text-xl sm:text-2xl uppercase">Sangyu Xi</h4>
                <p className="font-manrope text-xs sm:text-sm text-gray-600">
                  Are you an engineer or an entrepreneur?<br />
                  I always welcome new opportunities to exchange ideas and to explore collaborations.<br />
                </p>
                <a href="mailto:sangyuxi@gmail.com">
                <p className="font-manrope text-xs sm:text-sm text-[#FF4500]">Let&apos;s connect!</p>
                </a>
              </div>
              <div className="space-y-2">
                <h4 className="font-manrope font-bold text-sm sm:text-base text-[#71767D]">Email</h4>
                <p className="font-manrope text-xs sm:text-sm text-[#FF4500]">sangyuxi@gmail.com</p>
                <h4 className="font-manrope font-bold text-sm sm:text-base text-[#71767D] mt-4">Phone</h4>
                <p className="font-manrope text-xs sm:text-sm text-gray-600">5136380161</p>
              </div>
            </div>
            <div className="flex gap-8 items-center mt-6 sm:mt-8">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#000000] hover:opacity-70 transition-all">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#71767D" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
            <p className="font-manrope text-xs text-gray-500 mt-6 sm:mt-8">
              Copyright &copy; 2026 sangyuxi.com. All rights reserved.
            </p>
          </footer>
      </div>
    </main>
  );
}
