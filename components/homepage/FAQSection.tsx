'use client';

import { Container } from '@/components/layout';
import { Accordion } from '@/components/ui';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  title: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

const FAQSection = ({
  title,
  subtitle,
  items,
  className = '',
}: FAQSectionProps) => {
  const accordionItems = items.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p className="text-body text-gray-600">{item.answer}</p>,
  }));

  return (
    <section className={`py-20 bg-white ${className}`}>
      <Container size="standard">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-gray-900 font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion items={accordionItems} variant="separated" allowMultiple={false} />
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;
