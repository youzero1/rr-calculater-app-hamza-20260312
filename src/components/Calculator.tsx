'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import HistoryPanel from './HistoryPanel';

export type CalculatorState = {
  display: string;
  expression: string;
  operator: string | null;
  operand1: number | null;
  isResult: boolean;
  isError: boolean;
  waitingForOperand2: boolean;
};

export type HistoryEntry = {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
};

const initialState: CalculatorState = {
  display: '0',
  expression: '',
  operator: null,
  operand1: null,
  isResult: false,
  isError: false,
  waitingForOperand2: false,
};

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [resultFlash, setResultFlash] = useState(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, fetchHistory]);

  const saveToHistory = useCallback(async (expression: string, result: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      if (showHistory) {
        fetchHistory();
      }
    } catch (err) {
      console.error('Failed to save history', err);
    }
  }, [showHistory, fetchHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history', err);
    }
  }, []);

  const triggerFlash = useCallback(() => {
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    setResultFlash(true);
    flashTimeoutRef.current = setTimeout(() => setResultFlash(false), 400);
  }, []);

  const formatNumber = (num: number): string => {
    if (!isFinite(num)) return 'Error';
    const str = num.toString();
    if (str.includes('e')) return str;
    if (Math.abs(num) >= 1e15) return num.toExponential(6);
    if (Number.isInteger(num)) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    const parts = str.split('.');
    const intPart = parseInt(parts[0]).toLocaleString('en-US');
    return `${intPart}.${parts[1]}`;
  };

  const calculate = useCallback((op1: number, op2: number, operator: string): number => {
    switch (operator) {
      case '+':
        return op1 + op2;
      case '−':
      case '-':
        return op1 - op2;
      case '×':
      case '*':
        return op1 * op2;
      case '÷':
      case '/':
        return op1 / op2;
      default:
        return op2;
    }
  }, []);

  const handleDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.isError) return prev;

      if (prev.isResult) {
        return {
          ...initialState,
          display: digit === '0' ? '0' : digit,
          expression: '',
        };
      }

      if (prev.waitingForOperand2) {
        return {
          ...prev,
          display: digit,
          waitingForOperand2: false,
        };
      }

      const currentDisplay = prev.display;
      if (currentDisplay === '0' && digit !== '.') {
        return { ...prev, display: digit };
      }
      if (currentDisplay.replace(/[^0-9]/g, '').length >= 15) {
        return prev;
      }

      return { ...prev, display: currentDisplay + digit };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.isError) return prev;

      if (prev.isResult) {
        return { ...initialState, display: '0.', expression: '' };
      }

      if (prev.waitingForOperand2) {
        return { ...prev, display: '0.', waitingForOperand2: false };
      }

      if (prev.display.includes('.')) return prev;

      return { ...prev, display: prev.display + '.' };
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    setState((prev) => {
      if (prev.isError) return prev;

      const currentValue = parseFloat(prev.display.replace(/,/g, ''));

      if (prev.operand1 !== null && !prev.waitingForOperand2 && !prev.isResult) {
        const result = calculate(prev.operand1, currentValue, prev.operator!);
        if (!isFinite(result)) {
          return {
            ...initialState,
            display: 'Division by zero',
            expression: '',
            isError: true,
          };
        }
        const formatted = formatNumber(result);
        return {
          ...prev,
          display: formatted,
          expression: `${formatted} ${op}`,
          operand1: result,
          operator: op,
          waitingForOperand2: true,
          isResult: false,
          isError: false,
        };
      }

      return {
        ...prev,
        expression: `${prev.display} ${op}`,
        operand1: currentValue,
        operator: op,
        waitingForOperand2: true,
        isResult: false,
      };
    });
  }, [calculate]);

  const handleEquals = useCallback(() => {
    setState((prev) => {
      if (prev.isError || prev.operand1 === null || prev.operator === null) return prev;
      if (prev.waitingForOperand2) return prev;

      const currentValue = parseFloat(prev.display.replace(/,/g, ''));
      const result = calculate(prev.operand1, currentValue, prev.operator);

      if (!isFinite(result)) {
        const expr = `${prev.expression} ${prev.display}`;
        saveToHistory(expr.trim(), 'Division by zero');
        triggerFlash();
        return {
          ...initialState,
          display: 'Division by zero',
          expression: '',
          isError: true,
        };
      }

      const formatted = formatNumber(result);
      const expr = `${prev.expression} ${prev.display}`;
      saveToHistory(expr.trim(), formatted.replace(/,/g, ''));
      triggerFlash();

      return {
        ...prev,
        display: formatted,
        expression: `${expr} =`,
        operand1: result,
        operator: null,
        waitingForOperand2: false,
        isResult: true,
        isError: false,
      };
    });
  }, [calculate, saveToHistory, triggerFlash]);

  const handleClear = useCallback(() => {
    setState(initialState);
  }, []);

  const handleBackspace = useCallback(() => {
    setState((prev) => {
      if (prev.isError) return { ...initialState };
      if (prev.isResult) return { ...initialState };
      if (prev.waitingForOperand2) return prev;

      const newDisplay = prev.display.length > 1
        ? prev.display.slice(0, -1)
        : '0';

      return { ...prev, display: newDisplay };
    });
  }, []);

  const handlePlusMinus = useCallback(() => {
    setState((prev) => {
      if (prev.isError) return prev;
      const val = parseFloat(prev.display.replace(/,/g, ''));
      if (val === 0) return prev;
      const newVal = -val;
      return { ...prev, display: formatNumber(newVal) };
    });
  }, []);

  const handlePercent = useCallback(() => {
    setState((prev) => {
      if (prev.isError) return prev;
      const val = parseFloat(prev.display.replace(/,/g, ''));
      const result = prev.operand1 !== null
        ? (prev.operand1 * val) / 100
        : val / 100;
      return { ...prev, display: formatNumber(result) };
    });
  }, []);

  const handleButton = useCallback((label: string) => {
    if (label === 'C') return handleClear();
    if (label === '⌫') return handleBackspace();
    if (label === '=') return handleEquals();
    if (label === '.') return handleDecimal();
    if (label === '+/-') return handlePlusMinus();
    if (label === '%') return handlePercent();
    if (['+', '−', '×', '÷'].includes(label)) return handleOperator(label);
    if (/^[0-9]$/.test(label)) return handleDigit(label);
  }, [
    handleClear, handleBackspace, handleEquals, handleDecimal,
    handlePlusMinus, handlePercent, handleOperator, handleDigit
  ]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const key = e.key;
      if (/^[0-9]$/.test(key)) { e.preventDefault(); handleDigit(key); }
      else if (key === '.') { e.preventDefault(); handleDecimal(); }
      else if (key === '+') { e.preventDefault(); handleOperator('+'); }
      else if (key === '-') { e.preventDefault(); handleOperator('−'); }
      else if (key === '*') { e.preventDefault(); handleOperator('×'); }
      else if (key === '/') { e.preventDefault(); handleOperator('÷'); }
      else if (key === 'Enter' || key === '=') { e.preventDefault(); handleEquals(); }
      else if (key === 'Escape' || key === 'c' || key === 'C') { e.preventDefault(); handleClear(); }
      else if (key === 'Backspace') { e.preventDefault(); handleBackspace(); }
      else if (key === '%') { e.preventDefault(); handlePercent(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleClear, handleBackspace, handlePercent]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-2xl">
      <div className="w-full max-w-sm mx-auto lg:mx-0">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1e1e3a 0%, #12122a 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <Display
            display={state.display}
            expression={state.expression}
            isError={state.isError}
            resultFlash={resultFlash}
          />
          <ButtonGrid
            onButton={handleButton}
            activeOperator={state.operator}
            waitingForOperand2={state.waitingForOperand2}
          />
        </div>
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="mt-4 w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: showHistory
              ? 'rgba(78, 204, 163, 0.2)'
              : 'rgba(255,255,255,0.07)',
            color: showHistory ? '#4ecca3' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${showHistory ? 'rgba(78,204,163,0.4)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {showHistory ? '▲ Hide History' : '▼ Show History'}
        </button>
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          loading={historyLoading}
          onClear={clearHistory}
          onRefresh={fetchHistory}
        />
      )}
    </div>
  );
}
