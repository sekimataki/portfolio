"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
      <div className="relative z-10 min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-20 h-[13vh] flex items-center justify-between px-12 md:px-20">
          <Link href="/">
            <h1 className="font-mazeani text-[#71767D] text-3xl md:text-4xl font-normal tracking-tight cursor-pointer hover:opacity-70 transition-opacity uppercase">
              Sangyu Xi
            </h1>
          </Link>
          <Link href="/about">
            <h2 className="font-mazeani text-[#71767D] text-3xl md:text-4xl font-normal tracking-tight uppercase cursor-pointer hover:opacity-70 transition-opacity">
              About
            </h2>
          </Link>
        </header>

        <div className="pt-32 pb-20 px-8 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8">
              <h2 className="font-mazeani text-[#71767D] text-5xl md:text-6xl leading-tight">
                Hello,<br />I'm Sangyu.
              </h2>

              <div className="space-y-6 font-montserrat text-[#71767D] text-base leading-relaxed">
                <p>
                  "Sangyu(桑榆)" comes from a Chinese ancient poem, meaning "sunset" in the poem. It suggests that if one sees something at the sunrise, she will gain something else at the sunset. Symbolically, it represents the diversity and nuances that color the lived experience of my journey.
                </p>

                <p>
                  I'm an industrial designer who has spent the past ten years in the U.S. Passionate about culture and languages, I've also backpacked to 30+ countries, lived in Mandarin, English, and Japanese.
                </p>

                <p>
                  Actively engaged in the intersection among Design, Engineering, and Business, I found my way to Master in Design Engineering@Harvard University. At Harvard, I teach team and discuss about <span className="font-bold">Design for Tech</span> at Harvard SEAS and MIT Sloan.
                </p>
              </div>

              <div className="flex gap-8 items-center pt-4">
                <a href="https://www.linkedin.com/in/sangyuxi/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-8 h-8" fill="#71767D" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex justify-center items-start">
              <div className="w-80 h-80 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 font-mazeani text-xl">Profile Photo</div>
              </div>
            </div>
          </div>

          <div className="mt-20 space-y-16">
            <section>
              <h3 className="font-mazeani text-[#71767D] text-3xl mb-6">Education</h3>
              <div className="space-y-6 font-montserrat text-[#71767D]">
                <div>
                  <h4 className="font-bold text-lg">Harvard - MS. Design Engineering</h4>
                  <p className="text-sm text-gray-600">2023 - 2025</p>
                  <p className="text-sm">Design Strategy, Data Science</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">MIT Sloan - Cross-registered</h4>
                  <p className="text-sm text-gray-600">2024 - 2025</p>
                  <p className="text-sm">Marketing, Game Theory</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">University of Cincinnati - BS. Industrial Design</h4>
                  <p className="text-sm text-gray-600">2017 - 2022</p>
                  <p className="text-sm">Industrial Design, Mechanical engineering, Psychology, Film Art</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-mazeani text-[#71767D] text-3xl mb-6">Awards & Recognition</h3>
              <div className="space-y-4 font-montserrat text-[#71767D]">
                <div>
                  <h4 className="font-bold">VP Content & Operations of MIT Product & Tech conference</h4>
                  <p className="text-sm text-gray-600">2025 - Worked with a team of 60 to plan a 300+ attendee conference.</p>
                </div>
                <div>
                  <h4 className="font-bold">Third Place at MIT Product Hackathon</h4>
                  <p className="text-sm text-gray-600">2024 - Placed top 3 place among 80 Harvard and MIT students for competitive entries. (sponsored by Google)</p>
                </div>
                <div>
                  <h4 className="font-bold">Global Grad Show at Dubai Design Week</h4>
                  <p className="text-sm text-gray-600">2022 - Has hosted 50+ APJ design schools</p>
                </div>
                <div>
                  <h4 className="font-bold">James Dyson Award International Winner & Global Top 20</h4>
                  <p className="text-sm text-gray-600">2022 - Placed top 20 / 2000 entries internationally</p>
                </div>
                <div>
                  <h4 className="font-bold">Industrial Design Society of America Student Merit Award Winner</h4>
                  <p className="text-sm text-gray-600">2022 - Awarded as one of the top 5 undergraduate design students nationwide for the Class of 2023, representing the Central District of the US.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-mazeani text-[#71767D] text-3xl mb-6">My reading list</h3>
              <div className="space-y-3 font-montserrat text-[#71767D]">
                <div>
                  <h4 className="font-bold">The Almanack Of Naval Ravikant</h4>
                  <p className="text-sm text-gray-600">by Eric Jorgenson</p>
                </div>
                <div>
                  <h4 className="font-bold">Creative Power</h4>
                  <p className="text-sm text-gray-600">by Jeffrey Selingo</p>
                </div>
                <div>
                  <h4 className="font-bold">Inspired: How to Create Tech Products Customers Love</h4>
                  <p className="text-sm text-gray-600">by Marty Cagan</p>
                </div>
                <div>
                  <h4 className="font-bold">A New Earth: Awakening Your Life's Purpose</h4>
                  <p className="text-sm text-gray-600">by Eckhart Tolle</p>
                </div>
                <div>
                  <h4 className="font-bold">Psycho-Cybernetics</h4>
                  <p className="text-sm text-gray-600">by Maxwell Maltz</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-20 pt-12 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-2">
                <h4 className="font-mazeani text-[#71767D] text-2xl uppercase">Sangyu Xi</h4>
                <p className="font-montserrat text-sm text-gray-600">
                  Are you an engineer or an entrepreneur?<br />
                  I always welcome new opportunities to exchange ideas and to explore collaborations.<br />
                </p>
                <a href="mailto:sangyuxi@gmail.com">
                <p className="font-montserrat text-sm text-[#FF4500]">Let's connect!</p>
                </a>
              </div>
              <div className="space-y-2">
                <h4 className="font-montserrat font-bold text-[#71767D]">Email</h4>
                <p className="font-montserrat text-sm text-[#FF4500]">sangyuxi@gmail.com</p>
                <h4 className="font-montserrat font-bold text-[#71767D] mt-4">Phone</h4>
                <p className="font-montserrat text-sm text-gray-600">5136380161</p>
              </div>
            </div>
            <div className="flex gap-8 items-center mt-8">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="#71767D" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
            <p className="font-montserrat text-xs text-gray-500 mt-8">
              Copyright © 2026 sangyuxi.com. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
        