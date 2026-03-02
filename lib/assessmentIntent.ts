const INTENT_KEY = 'complyx-assessment-intent';

/**
 * Set that user intends to start assessment after login (e.g. before redirect to /auth/login).
 * Use sessionStorage so it clears when the tab closes.
 */
export function setAssessmentIntent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(INTENT_KEY, 'true');
  } catch {
    // ignore
  }
}

/**
 * Check and consume assessment intent. Returns true if intent was set, and clears it.
 */
export function consumeAssessmentIntent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const value = window.sessionStorage.getItem(INTENT_KEY);
    window.sessionStorage.removeItem(INTENT_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}
