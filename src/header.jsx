import { useEffect, useRef } from "react";

export default function Header() {
  const imageRefs = useRef([]);

  const images = [
    "/big.webp",
    "/big2.webp",
    "/thumb (2).webp",
    "/thumb (3).webp",
    "/thumb (5).webp",
    "/thumb (6).webp",
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      imageRefs.current.forEach((img, index) => {
        if (!img) return;

        const rawOffset = scroll - index * 500;

        // on évite les valeurs négatives
        const progress = Math.max(rawOffset, 0);

        // 👉 chaque image démarre plus à droite que la précédente
        const startX = 300 + index * 120;

        const translateX = startX - progress * 0.8;
        const translateY = -progress * 0.4 - 80;

        const scale = Math.max(1.15 - progress * 0.0003, 1);
        const opacity = Math.max(1 - progress / 600, 0);

        img.style.transform = `
          translate(${translateX}px, ${translateY}px)
          scale(${scale})
        `;

        img.style.opacity = opacity;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className="h-screen overflow-hidden relative">
      {images.map((src, index) => (
        <img
          key={src}
          ref={(el) => (imageRefs.current[index] = el)}
          src={src}
          alt={`Hero ${index + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: index === 0 ? 1 : 0,
            WebkitMaskImage:
              "linear-gradient(to bottom, black 30%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white" />
      <div className="relative z-0 flex h-full items-center px-12" />
    </header>
  );
}