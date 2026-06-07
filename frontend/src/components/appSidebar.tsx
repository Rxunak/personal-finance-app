"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";
import Link from "next/link";
import { useSidebar } from "../components/ui/sidebar";
import { usePathname } from "next/navigation";
import LogoLarge from "../icons/logo-large.svg";
import LogoSmall from "../icons/logo-small.svg";
import IconNavTransactions from "../icons/icon-nav-transactions.svg";
import {
  Activity,
  Bot,
  HandCoins,
  LayoutDashboard,
  HeartPulse,
  PiggyBank,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const navigationItems = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutDashboard,
    iconClassName:
      "group-hover/overview:text-green group-data-[active=true]/overview:text-green",
    match: (pathname: string) => pathname === "/",
    group: "overview",
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
    icon: HandCoins,
    iconClassName:
      "group-hover/budgets:text-green group-data-[active=true]/budgets:text-green",
    match: (pathname: string) =>
      pathname === "/budgets" || pathname === "/budget",
    group: "budgets",
  },
  {
    href: "/pots",
    label: "Pots",
    icon: PiggyBank,
    iconClassName:
      "group-hover/pots:text-green group-data-[active=true]/pots:text-green",
    match: (pathname: string) => pathname === "/pots",
    group: "pots",
  },
  {
    href: "/recurringBills",
    label: "Recurring Bills",
    icon: ReceiptText,
    iconClassName:
      "group-hover/recurring-bills:text-green group-data-[active=true]/recurring-bills:text-green",
    match: (pathname: string) => pathname === "/recurringBills",
    group: "recurring-bills",
  },
  {
    href: "/ai-coach",
    label: "AI Coach",
    icon: Sparkles,
    iconClassName:
      "group-hover/ai-coach:text-green group-data-[active=true]/ai-coach:text-green",
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
      <SidebarMenu className={isCollapsed ? "gap-4 pr-2" : "pr-2"}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const itemClassName = isCollapsed
            ? `group/${item.group} size-12 justify-center rounded-lg border-l-4 border-transparent px-0 hover:border-green hover:bg-white hover:text-black data-[active=true]:border-green data-[active=true]:bg-white data-[active=true]:text-black`
            : `group/${item.group} h-12 w-full justify-start rounded-lg border-l-4 border-transparent px-6 hover:border-green hover:bg-white hover:text-black data-[active=true]:border-green data-[active=true]:bg-white data-[active=true]:text-black`;

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                className={itemClassName}
                isActive={item.match(pathname)}
              >
                <Link
                  href={item.href}
                  className={`flex w-full items-center ${isCollapsed ? "justify-center" : "gap-5"}`}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center overflow-visible">
                    <Icon
                      className={`size-5 shrink-0 overflow-visible text-gray-400 transition-colors ${item.iconClassName}`}
                    />
                  </span>
                  {!isCollapsed ? <span>{item.label}</span> : null}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      <SidebarFooter className="pr-2">
        {!isCollapsed ? <ThemeToggle /> : null}
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
