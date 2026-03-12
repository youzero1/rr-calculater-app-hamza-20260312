import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-3xl font-bold text-white mb-8 font-mono tracking-wider">
        <span className="text-calculator-equals">Calc</span>ulator
      </h1>
      <Calculator />
    </main>
  );
}
