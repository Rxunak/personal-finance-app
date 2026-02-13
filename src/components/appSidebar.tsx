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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>finance</SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton>
          <Link href="/">Overview</Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/transactions">Transactions</Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/budget">Budgets</Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/pots">Pots</Link>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Link href="/recurringBills">Recurring Bills</Link>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
