"use client";

import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeNavLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hashIndex = href.indexOf("#");
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex) || "/";
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (pathname !== path || !hash) return;
    event.preventDefault();
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({
      behavior: readPrefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", hash);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
