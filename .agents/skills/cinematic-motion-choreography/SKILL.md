---
name: cinematic-motion-choreography
description: Advanced animation patterns for web interfaces using Motion (Framer Motion), physics-based springs, staggered entrances, scroll timelines, and gesture-driven interactions.
---

# Cinematic Motion Choreography Skill

This skill provides patterns for implementing fluid, physics-driven animations in web interfaces.

---

## 1. Core Principles of Cinematic Motion

1. **Continuity & Spatial Awareness**:
   - Elements should never abruptly vanish or pop into existence. Use `AnimatePresence` with coordinated entry (`opacity: 0, y: 16`) and exit (`opacity: 0, y: -12`) transitions.
2. **Spring Physics Over Easing Curves**:
   - Standard cubic beziers can feel robotic. Springs simulate real-world momentum and mass.
   - Recommended spring configurations:
     - **Brisk & Responsive** (UI buttons, tabs, dropdowns): `{ type: "spring", stiffness: 350, damping: 25 }`
     - **Gentle & Elegant** (Modals, cards, drawers): `{ type: "spring", stiffness: 220, damping: 22 }`
     - **Playful & Bouncy** (Badges, icons, celebratory elements): `{ type: "spring", stiffness: 400, damping: 15 }`

---

## 2. Reusable Motion Patterns

### A. Staggered Container & Child Reveal
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 }
  }
};
```

### B. Interactive 3D Card Hover Tilt
```tsx
import { motion, useMotionValue, useTransform } from 'motion/react';

export const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};
```

### C. Morphing Layout Transitions (`layoutId`)
- Use `layoutId` on active tab pills, navigation indicators, or expanding cards to achieve seamless geometric morphing across DOM updates without manual position math.
