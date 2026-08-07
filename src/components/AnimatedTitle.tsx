import React from 'react';
import { motion } from 'motion/react';

export default function AnimatedTitle({ text, className }: { text: string, className?: string }) {
  const words = text.split(' ');

  let charCount = 0;

  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, charIndex) => {
            const index = charCount++;
            return (
              <motion.span
                key={charIndex}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: index * 0.02,
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
