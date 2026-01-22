'use client';

import { ReactNode } from 'react';
import { Container, Grid } from '@/components/layout';
import FeatureCard, { FeatureCardProps } from './FeatureCard';

export interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  features: Omit<FeatureCardProps, 'delay'>[];
  className?: string;
}

const FeaturesSection = ({
  title,
  subtitle,
  features,
  className = '',
}: FeaturesSectionProps) => {
  return (
    <section className={`py-20 bg-white ${className}`}>
      <Container size="wide">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-gray-900 font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <Grid
          cols={3}
          gap="large"
          responsive={{
            sm: 1,
            md: 2,
            lg: 3,
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default FeaturesSection;
