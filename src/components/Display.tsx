'use client';

interface DisplayProps {
  display: string;
  expression: string;
  isError: boolean;
  resultFlash: boolean;
}

export default function Display({ display, expression, isError, resultFlash }: DisplayProps) {
  const getFontSize = (text: string): string => {
    const len = text.length;
    if (len <= 9) return 'text-5xl';
    if (len <= 12) return 'text-4xl';
    if (len <= 16) return 'text-3xl';
    return 'text-2xl';
  };

  return (
    <div
      className="px-6 pt-6 pb-4 min-h-36 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.25)' }}
    >
      {/* Expression line */}
      <div
        className="text-right mb-1 h-6 overflow-hidden"
        style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}
      >
        {expression}
      </div>

      {/* Main display */}
      <div
        className={`
          text-right font-bold font-mono tracking-tight transition-colors duration-200
          ${getFontSize(display)}
          ${isError ? 'text-red-400 text-2xl' : 'text-white'}
          ${resultFlash ? 'result-flash' : ''}
        `}
        style={{ fontFamily: 'JetBrains Mono, Courier New, monospace', wordBreak: 'break-all' }}
      >
        {display}
      </div>
    </div>
  );
}
