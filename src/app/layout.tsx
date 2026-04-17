import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlockBoard",
  description: "A Trello-style task management app inspired by Blocklabs",
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