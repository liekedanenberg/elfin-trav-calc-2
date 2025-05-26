import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700']
});

export const metadata = {
  title: 'Elfin Reisbudget-Calculator',
  description: 'Bereken het budget voor je droomreis met de Elfin reisbudget-calculator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
