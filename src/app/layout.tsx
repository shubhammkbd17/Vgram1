import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AIChatbot from '@/components/ai-chatbot';

export const metadata: Metadata = {
  title: 'Vgram | Connecting Rural & Urban Markets Directly',
  description: 'Direct-to-consumer agricultural and artisan marketplace supporting organic farming, fresh produce, handicrafts, and fair trade pricing.',
  keywords: 'farmers market, fresh vegetables, organic wheat, handicrafts, direct trade, rural producers, urban consumers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          precedence="default"
        />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          precedence="default"
        />
      </head>
      <body className="antialiased bg-stone-50 text-stone-900 min-h-screen flex flex-col justify-between">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AIChatbot />
        </AppProvider>
      </body>
    </html>
  );
}
