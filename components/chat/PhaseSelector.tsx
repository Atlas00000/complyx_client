'use client';

import { type PhaseInfo } from '@/lib/api/questionApi';

interface PhaseSelectorProps {
  phases: PhaseInfo[];
  currentPhase?: 'quick' | 'detailed' | 'followup';
  onPhaseSelect: (phase: 'quick' | 'detailed' | 'followup') => void;
  onStartAssessment: () => void;
}

export default function PhaseSelector({
  phases,
  currentPhase,
  onPhaseSelect,
  onStartAssessment,
}: PhaseSelectorProps) {
  const quickPhase = phases.find(p => p.phase === 'quick');
  const detailedPhase = phases.find(p => p.phase === 'detailed');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Assessment Type</h2>
      <p className="text-gray-600 mb-6">Select how comprehensive you want your IFRS readiness assessment to be</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Quick Assessment */}
        <button
          onClick={() => {
            onPhaseSelect('quick');
            onStartAssessment();
          }}
          className={`p-6 text-left border-2 rounded-xl transition-all ${
            currentPhase === 'quick'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Quick Assessment</h3>
            {quickPhase && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {quickPhase.questionCount} questions
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {quickPhase?.description || '10 essential questions to get a baseline score'}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{quickPhase?.estimatedTime || '5-10 minutes'}</span>
          </div>
        </button>

        {/* Detailed Assessment */}
        <button
          onClick={() => {
            onPhaseSelect('detailed');
            onStartAssessment();
          }}
          className={`p-6 text-left border-2 rounded-xl transition-all ${
            currentPhase === 'detailed'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Assessment</h3>
            {detailedPhase && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {detailedPhase.questionCount} questions
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {detailedPhase?.description || 'Comprehensive questions for in-depth analysis'}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{detailedPhase?.estimatedTime || '20-30 minutes'}</span>
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Start with Quick Assessment, then continue with Detailed Assessment for a complete analysis
        </p>
      </div>
    </div>
  );
}
