import './globals.css';

export const metadata = {
  title: 'PRAKASH | AI-Driven Polar Energy Intelligence Console',
  description: 'AI-Driven Smart Energy Management System for Polar Research Stations Bharati & Maitri',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#2D3436] antialiased">
        {children}
      </body>
    </html>
  );
}
