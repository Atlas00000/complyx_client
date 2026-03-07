'use client';

import { useState } from 'react';
import type { InChatQuestion } from '@/stores/inChatAssessmentStore';
import type { CompletionSummaryResponse } from '@/lib/api/inChatAssessmentApi';
import { useChatStore } from '@/stores/chatStore';
import MobileChatShell from './MobileChatShell';
import MobileChatHeader from './MobileChatHeader';
import MobileChatMessagesList from './MobileChatMessagesList';
import MobileChatSkeleton from './MobileChatSkeleton';
import MobileChatInput from './MobileChatInput';
import MobileSuggestedPrompts from './MobileSuggestedPrompts';
import MobileChatAboveInputChip from './MobileChatAboveInputChip';
import MobileAssessmentSelection from './MobileAssessmentSelection';
import MobileAssessmentInProgress from './MobileAssessmentInProgress';
import MobileAssessmentTypeSwitchConfirm from './MobileAssessmentTypeSwitchConfirm';
import MobileMoreMenu from './MobileMoreMenu';
import MobileConfirmDialog from './MobileConfirmDialog';
import MobileErrorBanner from './MobileErrorBanner';
import AssessmentCompletionSummary from './AssessmentCompletionSummary';
import CompletionSummarySkeleton from './CompletionSummarySkeleton';

interface MobileChatDebugViewProps {
  title?: string;
  onHistoryClick?: () => void;
  onSearchClick?: () => void;
  onSendMessage: (message: string) => void;
  onSelectPrompt: (prompt: string) => void;
  placeholder?: string;
  assessmentChipLabel?: string;
  onAssessmentClick?: () => void;
  // Week 5 – assessment
  inChatStep?: 'idle' | 'choose_type' | 'choose_topic' | 'in_progress' | 'completed';
  userId?: string | null;
  onStartAssessment?: () => Promise<void>;
  inChatCurrentQuestion?: InChatQuestion | null;
  inChatTotalQuestions?: number;
  inChatTotalAnswered?: number;
  inChatAssessmentError?: string | null;
  onInChatAnswer?: (value: string) => void;
  onInChatSkip?: () => void;
  onShowTypeSwitchConfirm?: () => void;
  showTypeSwitchConfirm?: boolean;
  onCloseTypeSwitchConfirm?: () => void;
  onSaveAndSwitchType?: () => void;
  onRestartAssessment?: () => void;
  inChatProgress?: number;
  completionSummary?: CompletionSummaryResponse | null;
  onStartAnotherAssessment?: () => void;
  completionDashboardHref?: string;
  /** Week 6 – show skeleton while initial session/messages load */
  isInitialLoading?: boolean;
  /** Week 7 – clear chat handler (shown in More menu with confirm) */
  onClearChat?: () => void;
  /** Week 8 – send/request error message and dismiss */
  sendError?: string | null;
  onDismissSendError?: () => void;
}

/**
 * Mobile chat page: shell + header + messages + input & prompts + assessment (Week 5).
 */
