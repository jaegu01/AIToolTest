import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { locales, type Locale } from "@/i18n/config";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CommandPalette } from "@/components/command/CommandPalette";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "GlassCalc Pro",
  description: "Glassmorphism 스타일의 다기능 계산기",
  keywords: ["calculator", "glassmorphism", "engineering", "financial", "graph"],
  authors: [{ name: "GlassCalc Team" }],
  openGraph: {
    title: "GlassCalc Pro",
    description: "다양한 계산기를 하나의 아름다운 앱에서",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
              {children}
            </div>
            <CommandPalette />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
