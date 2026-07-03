import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import "tailwindcss";

export default function Flashs({ className = "" }) {
  const images = import.meta.glob('./assets/flashs/*', { eager: true });
  const photos = Object.values(images).map((mod) => mod.default);
  const [index, setIndex] = useState(-1);

  return (
    <>
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full ${className}`}
          style={{ gridAutoRows: "250px" }}
        >
        {photos.map((src, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="cursor-pointer rounded-lg bg-neutral-900 overflow-hidden w-full h-full"
          >
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((src) => ({ src }))}
      />
    </>
  );
}