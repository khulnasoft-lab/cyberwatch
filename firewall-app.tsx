"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Shield,
  ShieldCheck,
  ShieldX,
  LucideSettings,
  List,
  Home,
  Moon,
  Sun,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Eye,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Wifi,
  WifiOff,
  Clock,
  Activity,
  Folder,
  Network,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "./hooks/use-local-storage"
import { useRealTimeUpdates } from "./hooks/use-real-time-updates"
import { useToast } from "./hooks/use-toast"
import { Toaster } from "./components/toast"
import { RuleForm } from "./components/rule-form"
import { ConnectionHistory } from "./components/connection-history"
import { RuleTemplates } from "./components/rule-templates"
import { NetworkStatistics } from "./components/network-statistics"
import { RuleGroups } from "./components/rule-groups"
import { AdvancedFiltering } from "./components/advanced-filtering"
import { LiveSystemActivity } from "./components/live-system-activity"
import { NetworkTopology } from "./components/network-topology"
import { ThreatIntelligence } from "./components/threat-intelligence"
import { BandwidthMonitoring } from "./components/bandwidth-monitoring"
import { AuditLogging } from "./components/audit-logging"

interface Connection {
  id: string
  app: string
  path: string
  destination: string
  port: number
  direction: "inbound" | "outbound"
  status: "active" | "blocked"
  timestamp: string
}

interface Rule {
  id: string
  app: string
  path: string
  destination: string
  port: string
  direction: "inbound" | "outbound"
  action: "allow" | "block"
  enabled: boolean
  description?: string
}

interface AlertData {
  app: string
  path: string
  destination: string
  port: number
  direction: "inbound" | "outbound"
}

interface Settings {
  firewallEnabled: boolean
  autoUpdate: boolean
  startAtLogin: boolean
  blockUnsigned: boolean
  stealthMode: boolean
  defaultAction: "prompt" | "allow" | "block"
  showAlerts: boolean
  enableLogging: boolean
  soundAlerts: boolean
  logLevel: "minimal" | "normal" | "verbose" | "debug"
  packetInspection: boolean
}

const initialConnections: Connection[] = [
  {
    id: "1",
    app: "Chrome",
    path: "/Applications/Google Chrome.app",
    destination: "google.com",
    port: 443,
    direction: "outbound",
    status: "active",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    app: "Slack",
    path: "/Applications/Slack.app",
    destination: "slack.com",
    port: 443,
    direction: "outbound",
    status: "active",
    timestamp: "5 min ago",
  },
]

const initialRules: Rule[] = [
  {
    id: "1",
    app: "Chrome",
    path: "/Applications/Google Chrome.app",
    destination: "*",
    port: "80,443",
    direction: "outbound",
    action: "allow",
    enabled: true,
    description: "Allow Chrome web browsing",
  },
  {
    id: "2",
    app: "Slack",
    path: "/Applications/Slack.app",
    destination: "*",
    port: "443",
    direction: "outbound",
    action: "allow",
    enabled: true,
    description: "Allow Slack communication",
  },
]

const defaultSettings: Settings = {
  firewallEnabled: true,
  autoUpdate: true,
  startAtLogin: true,
  blockUnsigned: true,
  stealthMode: false,
  defaultAction: "prompt",
  showAlerts: true,
  enableLogging: true,
  soundAlerts: false,
  logLevel: "normal",
  packetInspection: false,
}

