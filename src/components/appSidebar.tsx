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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Image
          src="/images/logo-large.svg"
          width={150}
          height={150}
          alt="logo"
        />
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton>
          <Link href="/" className="flex gap-5">
            <Image
              src="/images/icon-nav-overview.svg"
              width={18}
              height={18}
              alt="logo"
            />
            Overview
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/transactions" className="flex gap-5">
            <Image
              src="/images/icon-nav-transactions.svg"
              width={18}
              height={18}
              alt="logo"
            />
            Transactions
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/budget" className="flex gap-5">
            <Image
              src="/images/icon-nav-budgets.svg"
              width={18}
              height={18}
              alt="logo"
            />
            Budgets
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/pots" className="flex gap-5">
            <Image
              src="/images/icon-nav-pots.svg"
              width={18}
              height={18}
              alt="logo"
            />
            Pots
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/recurringBills" className="flex gap-5">
            <Image
              src="/images/icon-recurring-bills.svg"
              width={18}
              height={18}
              alt="logo"
            />
            Recurring Bills
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
