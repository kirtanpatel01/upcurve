import type { Metadata } from "next";
import { 
  // Inter, 
  // Work_Sans, 
  // Plus_Jakarta_Sans, 
  // Rubik,
  // Manrope,
  // Satisfy,
  Lexend
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import ConditionalShell from "@/components/ConditionalShell";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lexend.className} antialiased`}
      >
        <Providers>
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
