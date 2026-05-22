"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  BookText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Produk", url: "/dashboard/produk", icon: Package },
  { title: "Pesanan", url: "/dashboard/pesanan", icon: ShoppingCart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) =>
    path === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(path);

  const handleLogout = () => {
    // hapus local storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    // trigger update state/tab lain
    window.dispatchEvent(new Event("storage"));

    // redirect ke halaman utama
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-lg shadow-[var(--shadow-yellow)]">
            B
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-black tracking-tight text-sidebar-foreground">
                BAKUL OLI
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Keluar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
