import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculator App',
  description: 'A fully functional calculator with history',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
