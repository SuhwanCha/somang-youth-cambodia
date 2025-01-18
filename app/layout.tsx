import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2025 소망교회 청소년부 캄보디아 해외선교",
  description: "2025 소망교회 청소년부 캄보디아 해외선교",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          style={{
            backgroundImage: 'url(/static/background.png)',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            minHeight: '100vh',
            maxWidth: '768px',
            margin: '0 auto',
            backgroundColor: 'white',
          }}
        >

          {children}
        </div>
      </body>
    </html>
  );
}
