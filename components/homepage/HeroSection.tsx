'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import Button from '@/components/ui/Button';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  backgroundElements?: ReactNode;
  className?: string;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundElements,
  className = '',
}: HeroSectionProps) => {
  return (
    <section className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Animated Background - Forest Green Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 dark:from-primary/20 dark:via-accent/10 dark:to-secondary/15">
        {/* Animated gradient orbs - Forest Green */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Teal accent orb */}
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 dark:bg-accent/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Sage green center orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/15 dark:bg-secondary/25 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Additional subtle green glow */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Custom Background Elements */}
      {backgroundElements}

      {/* Content */}
      <Container size="wide" className="relative z-10 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-full text-sm font-semibold mb-6 border border-primary/20 dark:border-primary/30">
              {subtitle}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-h1-lg lg:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              className="text-body-lg text-gray-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          {(primaryAction || secondaryAction) && (
            <motion.div
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {primaryAction && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={primaryAction.onClick}
                  className="shadow-primary-lg hover:shadow-primary-lg hover:scale-105 transition-all duration-300"
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="secondary"
                  size="large"
                  onClick={secondaryAction.onClick}
                  className="border-2 border-primary/20 dark:border-primary/30 hover:border-primary/40 dark:hover:border-primary/50 transition-all duration-300"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400 dark:text-slate-400"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.svg 
            className="w-5 h-5 text-primary dark:text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
