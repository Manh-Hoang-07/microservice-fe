import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { ToastProvider } from "@/lib/toast";
import ToastContainer from "@/components/UI/Feedback/ToastContainer";
import { AuthInitializer } from "@/components/Providers/AuthInitializer";

import { NavigationProgress } from "@/components/UI/Navigation/NavigationProgress";
import { QueryProvider } from "@/components/Providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import { getSystemConfig } from "@/lib/api/public/general";
import { env } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const systemConfig = await getSystemConfig("general");
  const siteName = (systemConfig?.siteName || env.siteName) as string;
  const siteDescription = (systemConfig?.siteDescription || env.siteDescription) as string;
  const favicon = systemConfig?.siteFavicon as string | undefined;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: (systemConfig?.metaKeywords as string) || "",
    icons: {
      icon: favicon || "/favicon.ico",
      shortcut: favicon || "/favicon.ico",
      apple: favicon || "/favicon.ico",
    },
    openGraph: {
      title: (systemConfig?.ogTitle as string) || siteName,
      description: (systemConfig?.ogDescription as string) || siteDescription,
      images: systemConfig?.ogImage ? [{ url: systemConfig.ogImage as string }] : [],
    },
    metadataBase: env.siteUrl ? new URL(env.siteUrl) : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <QueryProvider>
          <ToastProvider>
            <AuthInitializer />
            <ToastContainer />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}


