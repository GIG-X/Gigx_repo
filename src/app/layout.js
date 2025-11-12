// app/layout.js
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata = {
  title: "GiGX — Build fast, scale clean",
  description: "Ship MVPs quickly with a sleek UI and sensible defaults.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <NavBar />
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
