"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = gsap.utils.toArray<HTMLElement>(".reveal-up");
    if (reduced) return;
    const context = gsap.context(() => {
      items.forEach((element) => gsap.fromTo(element, { y: 22, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.72, ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      }));
    });
    return () => { context.revert(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, []);
  return null;
}

