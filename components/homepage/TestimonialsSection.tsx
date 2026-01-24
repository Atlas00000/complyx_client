'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface TestimonialsSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

const TestimonialsSection = ({
  title,
  subtitle,
  testimonials,
  className = '',
}: TestimonialsSectionProps) => {
  return (
    <section className={`py-20 bg-gray-50 dark:bg-slate-800 ${className}`}>
      <Container size="wide">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-gray-900 dark:text-slate-100 font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-body-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="elevated" hover className="h-full p-6 border border-gray-200 dark:border-gray-600">
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating!
                            ? 'text-warning dark:text-warning'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Content */}
                <p className="text-body text-gray-700 dark:text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/20 dark:border-primary/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary dark:bg-primary text-white flex items-center justify-center font-semibold shadow-primary">
                      {testimonial.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
