import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import Dashboard from "@/pages/Dashboard";
import DataTables from "@/pages/DataTables";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Kanban from "@/pages/Kanban";
import NotFound from "@/pages/not-found";

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Theme Switcher */}
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b977?w=32&h=32&fit=crop&crop=face" 
                alt="User Avatar" 
              />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">Sarah Johnson</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tables" component={DataTables} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/kanban" component={Kanban} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <Router />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
