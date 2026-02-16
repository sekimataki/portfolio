"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 }); // Slow-moving gradient (long tail)
  const [highlightPosition, setHighlightPosition] = useState({ x: 50, y: 50 }); // Fast-moving highlight
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

  // Smooth lerp/easing for gradient positions with different speeds
  useEffect(() => {
    const updateGradientPosition = () => {
      const targetX = (mousePosition.x / window.innerWidth) * 100;
      const targetY = (mousePosition.y / window.innerHeight) * 100;
      
      // Fast easing for highlight (0.15) - follows cursor closely
      setHighlightPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * 0.1;
        const newY = prev.y + (targetY - prev.y) * 0.1;
        return { x: newX, y: newY };
      });

      // Slow easing for background gradient (0.05) - creates long tail
      setGradientPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * 0.02;
        const newY = prev.y + (targetY - prev.y) * 0.02;
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
    <div className="relative h-screen w-full overflow-hidden bg-[#F9F8F8]">
      {/* Slow-moving background gradient (long tail) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #FBD8C9 15%, #FBE4BE 45%, #F6F5F4 80%)`,
        }}
      />
      
      {/* Fast-moving highlight gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(circle at ${highlightPosition.x}% ${highlightPosition.y}%, #FBD5C1 0%, transparent 20%)`,
        }}
      />

      {/* Top navigation */}
      <div className="absolute top-12 left-0 right-0 flex justify-between items-center px-20 z-10">
        <h1 className="font-mazeani text-[#6C6C6C] text-5xl font-normal tracking-tight">
          Sangyu Xi
        </h1>
        <h2 className="font-mazeani text-[#6C6C6C] text-5xl font-normal tracking-tight">
          About
        </h2>
      </div>

      {/* Center hero text */}
      <div className="absolute top-0 left-0 right-0 bottom-[265px] flex items-center justify-center z-10">
        <div className="font-montserrat font-regular text-[#F9F8F8] text-4xl leading-[100px] tracking-[40px] uppercase text-left">
          <p className="mb-0">DESIGN</p>
          <p className="mb-0">FOR/WITH</p>
          <p className="mb-0">AI</p>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[265px] border-t border-white/30 z-10"
        style={{
          backdropFilter: "blur(80px) saturate(80%)",
          WebkitBackdropFilter: "blur(80px) saturate(80%)",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="flex justify-between items-start px-20 pt-16">
          {/* Left section - About me */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mazeani text-[#6C6C6C] text-5xl font-normal">
              Product Designer
            </h3>
            <div className="font-montserrat font-medium text-[#6C6C6C] text-xl leading-relaxed">
              <p className="mb-1">
                Design AI Teammates at{" "}
                <a
                  href="https://asana.com/product/ai/ai-teammates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline transition-all"
                >
                  Asana
                </a>
              </p>
              <p className="mb-1">
                Master in Design Engineering at{" "}
                <a
                  href="https://mde.harvard.edu/sangyu-xi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline transition-all"
                >
                  Harvard
                </a>
              </p>
              <p className="mb-0 font-medium">
                Passionate about designing for AI-powered SaaS products
              </p>
            </div>
          </div>

          {/* Right section - Project navigation */}
          <div className="font-mazeani text-[#6C6C6C] text-[40px] leading-[60px] font-normal flex flex-col gap-8 pt-2">
            <p className="mb-0">01 Airy</p>
            <p className="mb-0">02 Asana</p>
          </div>
        </div>
      </div>
    </div>
  );
}
