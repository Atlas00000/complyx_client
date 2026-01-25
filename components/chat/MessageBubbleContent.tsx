'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleContentProps {
  message: string;
  isUser: boolean;
  searchQuery?: string;
}

/**
 * MessageBubbleContent Component
 * 
 * Enhanced markdown rendering with:
 * - Better typography
 * - Improved code block styling
 * - Enhanced table presentation
 * - Search highlighting
 */
export default function MessageBubbleContent({
  message,
  isUser,
  searchQuery,
}: MessageBubbleContentProps) {
  // Highlight search query in message text
  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) {
      return text;
    }

    // Simple regex replacement for markdown content
    // Escape special regex characters to prevent errors (especially on iOS Safari)
    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(regex, (match) => `**${match}**`);
    } catch (error) {
      // Fallback: if regex fails, return original text
      console.warn('Regex error in highlight, using fallback:', error);
      return text;
    }
  };

  // Enhanced markdown components with better styling
  const markdownComponents = {
    p: ({ children }: any) => (
      <p className="mb-4 last:mb-0 leading-relaxed text-[15px]">{children}</p>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-inherit">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0 text-inherit">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-inherit">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-inherit">{children}</h4>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-outside mb-4 space-y-2 ml-6">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-outside mb-4 space-y-2 ml-6">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/40 dark:border-primary/50 pl-5 py-3 my-4 italic bg-primary/5 dark:bg-primary/10 rounded-r-lg">
        {children}
      </blockquote>
    ),
    code: ({ inline, children, className }: any) => {
      if (inline) {
        return (
          <code className="bg-gray-100/80 dark:bg-slate-700/80 text-gray-800 dark:text-slate-200 px-2 py-1 rounded-md text-sm font-mono border border-gray-200/50 dark:border-slate-600/50">
            {children}
          </code>
        );
      }
      return (
        <code className={`block bg-gray-900 dark:bg-slate-950 text-gray-100 dark:text-slate-200 p-4 rounded-xl overflow-x-auto text-sm font-mono mb-4 border border-gray-800 dark:border-slate-800 ${className || ''}`}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => <pre className="mb-4">{children}</pre>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary-dark underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-inherit">
        {searchQuery && typeof children === 'string' && children.toLowerCase().includes(searchQuery.toLowerCase()) ? (
          <mark className="bg-warning/30 dark:bg-warning/20 text-inherit px-1.5 py-0.5 rounded font-medium">
            {children}
          </mark>
        ) : (
          children
        )}
      </strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    hr: () => <hr className="my-6 border-gray-200 dark:border-slate-600" />,
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-slate-600">
        <table className="min-w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-50 dark:bg-slate-700/50">{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr className="border-b border-gray-200 dark:border-slate-600 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-left font-semibold text-inherit border-r border-gray-200 dark:border-slate-600 last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-inherit border-r border-gray-200 dark:border-slate-600 last:border-r-0">
        {children}
      </td>
    ),
  };

  return (
    <div
      className={`
        text-body leading-relaxed prose prose-sm max-w-none
        ${isUser 
          ? 'prose-invert prose-headings:text-white prose-p:text-white/95 prose-strong:text-white prose-code:text-white/95 prose-pre:bg-white/10 prose-a:text-white/90' 
          : 'prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-strong:text-gray-900 dark:prose-strong:text-slate-100'
        }
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {searchQuery ? highlightText(message, searchQuery) : message}
      </ReactMarkdown>
    </div>
  );
}
