"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";
import Link from "next/link";
import { useSidebar } from "../components/ui/sidebar";
import { usePathname } from "next/navigation";
import LogoLarge from "../icons/logo-large.svg";
import LogoSmall from "../icons/logo-small.svg";
import IconNavBudgets from "../icons/icon-nav-budgets.svg";
import IconNavOverview from "../icons/icon-nav-overview.svg";
import IconNavPots from "../icons/icon-nav-pots.svg";
import IconNavRecurringBills from "../icons/icon-nav-recurring-bills.svg";
import IconNavTransactions from "../icons/icon-nav-transactions.svg";
export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={isCollapsed ? "p-4 mb-3" : "p-6"}>
        {isCollapsed ? <LogoSmall /> : <LogoLarge />}
      </SidebarHeader>
      <SidebarMenu className={isCollapsed ? "gap-4" : ""}>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "group/overview p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "group/overview p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/"}
        >
          <Link href="/" className="flex gap-5 items-center">
            <IconNavOverview className="text-gray-400 group-hover/overview:text-green group-data-[active=true]/overview:text-green transition-colors" />
            {!isCollapsed ? "Overview" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "group/transactions p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "group/transactions p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/transactions"}
        >
          <Link href="/transactions" className="flex gap-5 items-center">
            <IconNavTransactions className="text-gray-400 group-hover/transactions:text-green group-data-[active=true]/transactions:text-green transition-colors" />
            {!isCollapsed ? " Transactions" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "group/budgets p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "group/budgets p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/budget"}
        >
          <Link href="/budget" className="flex gap-5 items-center">
            <IconNavBudgets className="text-gray-400 group-hover/budgets:text-green group-data-[active=true]/budgets:text-green transition-colors" />

            {!isCollapsed ? "Budgets" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "group/pots p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "group/pots p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/pots"}
        >
          <Link href="/pots" className="flex gap-5 items-center">
            <IconNavPots className="text-gray-400 group-hover/pots:text-green group-data-[active=true]/pots:text-green transition-colors" />
            {!isCollapsed ? "Pots" : ""}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          className={
            isCollapsed
              ? "group/recurring-bills p-3 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green w-10"
              : "group/recurring-bills p-6 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-l-4 border-green"
          }
          isActive={pathname === "/recurringBills"}
        >
          <Link href="/recurringBills" className="flex gap-5 items-center">
            <IconNavRecurringBills className="text-gray-400 group-hover/recurring-bills:text-green group-data-[active=true]/recurring-bills:text-green transition-colors" />
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
