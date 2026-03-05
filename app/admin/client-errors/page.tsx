'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3001` : '');

interface ClientErrorRow {
  id: string;
  message: string;
  stack: string | null;
  code: string | null;
  url: string | null;
  userAgent: string | null;
  userId: string | null;
  level: string | null;
  createdAt: string;
}

export default function ClientErrorsPage() {
  const [errors, setErrors] = useState<ClientErrorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [mobileOnly, setMobileOnly] = useState(false);

  useEffect(() => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams();
    if (level) params.set('level', level);
    if (from) params.set('from', new Date(from).toISOString());
    if (to) params.set('to', new Date(to).toISOString());
    if (mobileOnly) params.set('mobile', 'true');
    params.set('limit', '100');
    fetch(`${API_BASE}/api/telemetry/errors?${params.toString()}`)
      .then((res) => res.ok ? res.json() : { errors: [] })
      .then((data) => {
        setErrors(data.errors || []);
      })
      .catch(() => setErrors([]))
      .finally(() => setLoading(false));
  }, [level, from, to, mobileOnly]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          Client errors
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          Recent errors reported from the client (e.g. ErrorBoundary, API failures). Internal use.
        </p>
        <div className="mb-4 flex flex-wrap gap-4 items-end">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600 dark:text-slate-400">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
            >
              <option value="">All</option>
              <option value="error">error</option>
              <option value="warn">warn</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600 dark:text-slate-400">From</label>
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600 dark:text-slate-400">To</label>
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={mobileOnly}
                onChange={(e) => setMobileOnly(e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600"
              />
              Mobile only
            </label>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-500 dark:text-slate-400">Loading…</p>
        ) : errors.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400">No errors recorded.</p>
        ) : (
          <ul className="space-y-4">
            {errors.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm"
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-slate-100 break-all">
                    {e.message}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 shrink-0">
                    {new Date(e.createdAt).toISOString()}
                  </span>
                </div>
                {e.code && (
                  <div className="text-gray-600 dark:text-slate-400">
                    <span className="font-mono text-xs">{e.code}</span>
                  </div>
                )}
                {e.url && (
                  <div className="text-gray-500 dark:text-slate-500 truncate mt-1" title={e.url}>
                    {e.url}
                  </div>
                )}
                {e.userAgent && (
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-1 truncate" title={e.userAgent}>
                    {e.userAgent}
                  </div>
                )}
                {e.stack && (
                  <pre className="mt-2 p-2 rounded bg-gray-100 dark:bg-slate-700 text-xs overflow-x-auto max-h-32 overflow-y-auto">
                    {e.stack}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
