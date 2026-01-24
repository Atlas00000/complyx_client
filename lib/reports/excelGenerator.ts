import * as XLSX from 'xlsx';
import type { AssessmentScore, AssessmentAnswer } from '@/stores/assessmentStore';

export interface ExcelReportData {
  assessmentId: string;
  ifrsStandard: 'S1' | 'S2';
  phase: 'quick' | 'detailed' | 'followup';
  status: 'in_progress' | 'completed' | 'paused';
  progress: number;
  answeredCount: number;
  totalCount: number;
  scores: AssessmentScore | null;
  answers: AssessmentAnswer[];
  generatedAt: Date;
  organizationName?: string;
}

export interface ExcelExportOptions {
  includeSummary?: boolean;
  includeScores?: boolean;
  includeAnswers?: boolean;
  sheetNames?: {
    summary?: string;
    scores?: string;
    answers?: string;
  };
}

/**
 * Excel Report Generator
 * Generates Excel reports for IFRS assessments using xlsx
 */
export class ExcelGenerator {
  /**
   * Generate Excel report
   */
  static generateReport(data: ExcelReportData, options: ExcelExportOptions = {}): XLSX.WorkBook {
    const opts: Required<ExcelExportOptions> = {
      includeSummary: options.includeSummary !== false,
      includeScores: options.includeScores !== false,
      includeAnswers: options.includeAnswers !== false,
      sheetNames: {
        summary: options.sheetNames?.summary || 'Summary',
        scores: options.sheetNames?.scores || 'Scores',
        answers: options.sheetNames?.answers || 'Answers',
      },
    };

    const workbook = XLSX.utils.book_new();

    // Summary sheet
    if (opts.includeSummary) {
      const summarySheet = this.createSummarySheet(data);
      XLSX.utils.book_append_sheet(workbook, summarySheet, opts.sheetNames.summary);
    }

    // Scores sheet
    if (opts.includeScores && data.scores) {
      const scoresSheet = this.createScoresSheet(data.scores);
      XLSX.utils.book_append_sheet(workbook, scoresSheet, opts.sheetNames.scores);
    }

    // Answers sheet
    if (opts.includeAnswers && data.answers.length > 0) {
      const answersSheet = this.createAnswersSheet(data.answers);
      XLSX.utils.book_append_sheet(workbook, answersSheet, opts.sheetNames.answers);
    }

    return workbook;
  }

  /**
   * Create summary sheet
   */
  private static createSummarySheet(data: ExcelReportData): XLSX.WorkSheet {
    const summaryData = [
      ['IFRS S1 & S2 Readiness Assessment Report', ''],
      ['', ''],
      ['Assessment Information', ''],
      ['Assessment ID', data.assessmentId],
      ['IFRS Standard', `IFRS ${data.ifrsStandard}`],
      ['Phase', this.formatPhase(data.phase)],
      ['Status', this.formatStatus(data.status)],
      ['Progress', `${data.progress.toFixed(0)}%`],
      ['Questions Answered', `${data.answeredCount} / ${data.totalCount}`],
      ['Organization', data.organizationName || 'N/A'],
      ['Generated', data.generatedAt.toLocaleString()],
      ['', ''],
      ['Executive Summary', ''],
      ['', `This assessment evaluates readiness for IFRS ${data.ifrsStandard} compliance.`],
      ['', `The assessment was conducted in ${this.formatPhase(data.phase)} phase.`],
      ['', `Overall Progress: ${data.progress.toFixed(0)}% (${data.answeredCount} of ${data.totalCount} questions answered)`],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Column A
      { wch: 40 }, // Column B
    ];

    return worksheet;
  }

  /**
   * Create scores sheet
   */
  private static createScoresSheet(scores: AssessmentScore): XLSX.WorkSheet {
    const scoresData = [
      ['Assessment Scores', ''],
      ['', ''],
      ['Overall Readiness Score', `${scores.overallScore.toFixed(2)}%`],
      ['', ''],
      ['Category Breakdown', ''],
      ['Category', 'Percentage', 'Score'],
    ];

    // Add category scores
    if (scores.categoryScores && scores.categoryScores.length > 0) {
      for (const category of scores.categoryScores) {
        const categoryName = category.category.charAt(0).toUpperCase() + category.category.slice(1);
        scoresData.push([categoryName, `${category.percentage.toFixed(2)}%`, category.score.toString()]);
      }
    }

    // Add summary stats
    scoresData.push(['', '']);
    scoresData.push(['Total Answered', `${scores.totalAnswered}`, '']);
    scoresData.push(['Total Questions', `${scores.totalQuestions}`, '']);

    const worksheet = XLSX.utils.aoa_to_sheet(scoresData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Column A
      { wch: 15 }, // Column B
      { wch: 15 }, // Column C
    ];

    // Style header row
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:C1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E5E7EB' } },
      };
    }

    return worksheet;
  }

  /**
   * Create answers sheet
   */
  private static createAnswersSheet(answers: AssessmentAnswer[]): XLSX.WorkSheet {
    const answersData = [
      ['Assessment Answers', ''],
      ['', ''],
      ['#', 'Question ID', 'Answer', 'Timestamp'],
    ];

    // Add answers
    answers.forEach((answer, index) => {
      const timestamp = answer.timestamp instanceof Date 
        ? answer.timestamp.toLocaleString() 
        : typeof answer.timestamp === 'string' 
        ? new Date(answer.timestamp).toLocaleString() 
        : 'N/A';
      
      answersData.push([
        (index + 1).toString(),
        answer.questionId,
        answer.value,
        timestamp,
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(answersData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // Column A: #
      { wch: 20 }, // Column B: Question ID
      { wch: 50 }, // Column C: Answer
      { wch: 25 }, // Column D: Timestamp
    ];

    // Style header row
    const headerRow = 2; // Row index for header
    for (let col = 0; col < 4; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E5E7EB' } },
      };
    }

    return worksheet;
  }

  /**
   * Format phase name
   */
  private static formatPhase(phase: string): string {
    switch (phase) {
      case 'quick':
        return 'Quick Assessment';
      case 'detailed':
        return 'Detailed Assessment';
      case 'followup':
        return 'Follow-up Assessment';
      default:
        return phase;
    }
  }

  /**
   * Format status name
   */
  private static formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Save Excel file
   */
  static save(workbook: XLSX.WorkBook, filename: string): void {
    XLSX.writeFile(workbook, filename);
  }

  /**
   * Get Excel as blob
   */
  static getBlob(workbook: XLSX.WorkBook): Blob {
    return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as unknown as Blob;
  }

  /**
   * Get Excel as base64
   */
  static getBase64(workbook: XLSX.WorkBook): string {
    return XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  }
}
