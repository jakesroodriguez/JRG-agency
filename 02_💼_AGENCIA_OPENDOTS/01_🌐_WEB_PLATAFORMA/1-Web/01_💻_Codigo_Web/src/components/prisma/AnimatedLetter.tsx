import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: MotionValue<number>;
}

export const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  char,
  index,
  totalChars,
  scrollYProgress,
}) => {
  const charProgress = totalChars > 0 ? index / totalChars : 0;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.max(start + 0.02, Math.min(1, charProgress + 0.05));

  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline">
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

export default AnimatedLetter;
