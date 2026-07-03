import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

export default function Gallery({ className = "" }) {
  const images = import.meta.glob('./assets/photos/*', { eager: true });
  const photos = Object.values(images).map((mod) => mod.default);
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div
        className={`grid gap-3 ${className}`}
        style={{ gridTemplateColumns: "repeat(3, 250px)" }}
      >
        {photos.map((src, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="cursor-pointer rounded-lg bg-neutral-900 overflow-hidden"
            style={{ width: "250px", height: "250px" }}
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
