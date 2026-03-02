const STORAGE_KEY = 'complyx-in-progress-assessment';

export interface StoredInProgressAssessment {
  userId: string;
  assessmentId: string;
}

/**
 * Save in-progress assessment so it can be restored after refresh.
 */
export function saveInProgressAssessment(
  userId: string,
  assessmentId: string
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userId, assessmentId })
    );
  } catch {
    // ignore
  }
}

/**
 * Read stored in-progress assessment; only valid for the given userId.
 */
export function getInProgressAssessment(
  userId: string | null
): StoredInProgressAssessment | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredInProgressAssessment;
    if (data.userId !== userId || !data.assessmentId) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Clear stored in-progress assessment (e.g. on complete or reset).
 */
export function clearInProgressAssessment(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
