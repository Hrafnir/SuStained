import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Sustained · Oppfinnelsenes tid',
  description:
    'Et digitalt brettspill om kunnskap, natur og industri. Bygg ditt land gjennom 1700-tallet.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}
