"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  Shield,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Search,
} from "lucide-react"

interface SystemProcess {
  id: string
  name: string
  pid: number
  cpu: number
  memory: number
  networkActivity: number
  status: "running" | "sleeping" | "stopped"
  connections: number
  riskLevel: "low" | "medium" | "high"
}

interface ScanProgress {
  id: string
  type: "port" | "vulnerability" | "malware" | "network"
  name: string
  progress: number
  status: "running" | "completed" | "failed" | "paused"
  startTime: Date
  estimatedTime?: number
  findings: number
}

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: {
    inbound: number
    outbound: number
  }
  activeConnections: number
  blockedAttempts: number
}

const mockProcesses: SystemProcess[] = [
  {
    id: "1",
    name: "Chrome",
    pid: 1234,
    cpu: 15.2,
    memory: 512,
    networkActivity: 2.1,
    status: "running",
    connections: 8,
    riskLevel: "low",
  },
  {
    id: "2",
    name: "Unknown Process",
    pid: 5678,
    cpu: 25.8,
    memory: 128,
    networkActivity: 5.7,
    status: "running",
    connections: 15,
    riskLevel: "high",
  },
  {
    id: "3",
    name: "VS Code",
    pid: 9012,
    cpu: 8.4,
    memory: 256,
    networkActivity: 0.8,
    status: "running",
    connections: 3,
    riskLevel: "low",
  },
  {
    id: "4",
    name: "Suspicious Service",
    pid: 3456,
    cpu: 45.1,
    memory: 64,
    networkActivity: 12.3,
    status: "running",
    connections: 25,
    riskLevel: "high",
  },
]

const mockScans: ScanProgress[] = [
  {
    id: "1",
    type: "port",
    name: "Port Scan",
    progress: 75,
    status: "running",
    startTime: new Date(Date.now() - 300000),
    estimatedTime: 120,
    findings: 3,
  },
  {
    id: "2",
    type: "vulnerability",
    name: "Vulnerability Assessment",
    progress: 100,
    status: "completed",
    startTime: new Date(Date.now() - 600000),
    findings: 7,
  },
  {
    id: "3",
    type: "malware",
    name: "Malware Scan",
    progress: 45,
    status: "running",
    startTime: new Date(Date.now() - 180000),
    estimatedTime: 240,
    findings: 0,
  },
]

export function LiveSystemActivity() {
  const [processes, setProcesses] = useState<SystemProcess[]>(mockProcesses)
  const [scans, setScans] = useState<ScanProgress[]>(mockScans)
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 35.2,
    memory: 68.5,
    disk: 45.8,
    network: { inbound: 2.1, outbound: 1.8 },
    activeConnections: 24,
    blockedAttempts: 5,
  })
  const [isMonitoring, setIsMonitoring] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Update system metrics
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: {
          inbound: Math.max(0, prev.network.inbound + (Math.random() - 0.5) * 2),
          outbound: Math.max(0, prev.network.outbound + (Math.random() - 0.5) * 2),
        },
      }))

      // Update processes
      setProcesses((prev) =>
        prev.map((process) => ({
          ...process,
          cpu: Math.max(0, Math.min(100, process.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(0, process.memory + (Math.random() - 0.5) * 20),
          networkActivity: Math.max(0, process.networkActivity + (Math.random() - 0.5) * 2),
        })),
      )

      // Update scan progress
      setScans((prev) =>
        prev.map((scan) => {
          if (scan.status === "running" && scan.progress < 100) {
            return {
              ...scan,
              progress: Math.min(100, scan.progress + Math.random() * 5),
            }
          }
          return scan
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const formatBytes = (mb: number) => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`
    return `${(mb / 1024).toFixed(1)} GB`
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-3 w-3 text-green-600" />
      case "completed":
        return <CheckCircle className="h-3 w-3 text-blue-600" />
      case "failed":
        return <AlertTriangle className="h-3 w-3 text-red-600" />
      case "paused":
        return <Pause className="h-3 w-3 text-yellow-600" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getRiskBadge = (level: string) => {
    const variants = {
      low: "default",
      medium: "secondary",
      high: "destructive",
    } as const
    return <Badge variant={variants[level as keyof typeof variants]}>{level.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live System Activity</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time monitoring of system processes and security scans
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="rounded-lg"
          >
            {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isMonitoring ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" className="rounded-lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
            <Progress value={metrics.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <HardDrive className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
            <Progress value={metrics.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
            <Network className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>↓ {metrics.network.inbound.toFixed(1)} MB/s</span>
                <span>↑ {metrics.network.outbound.toFixed(1)} MB/s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConnections}</div>
            <div className="text-xs text-red-600">{metrics.blockedAttempts} blocked</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="processes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-lg">
          <TabsTrigger value="processes">Active Processes</TabsTrigger>
          <TabsTrigger value="scans">Security Scans</TabsTrigger>
        </TabsList>

        <TabsContent value="processes" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Running Processes</span>
                {isMonitoring && (
                  <Badge variant="outline" className="ml-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Real-time process monitoring with risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            process.status === "running"
                              ? "bg-green-500"
                              : process.status === "sleeping"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{process.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            PID: {process.pid} • {process.connections} connections
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div>CPU: {process.cpu.toFixed(1)}%</div>
                        <div>RAM: {formatBytes(process.memory)}</div>
                        <div>Net: {process.networkActivity.toFixed(1)} MB/s</div>
                      </div>
                      {getRiskBadge(process.riskLevel)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Security Scans</span>
              </CardTitle>
              <CardDescription>Active and completed security scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {scans.map((scan) => (
                  <div key={scan.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(scan.status)}
                        <div>
                          <div className="font-medium">{scan.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Started: {scan.startTime.toLocaleTimeString()}
                            {scan.estimatedTime && scan.status === "running" && (
                              <span> • ETA: {formatTime(scan.estimatedTime)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={scan.findings > 0 ? "destructive" : "default"}>{scan.findings} findings</Badge>
                        <span className="text-sm font-medium">{scan.progress.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={scan.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
