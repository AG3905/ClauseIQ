"use client";

import React from "react";
import { motion, useReducedMotion, Variants, HTMLMotionProps } from "framer-motion";

export const parentStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const childRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const childScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export interface MotionSectionProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  variants?: Variants;
  as?: keyof React.JSX.IntrinsicElements;
}

export function MotionSection({
  children,
  className = "",
  amount = 0.2,
  variants = parentStaggerVariants,
  as = "div",
  ...props
}: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const reducedVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const Component = motion[as as keyof typeof motion] as React.ElementType;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: shouldReduceMotion ? 0 : amount }}
      variants={shouldReduceMotion ? reducedVariants : variants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface MotionItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

export function MotionItem({
  children,
  className = "",
  variants = childRevealVariants,
  ...props
}: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const reducedItem: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedItem : variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { motion };
