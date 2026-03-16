"use client";

import { motion, Variants } from "motion/react";

export function TodoIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  // Animation configuration
  const DURATION = 0.6;
  const STAGGER = 0.4;
  const TOTAL_CYCLE = 4.5; // Total duration of the entire sequence including hold time

  const itemVariants: Variants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: (i: number) => {
      const start = (i * STAGGER) / TOTAL_CYCLE;
      const end = (i * STAGGER + DURATION) / TOTAL_CYCLE;
      
      return {
        pathLength: [0, 0, 1, 1, 0],
        opacity: [0, 0, 1, 1, 0],
        transition: {
          duration: TOTAL_CYCLE,
          times: [0, start, end, 0.9, 1], // Appear at start, hold until 90%, vanish by 100%
          ease: "easeInOut",
          repeat: Infinity,
        },
      };
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      
      {/* Row 1 */}
      <motion.path 
        d="M3.5 5.5l1.5 1.5l2.5 -2.5" 
        variants={itemVariants} 
        custom={0} 
      />
      <motion.path 
        d="M11 6l9 0" 
        variants={itemVariants} 
        custom={1} 
      />
      
      {/* Row 2 */}
      <motion.path 
        d="M3.5 11.5l1.5 1.5l2.5 -2.5" 
        variants={itemVariants} 
        custom={2} 
      />
      <motion.path 
        d="M11 12l9 0" 
        variants={itemVariants} 
        custom={3} 
      />
      
      {/* Row 3 */}
      <motion.path 
        d="M3.5 17.5l1.5 1.5l2.5 -2.5" 
        variants={itemVariants} 
        custom={4} 
      />
      <motion.path 
        d="M11 18l9 0" 
        variants={itemVariants} 
        custom={5} 
      />
    </motion.svg>
  );
}
