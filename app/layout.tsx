import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { mantineTheme } from '@/lib/mantine-theme';
import { CookieConsent } from '@/components/marketing/CookieConsent';
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Stack Sans Headline from Google Fonts
// Note: Loading via CSS since next/font/google doesn't support this font yet
// Font will be loaded through globals.css

export const metadata: Metadata = {
  title: "VoiceCraft - AI-Powered Voice Synthesis",
  description: "Create professional voice content in seconds with AI-powered voice synthesis and cloning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <MantineProvider theme={mantineTheme} defaultColorScheme="light">
          <Notifications position="top-right" zIndex={1000} />
          {children}
          <CookieConsent />
        </MantineProvider>
      </body>
    </html>
  );
}
