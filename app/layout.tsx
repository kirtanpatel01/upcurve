import type { Metadata } from "next";
import {
  // Inter,
  // Work_Sans,
  // Plus_Jakarta_Sans,
  // Rubik,
  // Manrope,
  // Satisfy,
  Lexend,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import NetworkStatus from "@/components/network-status";

// const inter = Inter();
// const workSans = Work_Sans()
// const plusJakartaSans = Plus_Jakarta_Sans()
// const rubik = Rubik()
// const manrope = Manrope()
const lexend = Lexend();

export const metadata: Metadata = {
  title: "Boost your productivity",
  description:
    "Upcurve provides minimal UI to manage and monitor your progress.",
    icons: {
      icon: "/favicon.svg"
    }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.className} antialiased`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
          <NetworkStatus />
        </ThemeProvider>
      </body>
    </html>
  );
}
