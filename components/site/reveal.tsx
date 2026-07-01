'use client';

import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  variant?: 'fade' | 'slide-up' | 'blur' | 'scale';
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
  variant = 'slide-up',
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-60px' });
  const reduce = useReducedMotion();

  const finalY = reduce ? 0 : y;
  const duration = reduce ? 0.1 : 0.65;

  const getVariants = (): Variants => {
    if (reduce) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
    }

    switch (variant) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case 'blur':
        return {
          initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'slide-up':
      default:
        return {
          initial: { opacity: 0, y: finalY },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const animVariants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={animVariants}
      transition={{ duration, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function StaggerGroup({
  children,
  className,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = 'slide-up',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide-up' | 'blur' | 'scale';
}) {
  const reduce = useReducedMotion();

  const getVariants = (): Variants => {
    if (reduce) {
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.1 } },
      };
    }

    switch (variant) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          },
        };
      case 'blur':
        return {
          hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
          show: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.96 },
          show: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          },
        };
      case 'slide-up':
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          },
        };
    }
  };

  return (
    <motion.div variants={getVariants()} className={className}>
      {children}
    </motion.div>
  );
}

