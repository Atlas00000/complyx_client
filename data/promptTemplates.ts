export interface SuggestedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'overview' | 'compliance' | 'requirements' | 'assessment' | 'guidance';
  icon?: string;
}

export const suggestedPrompts: SuggestedPrompt[] = [
  // Overview prompts
  {
    id: 'overview-s1',
    title: 'Explain IFRS S1',
    prompt: 'Can you explain what IFRS S1 (General Requirements for Disclosure of Sustainability-related Financial Information) is and what it covers?',
    category: 'overview',
  },
  {
    id: 'overview-s2',
    title: 'Explain IFRS S2',
    prompt: 'Can you explain what IFRS S2 (Climate-related Disclosures) is and how it relates to IFRS S1?',
    category: 'overview',
  },
  
  // Compliance prompts
  {
    id: 'compliance-checklist',
    title: 'Compliance Checklist',
    prompt: 'What are the key compliance requirements and checklist items for IFRS S1 and S2?',
    category: 'compliance',
  },
  {
    id: 'compliance-readiness',
    title: 'Assess Readiness',
    prompt: 'How can I assess my organization\'s readiness for IFRS S1 and S2 compliance?',
    category: 'compliance',
  },
  
  // Requirements prompts
  {
    id: 'requirements-governance',
    title: 'Governance Requirements',
    prompt: 'What are the governance requirements under IFRS S1 and S2?',
    category: 'requirements',
  },
  {
    id: 'requirements-strategy',
    title: 'Strategy Requirements',
    prompt: 'What strategy-related disclosures are required by IFRS S1 and S2?',
    category: 'requirements',
  },
  {
    id: 'requirements-metrics',
    title: 'Metrics & Targets',
    prompt: 'What metrics and targets must be disclosed under IFRS S1 and S2?',
    category: 'requirements',
  },
  
  // Assessment prompts
  {
    id: 'assessment-gaps',
    title: 'Identify Gaps',
    prompt: 'Help me identify potential compliance gaps in our current sustainability reporting approach.',
    category: 'assessment',
  },
  {
    id: 'assessment-best-practices',
    title: 'Best Practices',
    prompt: 'What are the best practices for implementing IFRS S1 and S2 in our organization?',
    category: 'assessment',
  },
  
  // Guidance prompts
  {
    id: 'guidance-industry',
    title: 'Industry-Specific Guidance',
    prompt: 'Do you have industry-specific guidance for IFRS S1 and S2 compliance?',
    category: 'guidance',
  },
  {
    id: 'guidance-implementation',
    title: 'Implementation Roadmap',
    prompt: 'Can you provide a roadmap for implementing IFRS S1 and S2 disclosures in our organization?',
    category: 'guidance',
  },
];

// Get prompts by category
export const getPromptsByCategory = (category?: SuggestedPrompt['category']): SuggestedPrompt[] => {
  if (!category) return suggestedPrompts;
  return suggestedPrompts.filter((p) => p.category === category);
};

// Get featured prompts (shown when chat is empty or has few messages)
export const getFeaturedPrompts = (count: number = 6): SuggestedPrompt[] => {
  // Return a mix of categories
  return suggestedPrompts.slice(0, count);
};
