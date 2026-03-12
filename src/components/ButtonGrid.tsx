'use client';

import CalcButton from './CalcButton';

interface ButtonGridProps {
  onButton: (label: string) => void;
  activeOperator: string | null;
  waitingForOperand2: boolean;
}

type ButtonConfig = {
  label: string;
  type: 'digit' | 'operator' | 'equals' | 'clear' | 'function' | 'zero';
  colSpan?: number;
};

const buttons: ButtonConfig[] = [
  { label: 'C', type: 'clear' },
  { label: '+/-', type: 'function' },
  { label: '%', type: 'function' },
  { label: '÷', type: 'operator' },

  { label: '7', type: 'digit' },
  { label: '8', type: 'digit' },
  { label: '9', type: 'digit' },
  { label: '×', type: 'operator' },

  { label: '4', type: 'digit' },
  { label: '5', type: 'digit' },
  { label: '6', type: 'digit' },
  { label: '−', type: 'operator' },

  { label: '1', type: 'digit' },
  { label: '2', type: 'digit' },
  { label: '3', type: 'digit' },
  { label: '+', type: 'operator' },

  { label: '⌫', type: 'function' },
  { label: '0', type: 'digit' },
  { label: '.', type: 'digit' },
  { label: '=', type: 'equals' },
];

export default function ButtonGrid({ onButton, activeOperator, waitingForOperand2 }: ButtonGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 p-5">
      {buttons.map((btn, index) => (
        <CalcButton
          key={index}
          label={btn.label}
          type={btn.type}
          isActive={
            btn.type === 'operator' &&
            activeOperator === btn.label &&
            waitingForOperand2
          }
          onClick={() => onButton(btn.label)}
        />
      ))}
    </div>
  );
}
