import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";

import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://taskflow.imran.dev"),
  title: "TaskFlow - Modern To-Do App",
  description: "A beautiful, modern to-do application to help you stay organized and get things done.",
  keywords: ["TaskFlow", "Todo", "Productivity", "Next.js", "TypeScript"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/mobile-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/mobile-logo.svg",
  },
  openGraph: {
    title: "TaskFlow - Modern To-Do App",
    description: "A beautiful, modern to-do application to help you stay organized and get things done.",
    images: [{ url: "/full-logo.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
