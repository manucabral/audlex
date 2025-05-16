import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
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
  title: "AudLex",
  description: "Gestión de audiencias y testimonios judiciales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#1E3A8A",
            },
            success: {
              iconTheme: {
                primary: "#1E3A8A",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC2626",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
