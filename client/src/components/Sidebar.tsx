import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Table, 
  BarChart3, 
  Calendar, 
  Trello, 
  Settings,
  Menu,
  ChartLine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreferencesDialog } from "@/components/PreferencesDialog";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Data Tables", href: "/tables", icon: Table },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Kanban", href: "/kanban", icon: Trello },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0",
        "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto",
        collapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ChartLine className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-gray-900 dark:text-white">AdminPro</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed && "px-2"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
        
        {!collapsed && (
          <div className="mt-8 px-3">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </p>
            <div className="mt-2">
              <PreferencesDialog />
            </div>
          </div>
        )}
      </nav>
    </div>
    </>
  );
}
