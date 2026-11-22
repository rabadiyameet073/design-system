import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION_SPRINGS, getAccessibleTransition } from '../../tokens/motionConfig';

interface StepTransitionProps {
  children: React.ReactNode;
  stepKey: string | number;
}

export const StepTransition: React.FC<StepTransitionProps> = ({ children, stepKey }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={stepKey}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={getAccessibleTransition(MOTION_SPRINGS.base, Boolean(reduceMotion))}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