export default function FirewallApp() {
  const [currentView, setCurrentView] = useState<"dashboard" | "rules" | "settings">("dashboard")
  const [darkMode, setDarkMode] = useLocalStorage("firewall-dark-mode", false)
  const [rules, setRules] = useLocalStorage("firewall-rules", initialRules)
  const [settings, setSettings] = useLocalStorage("firewall-settings", defaultSettings)
  const [showAlert, setShowAlert] = useState(false)
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [connectionHistory, setConnectionHistory] = useLocalStorage("firewall-connection-history", [])
  const [ruleGroups, setRuleGroups] = useLocalStorage("firewall-rule-groups", [])
  const [savedFilters, setSavedFilters] = useLocalStorage("firewall-saved-filters", [])
  const [activeFilters, setActiveFilters] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showLiveActivity, setShowLiveActivity] = useState(false)
  const [showTopology, setShowTopology] = useState(false)
  const [showThreatIntel, setShowThreatIntel] = useState(false)
  const [showBandwidth, setShowBandwidth] = useState(false)
  const [showAuditLogs, setShowAuditLogs] = useState(false)

  const { connections, isConnected } = useRealTimeUpdates(initialConnections)
  const { toasts, toast, dismiss } = useToast()

  const [alertData] = useState<AlertData>({
    app: "Chrome",
    path: "/Applications/Google Chrome.app",
    destination: "google.com",
    port: 443,
    direction: "outbound",
  })

  const stats = {
    activeConnections: connections.filter((c) => c.status === "active").length,
    blockedAttempts: connections.filter((c) => c.status === "blocked").length,
    totalRules: rules.length,
    enabledRules: rules.filter((r: Rule) => r.enabled).length,
  }

  const handleAllowConnection = () => {
    setShowAlert(false)
    toast({
      title: "Connection Allowed",
      description: `${alertData.app} can now connect to ${alertData.destination}`,
      variant: "success",
    })
  }

  const handleBlockConnection = () => {
    setShowAlert(false)
    toast({
      title: "Connection Blocked",
      description: `${alertData.app} connection to ${alertData.destination} was blocked`,
      variant: "destructive",
    })
  }

  const toggleRule = (ruleId: string) => {
    setRules((prevRules: Rule[]) =>
      prevRules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    )
    toast({
      title: "Rule Updated",
      description: "Firewall rule status has been changed",
    })
  }

  const handleCreateRule = (newRule: Omit<Rule, "id">) => {
    const rule: Rule = {
      ...newRule,
      id: Date.now().toString(),
    }
    setRules((prevRules: Rule[]) => [...prevRules, rule])
    toast({
      title: "Rule Created",
      description: `New rule for ${newRule.app} has been created`,
      variant: "success",
    })
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setShowRuleForm(true)
  }

  const handleUpdateRule = (updatedRule: Omit<Rule, "id">) => {
    if (editingRule) {
      setRules((prevRules: Rule[]) =>
        prevRules.map((rule) => (rule.id === editingRule.id ? { ...updatedRule, id: editingRule.id } : rule)),
      )
      setEditingRule(null)
      toast({
        title: "Rule Updated",
        description: `Rule for ${updatedRule.app} has been updated`,
        variant: "success",
      })
    }
  }

  const handleDeleteRule = (ruleId: string) => {
    const rule = rules.find((r: Rule) => r.id === ruleId)
    setRules((prevRules: Rule[]) => prevRules.filter((rule) => rule.id !== ruleId))
    toast({
      title: "Rule Deleted",
      description: `Rule for ${rule?.app} has been deleted`,
      variant: "destructive",
    })
  }

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `firewall-rules-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Rules Exported",
      description: "Firewall rules have been exported successfully",
      variant: "success",
    })
  }

  const importRules = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedRules = JSON.parse(e.target?.result as string)
          setRules(importedRules)
          toast({
            title: "Rules Imported",
            description: `${importedRules.length} rules have been imported successfully`,
            variant: "success",
          })
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Failed to import rules. Please check the file format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const updateSettings = (key: keyof Settings, value: any) => {
    setSettings((prev: Settings) => ({ ...prev, [key]: value }))
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved",
    })
  }

  const filteredRules = rules.filter(
    (rule: Rule) =>
      rule.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApplyTemplate = (template) => {
    const newRules = template.rules.map((rule) => ({
      ...rule,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      enabled: true,
    }))
    setRules((prevRules) => [...prevRules, ...newRules])
    toast({
      title: "Template Applied",
      description: `${newRules.length} rules from "${template.name}" have been added`,
      variant: "success",
    })
  }

  const handleCreateGroup = (group) => {
    const newGroup = {
      ...group,
      id: Date.now().toString(),
      rules: [],
      expanded: false,
    }
    setRuleGroups((prev) => [...prev, newGroup])
    toast({
      title: "Group Created",
      description: `Rule group "${group.name}" has been created`,
      variant: "success",
    })
  }

  const handleUpdateGroup = (id, updates) => {
    setRuleGroups((prev) => prev.map((group) => (group.id === id ? { ...group, ...updates } : group)))
  }

  const handleDeleteGroup = (id) => {
    const group = ruleGroups.find((g) => g.id === id)
    setRuleGroups((prev) => prev.filter((group) => group.id !== id))
    toast({
      title: "Group Deleted",
      description: `Rule group "${group?.name}" has been deleted`,
      variant: "destructive",
    })
  }

  const handleApplyAdvancedFilter = (conditions) => {
    setActiveFilters(conditions)
    toast({
      title: "Filters Applied",
      description: `${conditions.length} filter conditions are now active`,
    })
  }

  const handleSaveFilter = (filter) => {
    const newFilter = {
      ...filter,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setSavedFilters((prev) => [...prev, newFilter])
    toast({
      title: "Filter Saved",
      description: `Filter "${filter.name}" has been saved`,
      variant: "success",
    })
  }

  const handleExportHistory = () => {
    const dataStr = JSON.stringify(connectionHistory, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `connection-history-${new Date().toISOString().split("T")[0]}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    toast({
      title: "History Exported",
      description: "Connection history has been exported successfully",
      variant: "success",
    })
  }

  const handleClearHistory = () => {
    setConnectionHistory([])
    toast({
      title: "History Cleared",
      description: "All connection history has been cleared",
      variant: "destructive",
    })
  }

  // Simulate random alerts
  useEffect(() => {
    if (settings.showAlerts) {
      const interval = setInterval(() => {
        if (Math.random() > 0.9) {
          setShowAlert(true)
        }
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [settings.showAlerts])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">FireGuard</h1>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
                className="rounded-md"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === "rules" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("rules")}
                className="rounded-md"
              >
                <List className="h-4 w-4 mr-2" />
                Rules
              </Button>
              <Button
                variant={currentView === "settings" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("settings")}
                className="rounded-md"
              >
                <LucideSettings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant={showHistory ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowHistory(!showHistory)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button
                variant={showTemplates ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowTemplates(!showTemplates)
                  setCurrentView("rules")
                }}
                className="rounded-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                variant={showStats ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowStats(!showStats)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <Activity className="h-4 w-4 mr-2" />
                Stats
              </Button>
              <Button
                variant={showLiveActivity ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowLiveActivity(!showLiveActivity)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <Activity className="h-4 w-4 mr-2" />
                Live Activity
              </Button>
              <Button
                variant={showTopology ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowTopology(!showTopology)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <Network className="h-4 w-4 mr-2" />
                Topology
              </Button>
              <Button
                variant={showThreatIntel ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowThreatIntel(!showThreatIntel)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <Shield className="h-4 w-4 mr-2" />
                Threats
              </Button>
              <Button
                variant={showBandwidth ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowBandwidth(!showBandwidth)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <Wifi className="h-4 w-4 mr-2" />
                Bandwidth
              </Button>
              <Button
                variant={showAuditLogs ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowAuditLogs(!showAuditLogs)
                  setCurrentView("dashboard")
                }}
                className="rounded-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Audit
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
              <span className="text-sm text-gray-600 dark:text-gray-400">{isConnected ? "Live" : "Offline"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Firewall</span>
              <Switch
                checked={settings.firewallEnabled}
                onCheckedChange={(checked) => updateSettings("firewallEnabled", checked)}
              />
              {settings.firewallEnabled ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldX className="h-5 w-5 text-red-600" />
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAlert(true)} className="rounded-lg">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Test Alert
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                  <Globe className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeConnections}</div>
                  <p className="text-xs text-muted-foreground">Currently allowed</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
                  <ShieldX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.blockedAttempts}</div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
                  <List className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalRules}</div>
                  <p className="text-xs text-muted-foreground">{stats.enabledRules} enabled</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protection Status</CardTitle>
                  {settings.firewallEnabled ? (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <ShieldX className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${settings.firewallEnabled ? "text-green-600" : "text-red-600"}`}>
                    {settings.firewallEnabled ? "Active" : "Disabled"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {settings.firewallEnabled ? "All systems protected" : "Click to enable"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Recent Activity</span>
                  {isConnected && (
                    <Badge variant="outline" className="ml-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Live
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Latest network connections and blocked attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            connection.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          {connection.status === "active" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{connection.app}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {connection.destination}:{connection.port} ({connection.direction})
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={connection.status === "active" ? "default" : "destructive"}>
                          {connection.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{connection.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "rules" && (
          <div className="space-y-6">
            {/* Rules Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Firewall Rules</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage application network access permissions</p>
              </div>
              <div className="flex space-x-2">
                <input type="file" accept=".json" onChange={importRules} className="hidden" id="import-rules" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("import-rules")?.click()}
                  className="rounded-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={exportRules} className="rounded-lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setShowRuleForm(true)} className="rounded-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
                <Button variant="outline" onClick={() => setShowGroups(!showGroups)} className="rounded-lg">
                  <Folder className="h-4 w-4 mr-2" />
                  Groups
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="rounded-lg"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search rules by app name, path, or destination..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-lg"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rules Table */}
            <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold">Application</TableHead>
                      <TableHead className="font-semibold">Path</TableHead>
                      <TableHead className="font-semibold">Destination</TableHead>
                      <TableHead className="font-semibold">Port</TableHead>
                      <TableHead className="font-semibold">Direction</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules.map((rule: Rule) => (
                      <TableRow key={rule.id} className="border-b border-gray-100 dark:border-gray-800">
                        <TableCell className="font-medium">{rule.app}</TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {rule.path}
                        </TableCell>
                        <TableCell>{rule.destination}</TableCell>
                        <TableCell>{rule.port}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {rule.direction}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.action === "allow" ? "default" : "destructive"}>
                            {rule.action === "allow" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" /> Allow
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" /> Block
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRule(rule)}
                              className="rounded-md"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRule(rule.id)}
                              className="rounded-md text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure firewall behavior and preferences</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 rounded-lg">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic firewall configuration options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Firewall</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Turn firewall protection on or off
                        </div>
                      </div>
                      <Switch
                        checked={settings.firewallEnabled}
                        onCheckedChange={(checked) => updateSettings("firewallEnabled", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-update Rules</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically update firewall rules database
                        </div>
                      </div>
                      <Switch
                        checked={settings.autoUpdate}
                        onCheckedChange={(checked) => updateSettings("autoUpdate", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Start at Login</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Launch FireGuard when you log in</div>
                      </div>
                      <Switch
                        checked={settings.startAtLogin}
                        onCheckedChange={(checked) => updateSettings("startAtLogin", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Advanced security and protection options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Block Unsigned Applications</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically block applications without valid signatures
                        </div>
                      </div>
                      <Switch
                        checked={settings.blockUnsigned}
                        onCheckedChange={(checked) => updateSettings("blockUnsigned", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Stealth Mode</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Make your computer invisible to network scans
                        </div>
                      </div>
                      <Switch
                        checked={settings.stealthMode}
                        onCheckedChange={(checked) => updateSettings("stealthMode", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-base">Default Action for New Connections</Label>
                      <Select
                        value={settings.defaultAction}
                        onValueChange={(value: "prompt" | "allow" | "block") => updateSettings("defaultAction", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prompt">Prompt User</SelectItem>
                          <SelectItem value="allow">Allow</SelectItem>
                          <SelectItem value="block">Block</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure alerts and logging preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Connection Alerts</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Display popup alerts for new connections
                        </div>
                      </div>
                      <Switch
                        checked={settings.showAlerts}
                        onCheckedChange={(checked) => updateSettings("showAlerts", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Logging</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Keep detailed logs of all network activity
                        </div>
                      </div>
                      <Switch
                        checked={settings.enableLogging}
                        onCheckedChange={(checked) => updateSettings("enableLogging", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Sound Alerts</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Play sound when blocking connections
                        </div>
                      </div>
                      <Switch
                        checked={settings.soundAlerts}
                        onCheckedChange={(checked) => updateSettings("soundAlerts", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Expert configuration options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base">Log Level</Label>
                      <Select
                        value={settings.logLevel}
                        onValueChange={(value: "minimal" | "normal" | "verbose" | "debug") =>
                          updateSettings("logLevel", value)
                        }
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="verbose">Verbose</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Packet Inspection</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Deep packet inspection for enhanced security
                        </div>
                      </div>
                      <Switch
                        checked={settings.packetInspection}
                        onCheckedChange={(checked) => updateSettings("packetInspection", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-base">Export/Import Rules</Label>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={exportRules} className="rounded-lg">
                          <Download className="h-4 w-4 mr-2" />
                          Export Rules
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("import-rules")?.click()}
                          className="rounded-lg"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Import Rules
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {showHistory && (
          <ConnectionHistory
            connections={connectionHistory}
            onClearHistory={handleClearHistory}
            onExportHistory={handleExportHistory}
          />
        )}

        {showTemplates && <RuleTemplates onApplyTemplate={handleApplyTemplate} />}

        {showStats && <NetworkStatistics />}

        {showGroups && (
          <RuleGroups
            groups={ruleGroups}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onToggleGroup={(id) => handleUpdateGroup(id, { enabled: !ruleGroups.find((g) => g.id === id)?.enabled })}
            onMoveRuleToGroup={(ruleId, groupId) => {
              // Implementation for moving rules between groups
            }}
          />
        )}

        {showAdvancedFilters && (
          <AdvancedFiltering
            onApplyFilter={handleApplyAdvancedFilter}
            onSaveFilter={handleSaveFilter}
            savedFilters={savedFilters}
            onLoadFilter={(filter) => setActiveFilters(filter.conditions)}
            onDeleteFilter={(id) => setSavedFilters((prev) => prev.filter((f) => f.id !== id))}
          />
        )}

        {showLiveActivity && <LiveSystemActivity />}
        {showTopology && <NetworkTopology />}
        {showThreatIntel && <ThreatIntelligence />}
        {showBandwidth && <BandwidthMonitoring />}
        {showAuditLogs && <AuditLogging />}
      </main>

      {/* Rule Form Dialog */}
      <RuleForm
        open={showRuleForm}
        onOpenChange={(open) => {
          setShowRuleForm(open)
          if (!open) setEditingRule(null)
        }}
        onSubmit={editingRule ? handleUpdateRule : handleCreateRule}
        editingRule={editingRule}
      />

      {/* Alert Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>New Connection Request</span>
            </DialogTitle>
            <DialogDescription>
              An application is trying to establish a network connection. Choose how to proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Application:</span>
                <span className="font-medium">{alertData.app}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Path:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">{alertData.path}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Destination:</span>
                <span className="font-medium">
                  {alertData.destination}:{alertData.port}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Direction:</span>
                <Badge variant="outline" className="capitalize">
                  {alertData.direction}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleBlockConnection} className="flex-1 rounded-lg">
              <XCircle className="h-4 w-4 mr-2" />
              Block
            </Button>
            <Button onClick={handleAllowConnection} className="flex-1 rounded-lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Allow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster toasts={toasts} onClose={dismiss} />
    </div>
  )
}
