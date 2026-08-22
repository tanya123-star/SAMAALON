"use client";

import { useEffect, useState } from "react";

interface ParallaxBannerProps {
  imageUrl: string;
  heightClass?: string;
  children?: React.ReactNode;
}

export function ParallaxBanner({
  imageUrl,
  heightClass = "h-[50vh] min-h-[400px]",
  children,
}: ParallaxBannerProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgTranslateY = scrollY * 0.35;

  return (
    <section className={`relative w-full ${heightClass} bg-slate-900 overflow-hidden`}>
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${bgTranslateY}px, 0)`,
          transition: "transform 0.05s linear",
        }}
      >
        <img src={imageUrl} alt="Parallax Banner" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2A28] via-[#1C2A28]/40 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end">{children}</div>
    </section>
  );
}
