"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Activity, TrendingUp, Wifi, Download, Upload, AlertTriangle, Clock, Zap, Monitor } from "lucide-react"

interface BandwidthData {
  timestamp: string
  download: number
  upload: number
  total: number
}

interface ApplicationUsage {
  name: string
  download: number
  upload: number
  total: number
  percentage: number
  color: string
}

interface BandwidthAlert {
  id: string
  type: "threshold" | "spike" | "anomaly"
  severity: "low" | "medium" | "high"
  message: string
  timestamp: Date
  value: number
  threshold: number
}

const mockBandwidthData: BandwidthData[] = [
  { timestamp: "00:00", download: 15.2, upload: 8.7, total: 23.9 },
  { timestamp: "00:05", download: 18.5, upload: 12.3, total: 30.8 },
  { timestamp: "00:10", download: 22.1, upload: 15.6, total: 37.7 },
  { timestamp: "00:15", download: 28.9, upload: 18.2, total: 47.1 },
  { timestamp: "00:20", download: 35.4, upload: 22.8, total: 58.2 },
  { timestamp: "00:25", download: 42.7, upload: 28.1, total: 70.8 },
  { timestamp: "00:30", download: 38.2, upload: 25.4, total: 63.6 },
  { timestamp: "00:35", download: 31.8, upload: 19.7, total: 51.5 },
  { timestamp: "00:40", download: 26.3, upload: 16.2, total: 42.5 },
  { timestamp: "00:45", download: 20.9, upload: 13.8, total: 34.7 },
  { timestamp: "00:50", download: 17.4, upload: 11.2, total: 28.6 },
  { timestamp: "00:55", download: 14.8, upload: 9.5, total: 24.3 },
]

const mockAppUsage: ApplicationUsage[] = [
  { name: "Chrome", download: 45.2, upload: 12.8, total: 58.0, percentage: 35.2, color: "#3b82f6" },
  { name: "Slack", download: 18.7, upload: 15.3, total: 34.0, percentage: 20.6, color: "#10b981" },
  { name: "Spotify", download: 25.1, upload: 2.4, total: 27.5, percentage: 16.7, color: "#f59e0b" },
  { name: "VS Code", download: 12.3, upload: 8.9, total: 21.2, percentage: 12.9, color: "#8b5cf6" },
  { name: "Zoom", download: 8.4, upload: 7.2, total: 15.6, percentage: 9.5, color: "#ef4444" },
  { name: "Others", download: 6.8, upload: 1.9, total: 8.7, percentage: 5.3, color: "#6b7280" },
]

const mockAlerts: BandwidthAlert[] = [
  {
    id: "1",
    type: "threshold",
    severity: "high",
    message: "Download bandwidth exceeded 80% of limit",
    timestamp: new Date(Date.now() - 300000),
    value: 85.2,
    threshold: 80,
  },
  {
    id: "2",
    type: "spike",
    severity: "medium",
    message: "Unusual traffic spike detected from Chrome",
    timestamp: new Date(Date.now() - 600000),
    value: 120.5,
    threshold: 100,
  },
  {
    id: "3",
    type: "anomaly",
    severity: "low",
    message: "Upload traffic pattern anomaly detected",
    timestamp: new Date(Date.now() - 900000),
    value: 45.8,
    threshold: 30,
  },
]

export function BandwidthMonitoring() {
  const [bandwidthData, setBandwidthData] = useState<BandwidthData[]>(mockBandwidthData)
  const [appUsage] = useState<ApplicationUsage[]>(mockAppUsage)
  const [alerts] = useState<BandwidthAlert[]>(mockAlerts)
  const [timeRange, setTimeRange] = useState("1h")
  const [currentUsage, setCurrentUsage] = useState({
    download: 42.7,
    upload: 28.1,
    total: 70.8,
    limit: 100,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      const newDownload = Math.max(0, currentUsage.download + (Math.random() - 0.5) * 10)
      const newUpload = Math.max(0, currentUsage.upload + (Math.random() - 0.5) * 8)
      const newTotal = newDownload + newUpload

      setCurrentUsage((prev) => ({
        ...prev,
        download: newDownload,
        upload: newUpload,
        total: newTotal,
      }))

      setBandwidthData((prev) => [
        ...prev.slice(1),
        {
          timestamp: timeStr,
          download: newDownload,
          upload: newUpload,
          total: newTotal,
        },
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [currentUsage])

  const formatBytes = (mbps: number) => {
    return `${mbps.toFixed(1)} MB/s`
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "threshold":
        return <TrendingUp className="h-4 w-4" />
      case "spike":
        return <Zap className="h-4 w-4" />
      case "anomaly":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const usagePercentage = (currentUsage.total / currentUsage.limit) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Bandwidth Monitoring</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time network bandwidth usage and application monitoring
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUsageColor(usagePercentage)}`}>{usagePercentage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              {formatBytes(currentUsage.total)} of {formatBytes(currentUsage.limit)}
            </div>
            <Progress value={usagePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatBytes(currentUsage.download)}</div>
            <div className="text-xs text-muted-foreground">
              {((currentUsage.download / currentUsage.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload</CardTitle>
            <Upload className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatBytes(currentUsage.upload)}</div>
            <div className="text-xs text-muted-foreground">
              {((currentUsage.upload / currentUsage.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alerts.length}</div>
            <div className="text-xs text-muted-foreground">
              {alerts.filter((a) => a.severity === "high").length} critical
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bandwidth Chart */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Bandwidth Usage Over Time</span>
            <Badge variant="outline" className="ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          </CardTitle>
          <CardDescription>Real-time download and upload bandwidth monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip formatter={(value: number) => [formatBytes(value), ""]} />
              <Area
                type="monotone"
                dataKey="download"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Download"
              />
              <Area
                type="monotone"
                dataKey="upload"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="Upload"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Usage */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Application Usage</span>
            </CardTitle>
            <CardDescription>Bandwidth consumption by application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appUsage.map((app) => (
                <div key={app.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: app.color }} />
                      <span className="font-medium">{app.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{formatBytes(app.total)}</div>
                      <div className="text-gray-600 dark:text-gray-400">{app.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={app.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>↓ {formatBytes(app.download)}</span>
                    <span>↑ {formatBytes(app.upload)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bandwidth Alerts */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Bandwidth Alerts</span>
            </CardTitle>
            <CardDescription>Recent bandwidth threshold and anomaly alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div
                    className={`p-1 rounded-full ${
                      alert.severity === "high"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                        : alert.severity === "medium"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{alert.message}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="mt-1">
                        Value: {formatBytes(alert.value)} | Threshold: {formatBytes(alert.threshold)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "secondary" : "default"
                    }
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Distribution Pie Chart */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>Usage Distribution</span>
          </CardTitle>
          <CardDescription>Bandwidth distribution across applications</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {appUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [formatBytes(value), "Usage"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
