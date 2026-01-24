// This script runs before React hydrates to prevent flash of unstyled content
export const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || 'system';
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
`;
