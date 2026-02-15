// import Sidebar from "../components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
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
          <SidebarInset className="w-full h-full">{children}</SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
