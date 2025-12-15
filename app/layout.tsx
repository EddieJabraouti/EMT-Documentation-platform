import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMS Documentation Platform",
  description: "Guided EMS report documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

