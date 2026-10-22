import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  delay?: number;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({
  text,
  className = "",
  showAsterisk = false,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const words = text.split(" ");

  return (
    <h1
      ref={containerRef}
      className={`inline-flex flex-wrap items-baseline select-none ${className}`}
      style={{ color: "#E1E0CC" }}
    >
      {words.map((word, wordIndex) => {
        const isLastWord = wordIndex === words.length - 1;

        return (
          <span
            key={wordIndex}
            className="inline-flex mr-[0.25em] last:mr-0 relative"
          >
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: delay + wordIndex * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block relative"
            >
              {word}
              {showAsterisk && isLastWord && (
                <span
                  className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none pointer-events-none"
                  style={{ color: "#E1E0CC" }}
                >
                  *
                </span>
              )}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
};

export default WordsPullUp;
