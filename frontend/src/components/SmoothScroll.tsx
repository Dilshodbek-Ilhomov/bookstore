"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.9,
      // Engilroq easing — keskinroq tugaydi, glitch yo'q
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // data-lenis-prevent atributli elementlarda scroll'ni o'tkazib yuborish
      prevent: (node: Element) => node.hasAttribute("data-lenis-prevent"),
    });

    lenisRef.current = lenis;

    // PDF modal ochilganda Lenis'ni to'xtatish
    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();
    window.addEventListener("lenis:stop", handleStop);
    window.addEventListener("lenis:start", handleStart);

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    function update(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);
    // lagSmoothing: frame drop paytida Lenis va GSAP sync'ni saqlaydi
    gsap.ticker.lagSmoothing(200);

    return () => {
      window.removeEventListener("lenis:stop", handleStop);
      window.removeEventListener("lenis:start", handleStart);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