export default function MobileChatDebugView({
  title = 'Complyx',
  onHistoryClick,
  onSearchClick,
  onSendMessage,
  onSelectPrompt,
  placeholder,
  assessmentChipLabel,
  onAssessmentClick,
  inChatStep = 'idle',
  userId,
  onStartAssessment,
  inChatCurrentQuestion = null,
  inChatTotalQuestions = 0,
  inChatTotalAnswered = 0,
  inChatAssessmentError = null,
  onInChatAnswer,
  onInChatSkip,
  onShowTypeSwitchConfirm,
  showTypeSwitchConfirm = false,
  onCloseTypeSwitchConfirm,
  onSaveAndSwitchType,
  onRestartAssessment,
  inChatProgress = 0,
  completionSummary = null,
  onStartAnotherAssessment,
  completionDashboardHref,
  isInitialLoading = false,
  onClearChat,
  sendError = null,
  onDismissSendError,
}: MobileChatDebugViewProps) {
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const showSuggestedPrompts = messages.length <= 1 && !isTyping;
  const isChoosingType = inChatStep === 'choose_type' || inChatStep === 'choose_topic';
  const isInProgress = inChatStep === 'in_progress';
  const isCompleted = inChatStep === 'completed';

  return (
    <MobileChatShell>
      <MobileChatHeader
        title={title}
        onHistoryClick={onHistoryClick}
        onSearchClick={onSearchClick}
        onMoreClick={() => setIsMoreMenuOpen(true)}
      />
      {sendError && onDismissSendError && (
        <MobileErrorBanner
          message={sendError}
          onDismiss={onDismissSendError}
          visible={!!sendError}
        />
      )}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {isChoosingType ? (
          <div className="flex-1 min-h-0 overflow-auto flex flex-col justify-center">
            {userId && onStartAssessment ? (
              <MobileAssessmentSelection
                onStartAssessment={onStartAssessment}
                disabled={false}
              />
            ) : (
              <div className="p-4 text-center text-sm text-amber-600 dark:text-amber-400 space-y-2">
                <p>
                  <button
                    type="button"
                    onClick={() => (window.location.href = '/auth/login?redirect=/')}
                    className="font-medium underline"
                  >
                    Log in
                  </button>
                  {' '}to start an assessment.
                </p>
                <p>
                  Don&apos;t have an account?{' '}
                  <a href="/auth/register" className="font-medium underline">
                    Sign up
                  </a>
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {isInitialLoading ? (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <MobileChatSkeleton />
              </div>
            ) : (
              <MobileChatMessagesList />
            )}
            {isInProgress &&
              onInChatAnswer &&
              onInChatSkip &&
              onShowTypeSwitchConfirm && (
                <MobileAssessmentInProgress
                  currentQuestion={inChatCurrentQuestion}
                  totalQuestions={inChatTotalQuestions}
                  totalAnswered={inChatTotalAnswered}
                  onAnswer={onInChatAnswer}
                  onSkip={onInChatSkip}
                  onChangeType={onShowTypeSwitchConfirm}
                  error={inChatAssessmentError}
                />
              )}
            {isCompleted && (
              <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-700">
                {completionSummary ? (
                  <AssessmentCompletionSummary
                    summary={completionSummary}
                    onStartAnother={onStartAnotherAssessment}
                    dashboardHref={completionDashboardHref}
                  />
                ) : (
                  onStartAnotherAssessment && (
                    <CompletionSummarySkeleton onStartAnother={onStartAnotherAssessment} />
                  )
                )}
              </div>
            )}
            <MobileSuggestedPrompts
              onSelectPrompt={onSelectPrompt}
              maxPrompts={4}
              visible={showSuggestedPrompts}
            />
            {assessmentChipLabel && onAssessmentClick && (
              <MobileChatAboveInputChip
                label={assessmentChipLabel}
                onClick={onAssessmentClick}
                visible={messages.length > 0}
              />
            )}
            <MobileChatInput
              onSendMessage={onSendMessage}
              placeholder={placeholder}
              disabled={isTyping}
            />
          </>
        )}
      </main>
      {showTypeSwitchConfirm &&
        onCloseTypeSwitchConfirm &&
        onSaveAndSwitchType &&
        onRestartAssessment && (
          <MobileAssessmentTypeSwitchConfirm
            isOpen={showTypeSwitchConfirm}
            onClose={onCloseTypeSwitchConfirm}
            onSaveAndSwitch={onSaveAndSwitchType}
            onRestart={onRestartAssessment}
            progress={Math.round(inChatProgress)}
          />
        )}
      <MobileMoreMenu
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onClearChat={() => {
          setIsMoreMenuOpen(false);
          setShowClearConfirm(true);
        }}
        showClearChat={messages.length > 0}
        dashboardHref="/dashboard"
      />
      <MobileConfirmDialog
        isOpen={showClearConfirm}
        title="Clear chat?"
        message="This will remove all messages in this chat. This cannot be undone."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        onConfirm={() => {
          onClearChat?.();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
        variant="danger"
      />
    </MobileChatShell>
  );
}
