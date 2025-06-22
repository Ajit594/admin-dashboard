import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricsCard } from "@/components/MetricsCard";
import { DataTable } from "@/components/DataTable";
import { CalendarWidget } from "@/components/CalendarWidget";
import { KanbanBoard } from "@/components/KanbanBoard";
import type { Metrics } from "@shared/schema";

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/metrics");
      if (!response.ok) throw new Error("Failed to fetch metrics");
      return response.json() as Promise<Metrics>;
    }
  });

  const { data: chartData } = useQuery({
    queryKey: ["/api/chart-data"],
    queryFn: async () => {
      const response = await fetch("/api/chart-data");
      if (!response.ok) throw new Error("Failed to fetch chart data");
      return response.json() as Promise<{ revenue: number[], users: number[], labels: string[] }>;
    }
  });

  const revenueData = chartData ? chartData.labels.map((label, index) => ({
    name: label,
    revenue: chartData.revenue[index]
  })) : [];

  const userData = chartData ? chartData.labels.map((label, index) => ({
    name: label,
    users: chartData.users[index]
  })) : [];

  return (
    <div className="flex-1 overflow-auto">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your data.
          </p>
        </div>
      </header>

      <main className="p-4 lg:p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <MetricsCard
            title="Total Revenue"
            value={metrics ? `$${metrics.revenue.toLocaleString()}` : "$0"}
            change="12.5% from last month"
            isPositive={true}
            icon={DollarSign}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          <MetricsCard
            title="Active Users"
            value={metrics ? metrics.users.toLocaleString() : "0"}
            change="8.2% from last month"
            isPositive={true}
            icon={Users}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
          />
          <MetricsCard
            title="Orders"
            value={metrics ? metrics.orders.toLocaleString() : "0"}
            change="3.1% from last month"
            isPositive={false}
            icon={ShoppingCart}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
          />
          <MetricsCard
            title="Conversion Rate"
            value={metrics ? `${metrics.conversionRate}%` : "0%"}
            change="0.3% from last month"
            isPositive={true}
            icon={TrendingUp}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBgColor="bg-orange-100 dark:bg-orange-900/20"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue Overview</CardTitle>
                <Select defaultValue="7days">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Growth</CardTitle>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    New Users
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="users" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <div className="mb-6 lg:mb-8">
          <DataTable />
        </div>

        {/* Calendar and Kanban Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <CalendarWidget />
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
}
