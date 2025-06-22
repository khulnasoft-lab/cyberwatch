"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Search,
  Download,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
} from "lucide-react"
import { DatePickerWithRange } from "./date-picker-with-range"

interface AuditLog {
  id: string
  timestamp: Date
  user: string
  action: string
  category: "firewall" | "rules" | "settings" | "authentication" | "system"
  severity: "info" | "warning" | "error" | "critical"
  description: string
  ipAddress: string
  userAgent?: string
  result: "success" | "failure" | "blocked"
  details?: Record<string, any>
}

interface AuditStats {
  totalLogs: number
  todayLogs: number
  criticalEvents: number
  failedActions: number
  topUsers: Array<{ user: string; count: number }>
  topActions: Array<{ action: string; count: number }>
}

const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 300000),
    user: "admin",
    action: "CREATE_RULE",
    category: "rules",
    severity: "info",
    description: "Created new firewall rule for Chrome browser",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    result: "success",
    details: { ruleId: "rule_123", app: "Chrome", action: "allow" },
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 600000),
    user: "system",
    action: "BLOCK_CONNECTION",
    category: "firewall",
    severity: "warning",
    description: "Blocked suspicious connection attempt",
    ipAddress: "185.220.101.42",
    result: "blocked",
    details: { destination: "malicious-site.com", port: 443, reason: "threat_intelligence" },
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 900000),
    user: "admin",
    action: "UPDATE_SETTINGS",
    category: "settings",
    severity: "info",
    description: "Updated firewall configuration settings",
    ipAddress: "192.168.1.100",
    result: "success",
    details: { setting: "stealthMode", oldValue: false, newValue: true },
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1200000),
    user: "unknown",
    action: "LOGIN_ATTEMPT",
    category: "authentication",
    severity: "error",
    description: "Failed login attempt with invalid credentials",
    ipAddress: "203.0.113.42",
    userAgent: "curl/7.68.0",
    result: "failure",
    details: { attempts: 3, reason: "invalid_password" },
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1500000),
    user: "system",
    action: "THREAT_DETECTED",
    category: "firewall",
    severity: "critical",
    description: "Critical threat detected and automatically blocked",
    ipAddress: "45.142.214.123",
    result: "blocked",
    details: { threatType: "malware", confidence: 95, source: "VirusTotal" },
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1800000),
    user: "admin",
    action: "DELETE_RULE",
    category: "rules",
    severity: "warning",
    description: "Deleted firewall rule for outdated application",
    ipAddress: "192.168.1.100",
    result: "success",
    details: { ruleId: "rule_456", app: "OldApp", reason: "cleanup" },
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 2100000),
    user: "system",
    action: "BANDWIDTH_ALERT",
    category: "system",
    severity: "warning",
    description: "Bandwidth usage exceeded threshold",
    ipAddress: "192.168.1.101",
    result: "success",
    details: { usage: 85.2, threshold: 80, application: "Chrome" },
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 2400000),
    user: "admin",
    action: "EXPORT_RULES",
    category: "rules",
    severity: "info",
    description: "Exported firewall rules configuration",
    ipAddress: "192.168.1.100",
    result: "success",
    details: { format: "json", ruleCount: 25 },
  },
]

const mockStats: AuditStats = {
  totalLogs: 1247,
  todayLogs: 89,
  criticalEvents: 3,
  failedActions: 12,
  topUsers: [
    { user: "admin", count: 45 },
    { user: "system", count: 38 },
    { user: "user1", count: 6 },
  ],
  topActions: [
    { action: "BLOCK_CONNECTION", count: 156 },
    { action: "CREATE_RULE", count: 89 },
    { action: "UPDATE_SETTINGS", count: 67 },
    { action: "LOGIN_ATTEMPT", count: 45 },
  ],
}

export function AuditLogging() {
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs)
  const [stats] = useState<AuditStats>(mockStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [resultFilter, setResultFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()

  // Simulate real-time log updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const actions = ["BLOCK_CONNECTION", "CREATE_RULE", "LOGIN_ATTEMPT", "UPDATE_SETTINGS"]
        const categories = ["firewall", "rules", "authentication", "settings"] as const
        const severities = ["info", "warning", "error"] as const
        const results = ["success", "failure", "blocked"] as const

        const newLog: AuditLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          user: Math.random() > 0.5 ? "admin" : "system",
          action: actions[Math.floor(Math.random() * actions.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          description: "Automated system action",
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          result: results[Math.floor(Math.random() * results.length)],
        }

        setLogs((prev) => [newLog, ...prev.slice(0, 49)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm)

    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    const matchesResult = resultFilter === "all" || log.result === resultFilter

    const matchesDate = !dateRange || (log.timestamp >= dateRange.from && log.timestamp <= dateRange.to)

    return matchesSearch && matchesCategory && matchesSeverity && matchesResult && matchesDate
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "firewall":
        return <Shield className="h-4 w-4" />
      case "rules":
        return <FileText className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      case "authentication":
        return <User className="h-4 w-4" />
      case "system":
        return <Eye className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case "success":
        return <Badge variant="default">Success</Badge>
      case "failure":
        return <Badge variant="destructive">Failure</Badge>
      case "blocked":
        return <Badge variant="secondary">Blocked</Badge>
      default:
        return <Badge variant="outline">{result}</Badge>
    }
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `audit-logs-${new Date().toISOString().split("T")[0]}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Audit Logging</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive audit trail of all system activities and security events
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportLogs} className="rounded-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalLogs.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{stats.todayLogs} today</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalEvents}</div>
            <div className="text-xs text-muted-foreground">Require attention</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.failedActions}</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.topUsers.length}</div>
            <div className="text-xs text-muted-foreground">Unique users today</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="firewall">Firewall</SelectItem>
                <SelectItem value="rules">Rules</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setSeverityFilter("all")
                setResultFilter("all")
                setDateRange(undefined)
              }}
              className="rounded-lg"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Audit Logs</span>
            <Badge variant="outline" className="ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          </CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Severity</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">IP Address</TableHead>
                <TableHead className="font-semibold">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{log.timestamp.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell className="text-sm font-mono">{log.action}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(log.category)}
                      <span className="capitalize">{log.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(log.severity)}
                      <span className="capitalize">{log.severity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                  <TableCell>{getResultBadge(log.result)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit logs found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Users and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Top Users</span>
            </CardTitle>
            <CardDescription>Most active users by log count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topUsers.map((user, index) => (
                <div key={user.user} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{user.user}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{user.count} actions</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Top Actions</span>
            </CardTitle>
            <CardDescription>Most frequent actions performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topActions.map((action, index) => (
                <div key={action.action} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium font-mono text-sm">{action.action}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{action.count} times</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
