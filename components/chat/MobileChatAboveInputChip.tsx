'use client';

interface MobileChatAboveInputChipProps {
  label: string;
  onClick: () => void;
  visible?: boolean;
}

/**
 * MobileChatAboveInputChip
 *
 * Optional chip above the input (e.g. Start/Resume assessment). No motion.
 */
export default function MobileChatAboveInputChip({
  label,
  onClick,
  visible = true,
}: MobileChatAboveInputChipProps) {
  if (!visible) return null;

  return (
    <div className="flex-shrink-0 flex justify-center py-2 px-4">
      <button
        type="button"
        onClick={onClick}
        className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/30 hover:bg-primary/20 dark:hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {label}
      </button>
    </div>
  );
}
