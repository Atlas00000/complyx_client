'use client';

import { suggestedPrompts, type SuggestedPrompt } from '@/data/promptTemplates';
import SuggestedPromptsContainer from './SuggestedPromptsContainer';
import PromptCard from './PromptCard';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  visible?: boolean;
  maxPrompts?: number;
}

/**
 * SuggestedPrompts Component
 * 
 * Revamped with:
 * - Glassmorphism container
 * - Staggered animations
 * - Interactive hover effects
 * - Dynamic gradients
 * - No clip art or emojis
 */
export default function SuggestedPrompts({
  onSelectPrompt,
  visible = true,
  maxPrompts = 6,
}: SuggestedPromptsProps) {
  if (!visible) return null;

  const promptsToShow = suggestedPrompts.slice(0, maxPrompts);

  const handlePromptClick = (prompt: SuggestedPrompt) => {
    onSelectPrompt(prompt.prompt);
  };

  return (
    <SuggestedPromptsContainer
      title="Suggested Questions"
      subtitle="Click any prompt to get started"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promptsToShow.map((prompt, index) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onClick={() => handlePromptClick(prompt)}
            index={index}
          />
        ))}
      </div>
    </SuggestedPromptsContainer>
  );
}
