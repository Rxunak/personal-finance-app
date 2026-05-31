// import Sidebar from "../components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/appSidebar";
import QueryProvider from "./queryProvider";

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
      <body className="bg-background text-foreground">
        <QueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-svh w-full overflow-x-hidden overflow-y-auto">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
