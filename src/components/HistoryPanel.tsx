'use client';

import { HistoryEntry } from './Calculator';

interface HistoryPanelProps {
  history: HistoryEntry[];
  loading: boolean;
  onClear: () => void;
  onRefresh: () => void;
}

export default function HistoryPanel({ history, loading, onClear, onRefresh }: HistoryPanelProps) {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      className="w-full max-w-sm lg:max-w-xs mx-auto lg:mx-0 rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1e1e3a 0%, #12122a 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        minHeight: '400px',
        maxHeight: '520px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h2 className="text-white font-semibold text-base" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          History
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              background: 'rgba(78,204,163,0.15)',
              color: '#4ecca3',
              border: '1px solid rgba(78,204,163,0.3)',
            }}
            title="Refresh"
          >
            ↻
          </button>
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              background: 'rgba(255,107,107,0.15)',
              color: '#ff6b6b',
              border: '1px solid rgba(255,107,107,0.3)',
            }}
            title="Clear All"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto history-scrollbar"
        style={{ maxHeight: '440px' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <div className="text-3xl">🧮</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No calculations yet</div>
          </div>
        ) : (
          <ul className="p-3 flex flex-col gap-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="history-item rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div
                  className="text-xs mb-1 font-mono"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {entry.expression}
                </div>
                <div
                  className="text-base font-bold font-mono"
                  style={{
                    color: entry.result === 'Division by zero' ? '#ff6b6b' : '#4ecca3',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  = {entry.result}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {formatDate(entry.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
