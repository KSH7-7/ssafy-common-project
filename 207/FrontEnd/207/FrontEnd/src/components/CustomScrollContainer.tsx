"use client";

import { useEffect, useRef } from "react";

interface CustomScrollContainerProps {
  children: React.ReactNode;
}

export default function CustomScrollContainer({ children }: CustomScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // slimScroll 플러그인이 전역(window)에 있다면 초기화합니다.
    if (containerRef.current && typeof (window as any).slimScroll === "function") {
      new (window as any).slimScroll(containerRef.current, {
        wrapperClass: "scroll-wrapper unselectable mac",
        scrollBarContainerClass: "scrollBarContainer",
        scrollBarContainerSpecialClass: "animate",
        scrollBarClass: "scroll",
      });
    }
  }, []);

  return (
    <div className="slimScroll" ref={containerRef}>
      {children}
    </div>
  );
} 