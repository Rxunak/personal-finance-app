import Sidebar from "../_components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personalised Finance Tracker",
  description: "A simple way to track your expenses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <aside className="outline-2 outline-red-500 w-1/5">
            <Sidebar />
          </aside>
          <main className="outline-2 outline-red-200 w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
