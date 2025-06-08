"use client";

import { useRef, useLayoutEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const StickyHeader = ({
  children,
  initialYPos,
  additionalHeight = 0,
}: {
  initialYPos?: number;
  additionalHeight?: number;
} & React.PropsWithChildren) => {
  const lastScrollTop = useRef(0);
  const isScrollingUp = useRef(false);
  const stickyTranslateYRef = useRef(
    initialYPos === undefined ? 0 : initialYPos,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const st = document?.documentElement.scrollTop;
      if (st > lastScrollTop.current) {
        isScrollingUp.current = false;
      } else isScrollingUp.current = true;

      const diff = lastScrollTop.current - st;
      if (!containerRef.current) return;

      stickyTranslateYRef.current = Number(
        Math.min(
          initialYPos ?? 0,
          Math.max(
            (stickyTranslateYRef.current += diff * 0.35), //Multiplier here
            containerRef.current.getBoundingClientRect().height * -1 -
              additionalHeight,
          ),
        ).toFixed(2),
      );

      lastScrollTop.current = st;

      const newYPos = stickyTranslateYRef.current;

      return (containerRef.current.style.transform = `translateY(${newYPos}px)`);
    };

    if (!spacerRef.current || !containerRef.current) return;
    spacerRef.current.style.height =
      containerRef.current.getBoundingClientRect().height + "px";
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initialYPos, isMobile, additionalHeight]);

  if (!isMobile) return <>{children}</>;

  return (
    <>
      <div className="w-full" ref={spacerRef} />
      <div ref={containerRef} className="fixed top-0 left-0 w-full h-fit z-50">
        {children}
      </div>
    </>
  );
};
