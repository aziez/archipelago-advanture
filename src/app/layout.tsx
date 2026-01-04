import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/app/globals.css';
import ClientI18nProvider from '@/providers/ClientI18nProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// 1. SETUP METADATA SEO LENGKAP
export const metadata: Metadata = {
  // Title Template: Halaman lain bisa punya judul sendiri, tapi default-nya ini
  title: {
    default: 'M. Abdul Aziz | Creative Full Stack Developer',
    template: '%s | M. Abdul Aziz',
  },
  description:
    'Explore the interactive 3D portfolio of M. Abdul Aziz. A Full Stack Developer specializing in Next.js, React Three Fiber, and immersive web experiences.',

  // Kata kunci untuk Google Indexing
  keywords: [
    'M. Abdul Aziz',
    'Full Stack Developer',
    'Creative Developer',
    '3D Portfolio',
    'React Three Fiber',
    'Next.js',
    'Three.js',
    'Webgl',
    'Jakarta',
    'Indonesia',
  ],

  authors: [{ name: 'M. Abdul Aziz', url: 'https://hi-aziz.vercel.app' }], // Ganti dengan domain aslimu nanti
  creator: 'M. Abdul Aziz',

  // Konfigurasi Open Graph (Tampilan saat share di WA/FB/LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hi-aziz.vercel.app', // Ganti dengan domain aslimu
    title: 'M. Abdul Aziz | Creative Full Stack Developer',
    description:
      'Experience an interactive 3D journey through my projects and skills.',
    siteName: 'Aziz 3D Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Pastikan bikin gambar ini di folder public/
        width: 1200,
        height: 630,
        alt: 'M. Abdul Aziz - 3D Portfolio',
      },
    ],
  },

  // Konfigurasi Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'M. Abdul Aziz | Creative Full Stack Developer',
    description: 'Interactive 3D Portfolio featuring React Three Fiber.',
    images: ['/og-image.jpg'], // Gambar yang sama dengan OG
    creator: '@Aziz', // Ganti dengan username twitter/x kamu
  },

  // Icon Website
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Agar di-crawl oleh Google Bot
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// 2. SETUP VIEWPORT (Terpisah di Next.js terbaru)
export const viewport: Viewport = {
  themeColor: '#0f172a', // Warna bar browser di HP (sesuai tema gelap kamu)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Mencegah zoom paksa yang merusak UX 3D
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // Suppress hydration warning penting karena kita main manipulasi DOM/Class
      suppressHydrationWarning
    >
      <body className="bg-slate-950 text-slate-100 overflow-hidden">
        <ClientI18nProvider>{children}</ClientI18nProvider>
      </body>
    </html>
  );
}
