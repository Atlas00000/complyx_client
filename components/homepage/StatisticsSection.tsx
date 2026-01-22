'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Container, Grid } from '@/components/layout';

export interface Statistic {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export interface StatisticsSectionProps {
  title?: string;
  subtitle?: string;
  statistics: Statistic[];
  className?: string;
}

const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

const StatisticsSection = ({
  title,
  subtitle,
  statistics,
  className = '',
}: StatisticsSectionProps) => {
  return (
    <section className={`py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 ${className}`}>
      <Container size="wide">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-h2 text-gray-900 font-bold mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Statistics Grid */}
        <Grid
          cols={4}
          gap="large"
          responsive={{
            sm: 2,
            md: 2,
            lg: 4,
          }}
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-body text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default StatisticsSection;
