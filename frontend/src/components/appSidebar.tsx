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
import { Activity, Bot, HeartPulse, Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const navigationItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: IconNavOverview,
    iconClassName: "group-hover/dashboard:text-green group-data-[active=true]/dashboard:text-green",
    match: (pathname: string) => pathname === "/",
    group: "dashboard",
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: IconNavTransactions,
    iconClassName:
      "group-hover/transactions:text-green group-data-[active=true]/transactions:text-green",
    match: (pathname: string) => pathname === "/transactions",
    group: "transactions",
  },
  {
    href: "/budgets",
    label: "Budgets",
    icon: IconNavBudgets,
    iconClassName: "group-hover/budgets:text-green group-data-[active=true]/budgets:text-green",
    match: (pathname: string) => pathname === "/budgets" || pathname === "/budget",
    group: "budgets",
  },
  {
    href: "/pots",
    label: "Pots",
    icon: IconNavPots,
    iconClassName: "group-hover/pots:text-green group-data-[active=true]/pots:text-green",
    match: (pathname: string) => pathname === "/pots",
    group: "pots",
  },
  {
    href: "/recurringBills",
    label: "Recurring Bills",
    icon: IconNavRecurringBills,
    iconClassName:
      "group-hover/recurring-bills:text-green group-data-[active=true]/recurring-bills:text-green",
    match: (pathname: string) => pathname === "/recurringBills",
    group: "recurring-bills",
  },
  {
    href: "/summariseStatements",
    label: "Summarise Statements",
    icon: Sparkles,
    iconClassName:
      "group-hover/summarise-statements:text-green group-data-[active=true]/summarise-statements:text-green",
    match: (pathname: string) => pathname === "/summariseStatements",
    group: "summarise-statements",
  },
  {
    href: "/ai-coach",
    label: "AI Coach",
    icon: Sparkles,
    iconClassName: "group-hover/ai-coach:text-green group-data-[active=true]/ai-coach:text-green",
    match: (pathname: string) => pathname === "/ai-coach",
    group: "ai-coach",
  },
  {
    href: "/ai-assistant",
    label: "AI Assistant",
    icon: Bot,
    iconClassName:
      "group-hover/ai-assistant:text-green group-data-[active=true]/ai-assistant:text-green",
    match: (pathname: string) => pathname === "/ai-assistant",
    group: "ai-assistant",
  },
  {
    href: "/financial-health",
    label: "Financial Health",
    icon: HeartPulse,
    iconClassName:
      "group-hover/financial-health:text-green group-data-[active=true]/financial-health:text-green",
    match: (pathname: string) => pathname === "/financial-health",
    group: "financial-health",
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: Activity,
    iconClassName:
      "group-hover/subscriptions:text-green group-data-[active=true]/subscriptions:text-green",
    match: (pathname: string) => pathname === "/subscriptions",
    group: "subscriptions",
  },
] as const;

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
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const itemClassName = isCollapsed
            ? `group/${item.group} w-10 p-3 data-[active=true]:border-l-4 data-[active=true]:bg-white data-[active=true]:text-black border-green`
            : `group/${item.group} p-6 data-[active=true]:border-l-4 data-[active=true]:bg-white data-[active=true]:text-black border-green`;

          return (
            <SidebarMenuButton
              key={item.href}
              className={itemClassName}
              isActive={item.match(pathname)}
            >
              <Link href={item.href} className="flex items-center gap-5">
                <Icon
                  className={`size-4 text-gray-400 transition-colors ${item.iconClassName}`}
                />
                {!isCollapsed ? item.label : ""}
              </Link>
            </SidebarMenuButton>
          );
        })}
      </SidebarMenu>
      <SidebarFooter>
        {!isCollapsed ? <ThemeToggle /> : null}
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
