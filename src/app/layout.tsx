import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Minder",
  description: "Simple expense tracker",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="antialiasing max-w-2xl sm:mx-auto">
          <div className="flex-auto min-w-0 flex flex-col">{children}</div>
        </main>
      </body>
    </html>
  );
}
