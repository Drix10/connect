import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Carbon Trade X - Verify, Onboard, Trade Carbon Credits",
    template: "%s | Carbon Trade X",
  },
  description:
    "Comprehensive platform for verifying, onboarding, and simulating high-quality carbon credits from major registries including Verra, Gold Standard, and CCTS. Powered by CAD Trust Data Model 2.0.",
  keywords: [
    "carbon credits",
    "carbon trading",
    "carbon verification",
    "Verra",
    "Gold Standard",
    "CCTS",
    "CAD Trust",
    "carbon offset",
    "climate action",
    "sustainability",
  ],
  authors: [{ name: "Carbon Trade X" }],
  creator: "Carbon Trade X",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://carbontradex.com",
    title: "Carbon Trade X - Verify, Onboard, Trade Carbon Credits",
    description:
      "Comprehensive platform for verifying, onboarding, and simulating high-quality carbon credits from major registries",
    siteName: "Carbon Trade X",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carbon Trade X - Verify, Onboard, Trade Carbon Credits",
    description:
      "Comprehensive platform for verifying, onboarding, and simulating high-quality carbon credits from major registries",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
