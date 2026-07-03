import { useEffect, useRef } from "react";
import useActiveSection from './Nav.jsx';
import './index.css'

export default function SlideBar({ className = "" }) {
  const itemsRef = useRef([]);

  const items = [
    { label: "Propose ton projet", id: "projet" },
    { label: "Flashs", id: "flashs" },
    { label: "Galerie", id: "galerie" },
    { label: "Informations", id: "informations" },
  ];

  const activeId = useActiveSection(items.map((item) => item.id));

  const ANIM_HEIGHT  = 0.15;
  const LINE_HEIGHT  = 80;
  const PADDING_LEFT = 64;
  const PADDING_TOP  = 64;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY    = window.scrollY;
      const animHeight = window.innerHeight * ANIM_HEIGHT;
      const vh         = window.innerHeight;

      itemsRef.current.forEach((el, i) => {
        if (!el) return;

        const progress = Math.min(
          Math.max((scrollY - i * animHeight) / animHeight, 0),
          1
        );

        const elWidth  = el.offsetWidth;
        const elHeight = el.offsetHeight;

        const endX = PADDING_LEFT - window.innerWidth / 2;
        const endY = PADDING_TOP + i * LINE_HEIGHT - vh / 2;

        const startX = -elWidth / 2;
        const startY = -elHeight / 2;

        const scale      = 0.8 + progress * 0.2;
        const currentX   = startX + progress * (endX - startX);
        const currentY   = startY + progress * (endY - startY);

        el.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        el.style.opacity   = progress;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ minHeight: `${items.length * ANIM_HEIGHT * 100 + 100}vh` }}
    >
      {items.map((item, i) => (
    <h4
      key={i}
      ref={(el) => (itemsRef.current[i] = el)}
      onClick={() => scrollToSection(item.id)}
      className={`text-6xl will-change-transform whitespace-nowrap transition-all ${
        activeId === item.id ? "font-bold" : "font-normal"
      }`}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(0.8)",
        opacity: 0,
        cursor: "pointer",
        userSelect: "none", // empêche aussi la sélection de texte au clic
      }}
    >
      {item.label}
    </h4>
      ))}
    </div>
  );
}