import { useEffect, useRef } from "react";

export default function Header() {
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      if (imageRef1.current) {
        const translateX1 = -scroll * 0.8;
        const scale1 = Math.max(1.15 - scroll * 0.0003, 1);
        const opacity1 = Math.max(1 - scroll / 600, 0);

        imageRef1.current.style.transform = `translateX(${translateX1}px) scale(${scale1})`;
        imageRef1.current.style.opacity = opacity1;
      }

      if (imageRef2.current) {
        const scrollOffset = scroll - 600;
        const translateX2 = -scrollOffset * 0.8;
        const scale2 = Math.max(1.15 - scrollOffset * 0.0003, 1);
        const opacity2 = Math.max(1 - scrollOffset / 600, 0);

        imageRef2.current.style.transform = `translateX(${translateX2}px) scale(${scale2})`;
        imageRef2.current.style.opacity = opacity2;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="h-screen overflow-hidden relative">
      <img
        ref={imageRef1}
        src="./src/assets/big.webp"
        alt="Hero 1"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />

    <img
      ref={imageRef2}
      src="./src/assets/big2.webp"
      alt="Hero 2"
      className="absolute h-full w-full object-cover"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        transform: "translateX(200px) translateY(200px)", // Exemple : décalée de 200px à droite et 100px vers le bas
      }}
    />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white" />
      <div className="relative z-0 flex h-full items-center px-12" />
    </header>
  );
}