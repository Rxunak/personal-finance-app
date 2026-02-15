"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../components/ui/sidebar";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={isCollapsed ? "p-4 mb-3" : "p-6"}>
        <Image
          src={
            isCollapsed ? "/images/logo-small.svg" : "/images/logo-large.svg"
          }
          width={isCollapsed ? 10 : 120}
          height={120}
          alt="logo"
        />
      </SidebarHeader>
      <SidebarMenu className={isCollapsed ? "gap-4" : ""}>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/"}
        >
          <Link href="/" className="flex gap-5">
            <Image
              src="/images/icon-nav-overview.svg"
              width={18}
              height={18}
              alt="logo"
            />
            {!isCollapsed ? "Overview" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/transactions"}
        >
          <Link href="/transactions" className="flex gap-5">
            <Image
              src="/images/icon-nav-transactions.svg"
              width={18}
              height={18}
              alt="logo"
            />
            {!isCollapsed ? " Transactions" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/budget"}
        >
          <Link href="/budget" className="flex gap-5">
            <Image
              src="/images/icon-nav-budgets.svg"
              width={18}
              height={18}
              alt="logo"
            />

            {!isCollapsed ? "Budgets" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/pots"}
        >
          <Link href="/pots" className="flex gap-5">
            <Image
              src="/images/icon-nav-pots.svg"
              width={18}
              height={18}
              alt="logo"
            />
            {!isCollapsed ? "Pots" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/recurringBills"}
        >
          <Link href="/recurringBills" className="flex gap-5">
            <Image
              src="/images/icon-recurring-bills.svg"
              width={18}
              height={18}
              alt="logo"
            />
            {!isCollapsed ? "Recurring bills" : ""}
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
