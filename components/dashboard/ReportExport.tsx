'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { PDFGenerator, ReportData } from '@/lib/reports/pdfGenerator';
import { ExcelGenerator } from '@/lib/reports/excelGenerator';
import { ReportCustomization } from '@/components/reports/ReportCustomization';
import type { ReportOptions } from '@/lib/reports/pdfGenerator';

interface ReportExportProps {
  className?: string;
}

export function ReportExport({ className }: ReportExportProps) {
  const [showCustomization, setShowCustomization] = useState(false);
  const [exportOptions, setExportOptions] = useState<ReportOptions>({
    includeSummary: true,
    includeScores: true,
    includeAnswers: true,
    includeCharts: false,
  });

  const {
    assessmentId,
    ifrsStandard,
    currentPhase,
    status,
    progress,
    answeredCount,
    totalCount,
    scores,
    answers,
  } = useAssessmentStore();

  const hasData = assessmentId && answers.length > 0;

  const generateReportData = (): ReportData => ({
    assessmentId: assessmentId || 'N/A',
    ifrsStandard: ifrsStandard || 'S1',
    phase: currentPhase || 'quick',
    status: status || 'in_progress',
    progress,
    answeredCount,
    totalCount,
    scores,
    answers,
    generatedAt: new Date(),
  });

  const handleExportPDF = () => {
    if (!hasData) {
      alert('No assessment data available to export');
      return;
    }

    try {
      const data = generateReportData();
      const pdfGen = new PDFGenerator();
      pdfGen.generateReport(data, exportOptions);
      const filename = `IFRS-${data.ifrsStandard}-Assessment-${data.assessmentId.substring(0, 8)}-${Date.now()}.pdf`;
      pdfGen.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    }
  };

  const handleExportExcel = () => {
    if (!hasData) {
      alert('No assessment data available to export');
      return;
    }

    try {
      const data = generateReportData();
      const workbook = ExcelGenerator.generateReport(data, {
        includeSummary: exportOptions.includeSummary,
        includeScores: exportOptions.includeScores,
        includeAnswers: exportOptions.includeAnswers,
      });
      const filename = `IFRS-${data.ifrsStandard}-Assessment-${data.assessmentId.substring(0, 8)}-${Date.now()}.xlsx`;
      ExcelGenerator.save(workbook, filename);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel report');
    }
  };

  if (!hasData) {
    return null;
  }

  return (
    <div className={className}>
      {showCustomization ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Report Options</h3>
            <button
              onClick={() => setShowCustomization(false)}
              className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <ReportCustomization
            defaultOptions={exportOptions}
            onOptionsChange={(options) => setExportOptions(options)}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button
          onClick={() => setShowCustomization(!showCustomization)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
        >
          Options
        </button>
      </div>
    </div>
  );
}
