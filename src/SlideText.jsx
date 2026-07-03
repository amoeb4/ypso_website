import { useEffect, useRef } from "react";
import "./index.css";

export default function SlideText({ className = "" }) {
  const itemsRef = useRef([]);

  const items = [
    "Ypso Lehnsherr",
    "Entre Blackwork et Neotrad",
    "Résidente chez Chrysalide Tattoo",
    {
      type: "location",
      text: "Angoulême",
    },
  ];

  const ANIM_HEIGHT = 0.15; // Animation d'arrivée de chaque ligne
  const SECOND_ANIM_HEIGHT = 0.5; // Animation du bloc vers le haut
  const LINE_HEIGHT = 80;
  const PADDING_RIGHT = 64;
  const TOP_PADDING = 185;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      const animHeight = window.innerHeight * ANIM_HEIGHT;
      const totalFirstAnimation = items.length * animHeight;
      const secondAnimationHeight =
        window.innerHeight * SECOND_ANIM_HEIGHT;

      // Progression du déplacement final du bloc
      const secondProgress = Math.min(
        Math.max(
          (scrollY - totalFirstAnimation) / secondAnimationHeight,
          0
        ),
        1
      );

      // Easing pour une animation plus fluide
      const ease = 1 - Math.pow(1 - secondProgress, 3);

      // Décalage vertical du bloc entier
      const blockOffsetY =
        secondProgress * (-window.innerHeight / 2 + TOP_PADDING);

      itemsRef.current.forEach((el, i) => {
        if (!el) return;

        const sectionStart = i * animHeight;

        const progress = Math.min(
          Math.max((scrollY - sectionStart) / animHeight, 0),
          1
        );

        const elWidth = el.offsetWidth;

        const endTranslatePx =
          window.innerWidth -
          PADDING_RIGHT -
          elWidth -
          window.innerWidth / 2;

        const startTranslatePx = -elWidth / 2;

        const currentTranslatePx =
          startTranslatePx +
          progress * (endTranslatePx - startTranslatePx);

        const finalY =
          i * LINE_HEIGHT -
          ((items.length - 1) * LINE_HEIGHT) / 2;

        const translateY = -50 + (1 - progress) * 5;

        const scale = 0.8 + progress * 0.2;

        el.style.position = "fixed";
        el.style.left = "50%";
        el.style.top = "50%";
        el.style.right = "auto";

        if (progress >= 1) {
          // Le premier titre reste à 1, les autres passent progressivement à 0.7
          const finalScale =
            i === 0
              ? 1
              : 1 - 0.3 * ease;

          el.style.transform = `translate(${endTranslatePx}px, ${
            finalY + blockOffsetY
          }px) scale(${finalScale})`;

          el.style.opacity = "1";
        } else {
          // Animation d'arrivée
          el.style.transform = `translate(${currentTranslatePx}px, calc(${translateY}% + ${
            progress * finalY
          }px)) scale(${scale})`;

          el.style.opacity = progress;
        }
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
    <div
      className={`relative ${className}`}
      style={{
        minHeight: `${
          (items.length * ANIM_HEIGHT + SECOND_ANIM_HEIGHT + 1) * 100
        }vh`,
      }}
    >
      {items.map((item, i) => (
        <h4
          key={i}
          ref={(el) => (itemsRef.current[i] = el)}
          className="text-6xl font-bold will-change-transform whitespace-nowrap"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.8)",
            opacity: 0,
          }}
        >
          {typeof item === "object" && item.type === "location" ? (
            <span className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
                style={{ width: "1em", height: "1em" }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              <span>{item.text}</span>
            </span>
          ) : (
            item
          )}
        </h4>
      ))}
    </div>
  );
}