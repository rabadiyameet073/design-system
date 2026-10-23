import React from 'react';
import { motion } from 'motion/react';

interface StepTransitionProps {
  children: React.ReactNode;
  stepKey: string | number;
}

export const StepTransition: React.FC<StepTransitionProps> = ({ children, stepKey }) => {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
