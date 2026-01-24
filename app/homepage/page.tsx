'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { initTheme } from '@/lib/utils/theme';
import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  FAQSection,
  StatisticsSection,
} from '@/components/homepage';

export default function Homepage() {
  const router = useRouter();

  // Initialize theme on page load
  useEffect(() => {
    initTheme();
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: 'AI-Powered Chat',
      description: 'Get instant answers to your IFRS questions with our advanced AI assistant powered by cutting-edge language models.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Compliance Assessment',
      description: 'Comprehensive assessment tools to evaluate your organization\'s readiness for IFRS S1 & S2 compliance.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-Time Dashboard',
      description: 'Track your compliance progress with interactive dashboards and detailed analytics.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Knowledge Base',
      description: 'Access comprehensive IFRS documentation, guidelines, and best practices in one place.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with data encryption and compliance with international standards.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Fast & Efficient',
      description: 'Get instant responses and streamline your compliance workflow with our optimized platform.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CFO',
      company: 'TechCorp Inc.',
      content: 'Complyx has transformed how we approach IFRS compliance. The AI assistant provides accurate, timely answers that save us hours of research.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Compliance Officer',
      company: 'Finance Global',
      content: 'The assessment tools are comprehensive and the dashboard gives us clear visibility into our compliance status. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Accounting Director',
      company: 'Enterprise Solutions',
      content: 'The knowledge base is extensive and the chat interface makes it easy to find exactly what we need. A game-changer for our team.',
      rating: 5,
    },
  ];

  const faqItems = [
    {
      id: '1',
      question: 'What is IFRS S1 and S2?',
      answer: 'IFRS S1 (General Requirements for Disclosure of Sustainability-related Financial Information) and IFRS S2 (Climate-related Disclosures) are international standards that require entities to disclose sustainability and climate-related information in their financial reports.',
    },
    {
      id: '2',
      question: 'How does the AI assistant work?',
      answer: 'Our AI assistant uses advanced language models trained on IFRS documentation to provide accurate, contextual answers to your questions. It can help with compliance queries, interpretation of standards, and best practices.',
    },
    {
      id: '3',
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade encryption and follow international security standards. Your data is stored securely and never shared with third parties.',
    },
    {
      id: '4',
      question: 'Can I customize the assessments?',
      answer: 'Yes, our assessment tools are fully customizable. You can create custom assessments tailored to your organization\'s specific needs and industry requirements.',
    },
  ];

  const statistics = [
    { value: 1000, suffix: '+', label: 'Active Users' },
    { value: 50000, suffix: '+', label: 'Questions Answered' },
    { value: 95, suffix: '%', label: 'Accuracy Rate' },
    { value: 24, suffix: '/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header
        title="Complyx"
        subtitle="IFRS S1 & S2 Readiness Assessment"
        rightActions={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => router.push('/')}
            >
              Chat
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        }
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          title="Master IFRS S1 & S2 Compliance"
          subtitle="AI-Powered Compliance Assistant"
          description="Navigate the complexities of IFRS sustainability standards with confidence. Get instant answers, comprehensive assessments, and actionable insights."
          primaryAction={{
            label: 'Get Started',
            onClick: () => router.push('/'),
          }}
          secondaryAction={{
            label: 'Learn More',
            onClick: () => router.push('#features'),
          }}
        />

        {/* Statistics Section */}
        <StatisticsSection statistics={statistics} />

        {/* Features Section */}
        <FeaturesSection
          title="Everything You Need for IFRS Compliance"
          subtitle="Powerful tools and features to streamline your compliance journey"
          features={features}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          title="Trusted by Finance Professionals"
          subtitle="See what our users are saying about Complyx"
          testimonials={testimonials}
        />

        {/* FAQ Section */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about Complyx"
          items={faqItems}
        />
      </main>

      <Footer
        copyright="© 2024 Complyx. All rights reserved."
        sections={[
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Documentation', href: '#docs' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '#about' },
              { label: 'Blog', href: '#blog' },
              { label: 'Contact', href: '#contact' },
            ],
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacy', href: '#privacy' },
              { label: 'Terms', href: '#terms' },
              { label: 'Security', href: '#security' },
            ],
          },
        ]}
      />
    </div>
  );
}
