"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [highlightPosition, setHighlightPosition] = useState({ x: 50, y: 50 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateGradientPosition = () => {
      const targetX = (mousePosition.x / window.innerWidth) * 100;
      const targetY = (mousePosition.y / window.innerHeight) * 100;
      
      setHighlightPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * 0.15;
        const newY = prev.y + (targetY - prev.y) * 0.15;
        return { x: newX, y: newY };
      });

      setGradientPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * 0.05;
        const newY = prev.y + (targetY - prev.y) * 0.05;
        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(updateGradientPosition);
    };

    animationFrameRef.current = requestAnimationFrame(updateGradientPosition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #FBD8C9 15%, #FBE4BE 45%, #F6F5F4 80%)`,
        }}
      />
      
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(circle at ${highlightPosition.x}% ${highlightPosition.y}%, #FFCAB3 0%, transparent 7.5%)`,
        }}
      />

      <div className="relative z-10 min-h-screen">
        <div className="absolute top-12 left-0 right-0 flex justify-between items-center px-12 md:px-20">
          <Link href="/">
            <h1 className="font-mazeani text-[#000000] text-3xl md:text-4xl font-normal tracking-tight cursor-pointer hover:opacity-70 transition-opacity uppercase">
              Sangyu Xi
            </h1>
          </Link>
          <h2 className="font-mazeani text-[#000000] text-3xl md:text-4xl font-normal tracking-tight uppercase">
            About
          </h2>
        </div>

        <div className="pt-32 pb-20 px-8 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8">
              <h2 className="font-mazeani text-[#FF4500] text-5xl md:text-6xl leading-tight">
                Hello,<br />I'm Sangyu.
              </h2>

              <div className="space-y-6 font-montserrat text-[#000000] text-base leading-relaxed">
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
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-8 h-8" fill="#000000" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <span className="font-mazeani text-2xl text-[#000000]">Be</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-8 h-8" fill="#000000" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
              <h3 className="font-mazeani text-[#000000] text-3xl mb-6">Education</h3>
              <div className="space-y-6 font-montserrat text-[#000000]">
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
              <h3 className="font-mazeani text-[#000000] text-3xl mb-6">Awards & Recognition</h3>
              <div className="space-y-4 font-montserrat text-[#000000]">
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
              <h3 className="font-mazeani text-[#000000] text-3xl mb-6">My reading list</h3>
              <div className="space-y-3 font-montserrat text-[#000000]">
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
                <h4 className="font-mazeani text-[#000000] text-2xl uppercase">Sangyu Xi</h4>
                <p className="font-montserrat text-sm text-gray-600">
                  Are you an engineer or an entrepreneur?<br />
                  I provide welcome new experience beyond the ideas<br />
                  at the highest educational level.
                </p>
                <p className="font-montserrat text-sm text-[#FF4500]">sangyu@sangyuxi.com</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-montserrat font-bold text-[#000000]">Email</h4>
                <p className="font-montserrat text-sm text-[#FF4500]">sangyu@sangyuxi.com</p>
                <h4 className="font-montserrat font-bold text-[#000000] mt-4">Phone</h4>
                <p className="font-montserrat text-sm text-gray-600">Available upon request</p>
              </div>
            </div>
            <div className="flex gap-8 items-center mt-8">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <span className="font-mazeani text-xl text-[#000000]">Be</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            <p className="font-montserrat text-xs text-gray-500 mt-8">
              Copyright © 2025 sangyuxi.com. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
        