'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Magnetic Button Wrapper
export function Magnetic({ children, range = 0.35 }: { children: React.ReactNode; range?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xVal = clientX - (left + width / 2);
    const yVal = clientY - (top + height / 2);
    x.set(xVal * range);
    y.set(yVal * range);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

// 3D Tilt Card Wrapper with dynamic glare
export function TiltCard({
  children,
  className,
  maxRotate = 8,
}: {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const springX = useSpring(rotateX, { stiffness: 250, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 250, damping: 20 });
  const springGlareX = useSpring(glareX, { stiffness: 250, damping: 20 });
  const springGlareY = useSpring(glareY, { stiffness: 250, damping: 20 });
  const springGlareOpacity = useSpring(glareOpacity, { stiffness: 250, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    const rX = -(mouseY / (height / 2)) * maxRotate;
    const rY = (mouseX / (width / 2)) * maxRotate;
    
    rotateX.set(rX);
    rotateY.set(rY);

    const mousePX = ((e.clientX - rect.left) / width) * 100;
    const mousePY = ((e.clientY - rect.top) / height) * 100;
    glareX.set(mousePX);
    glareY.set(mousePY);
    glareOpacity.set(0.08); // Subtle white sheen
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  const glareBackground = useTransform(
    [springGlareX, springGlareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`
  );

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={cn('relative', className)}
    >
      {children}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: glareBackground,
            opacity: springGlareOpacity,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
}

// Premium Word Reveal for title entrance
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  const shouldReduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 15,
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(4px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('inline-block', className)}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.25em] last:mr-0 py-1">
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Glow Border Card
export function GlowBorderCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn('group relative rounded-2xl overflow-hidden', className)}
    >
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(120px circle at ${x}px ${y}px, hsl(var(--accent) / 0.2), transparent 80%)`
            ),
          }}
        />
      )}
      <div className="relative h-full w-full rounded-[inherit] bg-card border border-border transition-colors duration-300 group-hover:border-accent/15">
        {children}
      </div>
    </div>
  );
}
