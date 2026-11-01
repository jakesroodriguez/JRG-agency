import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface TextSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
  delay?: number;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({
  segments,
  className = "",
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  // Flatten all words across segments while preserving their corresponding className
  let globalWordCounter = 0;
  const wordTokens: { word: string; className: string; index: number }[] = [];

  segments.forEach((seg) => {
    const rawWords = seg.text.split(" ").filter((w) => w.length > 0);
    rawWords.forEach((word) => {
      wordTokens.push({
        word,
        className: seg.className || "",
        index: globalWordCounter++,
      });
    });
  });

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center items-baseline select-none ${className}`}
    >
      {wordTokens.map((item) => (
        <span
          key={item.index}
          className={`inline-flex mr-[0.28em] last:mr-0 ${item.className}`}
        >
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{
              duration: 0.65,
              delay: delay + item.index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

export default WordsPullUpMultiStyle;
