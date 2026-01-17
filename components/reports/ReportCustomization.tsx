'use client';

import { useState } from 'react';
import { ReportOptions } from '@/lib/reports/pdfGenerator';

interface ReportCustomizationProps {
  defaultOptions?: ReportOptions;
  onOptionsChange?: (options: ReportOptions) => void;
  onSubmit?: (options: ReportOptions) => void;
}

export function ReportCustomization({
  defaultOptions,
  onOptionsChange,
  onSubmit,
}: ReportCustomizationProps) {
  const [options, setOptions] = useState<Required<ReportOptions>>({
    includeSummary: defaultOptions?.includeSummary !== false,
    includeScores: defaultOptions?.includeScores !== false,
    includeAnswers: defaultOptions?.includeAnswers !== false,
    includeCharts: defaultOptions?.includeCharts !== false,
    organizationName: defaultOptions?.organizationName || '',
  });

  const handleOptionChange = (key: keyof Required<ReportOptions>, value: boolean | string) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleSubmit = () => {
    onSubmit?.(options);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Customization</h3>

      {/* Section Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Include Sections</h4>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeSummary}
            onChange={(e) => handleOptionChange('includeSummary', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Executive Summary</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeScores}
            onChange={(e) => handleOptionChange('includeScores', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Assessment Scores</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeAnswers}
            onChange={(e) => handleOptionChange('includeAnswers', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Assessment Answers</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeCharts}
            onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Charts and Visualizations</span>
        </label>
      </div>

      {/* Organization Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Organization Name (Optional)
        </label>
        <input
          type="text"
          value={options.organizationName}
          onChange={(e) => handleOptionChange('organizationName', e.target.value)}
          placeholder="Enter organization name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Preview Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Report Preview</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Sections included:</span>
            <span className="font-semibold">
              {[
                options.includeSummary && 'Summary',
                options.includeScores && 'Scores',
                options.includeAnswers && 'Answers',
                options.includeCharts && 'Charts',
              ]
                .filter(Boolean)
                .join(', ') || 'None'}
            </span>
          </div>
          {options.organizationName && (
            <div className="flex items-center justify-between">
              <span>Organization:</span>
              <span className="font-semibold">{options.organizationName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      {onSubmit && (
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Generate Report
        </button>
      )}
    </div>
  );
}
