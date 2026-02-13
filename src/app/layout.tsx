// import Sidebar from "../components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/appSidebar";

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
      <body className="bg-beige-100">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full ml-25">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
