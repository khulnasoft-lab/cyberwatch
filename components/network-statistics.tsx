"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Activity, Shield, Globe, Clock } from "lucide-react"
import { useState } from "react"

interface NetworkStats {
  totalConnections: number
  allowedConnections: number
  blockedConnections: number
  topApplications: Array<{ name: string; connections: number; data: number }>
  hourlyActivity: Array<{ hour: string; allowed: number; blocked: number }>
  dailyActivity: Array<{ day: string; connections: number; data: number }>
  protocolDistribution: Array<{ protocol: string; count: number; percentage: number }>
  threatLevel: "low" | "medium" | "high"
}

const mockStats: NetworkStats = {
  totalConnections: 1247,
  allowedConnections: 1089,
  blockedConnections: 158,
  topApplications: [
    { name: "Chrome", connections: 342, data: 1.2 },
    { name: "Slack", connections: 156, data: 0.8 },
    { name: "VS Code", connections: 89, data: 0.3 },
    { name: "Discord", connections: 67, data: 0.5 },
    { name: "Spotify", connections: 45, data: 2.1 },
  ],
  hourlyActivity: [
    { hour: "00", allowed: 12, blocked: 2 },
    { hour: "01", allowed: 8, blocked: 1 },
    { hour: "02", allowed: 5, blocked: 0 },
    { hour: "03", allowed: 3, blocked: 1 },
    { hour: "04", allowed: 7, blocked: 0 },
    { hour: "05", allowed: 15, blocked: 2 },
    { hour: "06", allowed: 28, blocked: 3 },
    { hour: "07", allowed: 45, blocked: 5 },
    { hour: "08", allowed: 67, blocked: 8 },
    { hour: "09", allowed: 89, blocked: 12 },
    { hour: "10", allowed: 95, blocked: 15 },
    { hour: "11", allowed: 87, blocked: 11 },
    { hour: "12", allowed: 76, blocked: 9 },
    { hour: "13", allowed: 82, blocked: 13 },
    { hour: "14", allowed: 91, blocked: 16 },
    { hour: "15", allowed: 88, blocked: 14 },
    { hour: "16", allowed: 79, blocked: 10 },
    { hour: "17", allowed: 65, blocked: 8 },
    { hour: "18", allowed: 52, blocked: 6 },
    { hour: "19", allowed: 38, blocked: 4 },
    { hour: "20", allowed: 29, blocked: 3 },
    { hour: "21", allowed: 22, blocked: 2 },
    { hour: "22", allowed: 18, blocked: 1 },
    { hour: "23", allowed: 14, blocked: 1 },
  ],
  dailyActivity: [
    { day: "Mon", connections: 187, data: 2.3 },
    { day: "Tue", connections: 203, data: 2.8 },
    { day: "Wed", connections: 156, data: 1.9 },
    { day: "Thu", connections: 234, data: 3.1 },
    { day: "Fri", connections: 198, data: 2.5 },
    { day: "Sat", connections: 134, data: 1.7 },
    { day: "Sun", connections: 135, data: 1.6 },
  ],
  protocolDistribution: [
    { protocol: "HTTPS", count: 789, percentage: 63.3 },
    { protocol: "HTTP", count: 234, percentage: 18.8 },
    { protocol: "SSH", count: 89, percentage: 7.1 },
    { protocol: "FTP", count: 67, percentage: 5.4 },
    { protocol: "Other", count: 68, percentage: 5.4 },
  ],
  threatLevel: "low",
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

export function NetworkStatistics() {
  const [timeRange, setTimeRange] = useState("24h")
  const stats = mockStats

  const allowedPercentage = ((stats.allowedConnections / stats.totalConnections) * 100).toFixed(1)
  const blockedPercentage = ((stats.blockedConnections / stats.totalConnections) * 100).toFixed(1)

  const formatBytes = (gb: number) => {
    return `${gb.toFixed(1)} GB`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Network Statistics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive analysis of network activity and security metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalConnections.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allowed</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.allowedConnections.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{allowedPercentage}% of total connections</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blockedConnections.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{blockedPercentage}% of total connections</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Globe className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  stats.threatLevel === "low" ? "default" : stats.threatLevel === "medium" ? "secondary" : "destructive"
                }
                className="text-sm"
              >
                {stats.threatLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Based on recent activity</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>24-Hour Activity</span>
            </CardTitle>
            <CardDescription>Connection patterns throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="allowed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="blocked" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Protocol Distribution */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Protocol Distribution</CardTitle>
            <CardDescription>Breakdown of connection protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.protocolDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ protocol, percentage }) => `${protocol} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.protocolDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Applications */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Top Applications</CardTitle>
            <CardDescription>Most active applications by connection count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topApplications} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="connections" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Connection trends over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="connections" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Usage Table */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Application Data Usage</CardTitle>
          <CardDescription>Data transfer by application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topApplications.map((app, index) => (
              <div
                key={app.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{app.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{app.connections} connections</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatBytes(app.data)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {((app.data / stats.topApplications.reduce((sum, a) => sum + a.data, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
