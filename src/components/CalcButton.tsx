'use client';

interface CalcButtonProps {
  label: string;
  type: 'digit' | 'operator' | 'equals' | 'clear' | 'function' | 'zero';
  isActive?: boolean;
  onClick: () => void;
}

const typeStyles: Record<CalcButtonProps['type'], string> = {
  digit: 'bg-slate-700 hover:bg-slate-600 text-white',
  operator: 'bg-orange-500 hover:bg-orange-400 text-white',
  equals: 'bg-emerald-500 hover:bg-emerald-400 text-white',
  clear: 'bg-red-500 hover:bg-red-400 text-white',
  function: 'bg-slate-600 hover:bg-slate-500 text-white',
  zero: 'bg-slate-700 hover:bg-slate-600 text-white',
};

export default function CalcButton({ label, type, isActive = false, onClick }: CalcButtonProps) {
  const base = typeStyles[type];
  const active = isActive ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent brightness-125' : '';

  return (
    <button
      onClick={onClick}
      className={`
        calculator-button
        ${base}
        ${active}
        rounded-2xl
        h-14
        w-full
        font-semibold
        text-xl
        font-mono
        shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-white/30
      `}
      style={{ fontFamily: 'JetBrains Mono, Courier New, monospace' }}
      aria-label={label}
    >
      {label}
    </button>
  );
}
