import jsPDF from 'jspdf';
import type { AssessmentScore, AssessmentAnswer } from '@/stores/assessmentStore';

export interface ReportData {
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

export interface ReportOptions {
  includeSummary?: boolean;
  includeScores?: boolean;
  includeAnswers?: boolean;
  includeCharts?: boolean;
  organizationName?: string;
}

/**
 * PDF Report Generator
 * Generates PDF reports for IFRS assessments using jsPDF
 */
export class PDFGenerator {
  private doc: jsPDF;
  private margin = 20;
  private pageWidth: number;
  private pageHeight: number;
  private contentWidth: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = this.margin;
  }

  /**
   * Generate PDF report
   */
  generateReport(data: ReportData, options: ReportOptions = {}): jsPDF {
    const opts: Required<ReportOptions> = {
      includeSummary: options.includeSummary !== false,
      includeScores: options.includeScores !== false,
      includeAnswers: options.includeAnswers !== false,
      includeCharts: options.includeCharts !== false,
      organizationName: options.organizationName || 'Organization',
    };

    // Reset position
    this.currentY = this.margin;
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.contentWidth = this.pageWidth - (this.margin * 2);

    // Cover page
    this.addCoverPage(data, opts);

    // Summary page
    if (opts.includeSummary) {
      this.addNewPage();
      this.addSummarySection(data, opts);
    }

    // Scores page
    if (opts.includeScores && data.scores) {
      this.addNewPage();
      this.addScoresSection(data.scores, opts);
    }

    // Answers page
    if (opts.includeAnswers && data.answers.length > 0) {
      this.addNewPage();
      this.addAnswersSection(data.answers, opts);
    }

    // Footer on all pages
    this.addPageNumbers();

    return this.doc;
  }

  /**
   * Add cover page
   */
  private addCoverPage(data: ReportData, options: Required<ReportOptions>): void {
    // Title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('IFRS S1 & S2', this.pageWidth / 2, 60, { align: 'center' });
    this.doc.text('Readiness Assessment Report', this.pageWidth / 2, 75, { align: 'center' });

    // Organization name
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(options.organizationName, this.pageWidth / 2, 95, { align: 'center' });

    // Assessment details
    this.doc.setFontSize(12);
    const detailsY = 130;
    const lineHeight = 7;

    this.doc.text(`Assessment ID: ${data.assessmentId}`, this.margin, detailsY);
    this.doc.text(`IFRS Standard: ${data.ifrsStandard}`, this.margin, detailsY + lineHeight);
    this.doc.text(`Phase: ${this.formatPhase(data.phase)}`, this.margin, detailsY + lineHeight * 2);
    this.doc.text(`Status: ${this.formatStatus(data.status)}`, this.margin, detailsY + lineHeight * 3);
    this.doc.text(`Progress: ${data.progress.toFixed(0)}%`, this.margin, detailsY + lineHeight * 4);
    this.doc.text(`Generated: ${data.generatedAt.toLocaleDateString()}`, this.margin, detailsY + lineHeight * 5);

    // Logo placeholder (can be replaced with actual logo)
    const logoSize = 40;
    const logoX = this.pageWidth / 2 - logoSize / 2;
    const logoY = 200;
    this.doc.setFillColor(230, 230, 230);
    this.doc.rect(logoX, logoY, logoSize, logoSize, 'F');
    this.doc.setFontSize(10);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text('LOGO', this.pageWidth / 2, logoY + logoSize / 2, { align: 'center' });
    this.doc.setTextColor(0, 0, 0);

    this.currentY = this.pageHeight - this.margin;
  }

  /**
   * Add summary section
   */
  private addSummarySection(data: ReportData, _options: Required<ReportOptions>): void {
    this.addSectionTitle('Executive Summary');

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    const lineHeight = 6;
    let y = this.currentY;

    const summaryText = [
      `This assessment evaluates readiness for IFRS ${data.ifrsStandard} compliance.`,
      `The assessment was conducted in ${this.formatPhase(data.phase)} phase, covering key areas`,
      `of governance, strategy, risk management, and metrics/targets.`,
      '',
      `Overall Progress: ${data.progress.toFixed(0)}% (${data.answeredCount} of ${data.totalCount} questions answered)`,
    ];

    for (const line of summaryText) {
      this.doc.text(line, this.margin, y);
      y += lineHeight;
      if (y > this.pageHeight - this.margin - 20) {
        this.addNewPage();
        y = this.currentY;
      }
    }

    this.currentY = y + 10;
  }

  /**
   * Add scores section
   */
  private addScoresSection(scores: AssessmentScore, _options: Required<ReportOptions>): void {
    this.addSectionTitle('Assessment Scores');

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    let y = this.currentY;

    // Overall score
    this.doc.text('Overall Readiness Score:', this.margin, y);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${scores.overallScore.toFixed(0)}%`, this.margin + 80, y);
    this.doc.setFontSize(12);

    y += 15;

    // Category scores
    if (scores.categoryScores && scores.categoryScores.length > 0) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Category Breakdown:', this.margin, y);
      y += 10;

      this.doc.setFont('helvetica', 'normal');
      for (const category of scores.categoryScores) {
        const categoryName = category.category.charAt(0).toUpperCase() + category.category.slice(1);
        this.doc.text(`${categoryName}:`, this.margin, y);
        this.doc.text(`${category.percentage.toFixed(0)}%`, this.margin + 80, y);
        y += 7;

        if (y > this.pageHeight - this.margin - 20) {
          this.addNewPage();
          y = this.currentY;
        }
      }
    }

    this.currentY = y + 10;
  }

  /**
   * Add answers section
   */
  private addAnswersSection(answers: AssessmentAnswer[], _options: Required<ReportOptions>): void {
    this.addSectionTitle('Assessment Answers');

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    let y = this.currentY;

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const questionNumber = i + 1;

      // Question ID
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.text(`Q${questionNumber}: ${answer.questionId}`, this.margin, y);
      y += 5;

      // Answer
      this.doc.setFont('helvetica', 'normal');
      const answerText = this.wrapText(answer.value, this.contentWidth - 10);
      for (const line of answerText) {
        this.doc.text(line, this.margin + 5, y);
        y += 5;
        if (y > this.pageHeight - this.margin - 20) {
          this.addNewPage();
          y = this.currentY;
        }
      }

      y += 3; // Space between answers
    }

    this.currentY = y;
  }

  /**
   * Add section title
   */
  private addSectionTitle(title: string): void {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;

    // Underline
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY - 5, this.pageWidth - this.margin, this.currentY - 5);
    this.currentY += 10;
  }

  /**
   * Add new page
   */
  private addNewPage(): void {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  /**
   * Add page numbers
   */
  private addPageNumbers(): void {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.setTextColor(128, 128, 128);
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
      this.doc.setTextColor(0, 0, 0);
    }
  }

  /**
   * Wrap text to fit width
   */
  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = this.doc.getTextWidth(testLine);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Format phase name
   */
  private formatPhase(phase: string): string {
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
  private formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Save PDF to file
   */
  save(filename: string): void {
    this.doc.save(filename);
  }

  /**
   * Get PDF as blob
   */
  getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Get PDF as data URL
   */
  getDataURL(): string {
    return this.doc.output('dataurlstring');
  }
}
