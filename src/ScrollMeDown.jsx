
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollMeDown() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const opacity = Math.max(0, 1 - window.scrollY / 1200);

      if (buttonRef.current) {
        buttonRef.current.style.opacity = opacity;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = async () => {
    const scrolls = [158, 158, 158, 158, 2780];
    const duration = 450;

    const easeInOutCubic = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (distance) =>
      new Promise((resolve) => {
        const start = window.scrollY;
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeInOutCubic(progress);

          window.scrollTo({
            top: start + distance * easedProgress,
            behavior: "instant",
          });

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }

        requestAnimationFrame(step);
      });

    for (const distance of scrolls) {
      await animateScroll(distance);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      style={{
        position: "fixed",
        top: "30%",
        right: "16%",
        color: "white",
        fontFamily: "Caudex",
        fontSize: "2em",
        opacity: 1,
        transition: "opacity 0.2s ease",
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <div className="inline-flex flex-col items-center">
        <div className="text-left">
          <div>Découvrez l'univers</div>
          <br />
          <div>d'Ypso Lehnsherr</div>
        </div>

        <div className="flex flex-col items-center -space-y-3">
          <ChevronDown size={32} />
          <ChevronDown size={32} className="opacity-70" />
        </div>
      </div>
    </button>
  );
}
