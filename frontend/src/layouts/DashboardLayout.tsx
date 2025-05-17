
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Droplets, 
  Car, 
  Heart, 
  Settings, 
  LogOut,
  User,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  title: string;
  icon: React.ComponentType;
  path: string;
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  
  const navItems: NavItem[] = [
    { title: "Tổng quan", icon: LayoutDashboard, path: "/" },
    { title: "Quản lý hộ gia đình", icon: Users, path: "/households" },
    { title: "Quản lý cư dân", icon: User, path: "/residents" },
    { title: "Cấu hình phí", icon: FileText, path: "/fees" },
    { title: "Thu phí hàng tháng", icon: Calendar, path: "/monthly-fees" },
    { title: "Phí theo căn hộ", icon: Home, path: "/apartment-fees" },
    { title: "Tiện ích", icon: Droplets, path: "/utilities" },
    { title: "Quản lý bãi đỗ xe", icon: Car, path: "/parking" },
    { title: "Chiến dịch quyên góp", icon: Heart, path: "/campaigns" },
    { title: "Đóng góp", icon: Heart, path: "/donations" },
    { title: "Báo cáo thống kê", icon: FileText, path: "/reports" },
    { title: "Cài đặt tài khoản", icon: Settings, path: "/account" },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.title : "BlueMoon";
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar">
          <SidebarHeader className="flex flex-col gap-0 p-0">
            <div className="flex items-center justify-center p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 2L2 7L12 12L22 7L12 2Z" 
                      fill="currentColor" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M2 17L12 22L22 17" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M2 12L12 17L22 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h1 className="text-lg font-bold">BlueMoon</h1>
              </div>
            </div>
            <div className="p-4">
              <Input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-muted/50"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        isActive={location.pathname === item.path} 
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className="size-4 mr-2" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between p-4 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>QT</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Quản Trị Viên</span>
                  <span className="text-xs text-muted-foreground">admin@bluemoon.com</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="py-6 px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <SidebarTrigger className="mb-2" />
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">{getCurrentPageTitle()}</h1>
                  <p className="text-sm text-muted-foreground">Hệ thống quản lý phí tòa nhà BlueMoon</p>
                </div>
              </div>
            </div>
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
