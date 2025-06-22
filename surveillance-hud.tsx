"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  Wifi,
  Activity,
  AlertTriangle,
  Eye,
  Lock,
  Unlock,
  Zap,
  Terminal,
  Users,
  Database,
  Network,
} from "lucide-react"

interface NetworkNode {
  id: string
  x: number
  y: number
  type: "server" | "client" | "router" | "threat"
  status: "active" | "warning" | "critical" | "offline"
  label: string
  connections: string[]
  lastPing: number
}

interface ThreatAlert {
  id: string
  timestamp: Date
  severity: "low" | "medium" | "high" | "critical"
  type: string
  source: string
  description: string
  status: "active" | "investigating" | "resolved"
}

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "critical"
  source: string
  message: string
  ip?: string
}

interface SystemMetrics {
  cpu: number
  memory: number
  network: {
    in: number
    out: number
  }
  connections: number
  threats: number
  uptime: string
}

const mockNodes: NetworkNode[] = [
  {
    id: "1",
    x: 200,
    y: 150,
    type: "server",
    status: "active",
    label: "MAIN-SRV",
    connections: ["2", "3"],
    lastPing: 12,
  },
  {
    id: "2",
    x: 350,
    y: 100,
    type: "router",
    status: "active",
    label: "RTR-01",
    connections: ["1", "4", "5"],
    lastPing: 8,
  },
  { id: "3", x: 150, y: 250, type: "client", status: "warning", label: "WS-001", connections: ["1"], lastPing: 45 },
  { id: "4", x: 450, y: 180, type: "client", status: "active", label: "WS-002", connections: ["2"], lastPing: 15 },
  { id: "5", x: 380, y: 280, type: "threat", status: "critical", label: "UNKNOWN", connections: ["2"], lastPing: 2 },
  { id: "6", x: 100, y: 100, type: "server", status: "active", label: "DB-SRV", connections: ["1"], lastPing: 18 },
]

const mockThreats: ThreatAlert[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 300000),
    severity: "critical",
    type: "INTRUSION_ATTEMPT",
    source: "185.220.101.42",
    description: "Unauthorized access attempt detected on port 22",
    status: "active",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 600000),
    severity: "high",
    type: "MALWARE_DETECTED",
    source: "WS-001",
    description: "Suspicious executable detected in system memory",
    status: "investigating",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 900000),
    severity: "medium",
    type: "ANOMALY_TRAFFIC",
    source: "RTR-01",
    description: "Unusual network traffic pattern observed",
    status: "resolved",
  },
]

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 30000),
    level: "critical",
    source: "FIREWALL",
    message: "Connection blocked from suspicious IP",
    ip: "185.220.101.42",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 60000),
    level: "warning",
    source: "IDS",
    message: "Port scan detected on network segment",
    ip: "192.168.1.100",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 90000),
    level: "info",
    source: "AUTH",
    message: "User authentication successful",
    ip: "192.168.1.50",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 120000),
    level: "error",
    source: "SYSTEM",
    message: "Service restart required for security update",
  },
]

export default function SurveillanceHUD() {
  const [nodes, setNodes] = useState<NetworkNode[]>(mockNodes)
  const [threats, setThreats] = useState<ThreatAlert[]>(mockThreats)
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [secureMode, setSecureMode] = useState(true)
  const [radarAngle, setRadarAngle] = useState(0)
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45.2,
    memory: 68.7,
    network: { in: 125.4, out: 89.2 },
    connections: 247,
    threats: 3,
    uptime: "72:14:33",
  })

  const radarRef = useRef<SVGSVGElement>(null)

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 2) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update node ping times
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          lastPing: Math.max(1, node.lastPing + (Math.random() - 0.5) * 10),
        })),
      )

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: {
          in: Math.max(0, prev.network.in + (Math.random() - 0.5) * 20),
          out: Math.max(0, prev.network.out + (Math.random() - 0.5) * 15),
        },
      }))

      // Occasionally add new log entries
      if (Math.random() > 0.8) {
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          level: ["info", "warning", "error"][Math.floor(Math.random() * 3)] as any,
          source: ["FIREWALL", "IDS", "AUTH", "SYSTEM"][Math.floor(Math.random() * 4)],
          message: "System event detected",
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        }
        setLogs((prev) => [newLog, ...prev.slice(0, 19)])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getNodeColor = (node: NetworkNode) => {
    switch (node.status) {
      case "active":
        return "#00ff00"
      case "warning":
        return "#ffff00"
      case "critical":
        return "#ff0000"
      case "offline":
        return "#666666"
      default:
        return "#00ffff"
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "server":
        return "⬛"
      case "router":
        return "◆"
      case "client":
        return "●"
      case "threat":
        return "⚠"
      default:
        return "●"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400"
      case "high":
        return "text-orange-400 border-orange-400"
      case "medium":
        return "text-yellow-400 border-yellow-400"
      case "low":
        return "text-blue-400 border-blue-400"
      default:
        return "text-cyan-400 border-cyan-400"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400"
      case "error":
        return "text-orange-400"
      case "warning":
        return "text-yellow-400"
      case "info":
        return "text-cyan-400"
      default:
        return "text-green-400"
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.1) 2px,
            rgba(0, 255, 0, 0.1) 4px
          )`,
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 border-b border-cyan-400/30 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-bold text-cyan-400">CYBERWATCH</span>
              <span className="text-xs text-green-400">v3.7.2</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>OPERATIONAL</span>
              </div>
              <div className="text-cyan-400">
                UPTIME: <span className="text-green-400">{metrics.uptime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-cyan-400 text-lg font-mono">
              {new Date().toLocaleTimeString("en-US", { hour12: false })}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">SECURE MODE</span>
              <Switch
                checked={secureMode}
                onCheckedChange={setSecureMode}
                className="data-[state=checked]:bg-green-400"
              />
              {secureMode ? <Lock className="h-4 w-4 text-green-400" /> : <Unlock className="h-4 w-4 text-red-400" />}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-cyan-400/30 bg-black/60 backdrop-blur-sm flex flex-col">
          {/* Threat Alerts */}
          <div className="border-b border-cyan-400/30 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-sm font-bold text-cyan-400">THREAT ALERTS</span>
              <Badge className="bg-red-400/20 text-red-400 border-red-400">{threats.length}</Badge>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {threats.map((threat) => (
                <div
                  key={threat.id}
                  className={`p-2 border rounded-sm bg-black/40 ${getSeverityColor(threat.severity)}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{threat.type}</span>
                    <span>{threat.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="text-xs mt-1 text-gray-300">{threat.description}</div>
                  <div className="text-xs mt-1">
                    SRC: <span className="text-cyan-400">{threat.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Control */}
          <div className="border-b border-cyan-400/30 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-green-400" />
              <span className="text-sm font-bold text-cyan-400">ACCESS CONTROL</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>ACTIVE SESSIONS:</span>
                <span className="text-green-400">12</span>
              </div>
              <div className="flex justify-between">
                <span>FAILED LOGINS:</span>
                <span className="text-red-400">3</span>
              </div>
              <div className="flex justify-between">
                <span>PRIVILEGE LEVEL:</span>
                <span className="text-cyan-400">ADMIN</span>
              </div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="flex-1 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Terminal className="h-5 w-5 text-green-400" />
              <span className="text-sm font-bold text-cyan-400">SYSTEM LOGS</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="space-y-1 text-xs max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="font-mono">
                  <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                  <span className={`ml-2 ${getLogLevelColor(log.level)}`}>[{log.level.toUpperCase()}]</span>
                  <span className="ml-2 text-cyan-400">{log.source}:</span>
                  <span className="ml-2 text-gray-300">{log.message}</span>
                  {log.ip && <span className="ml-2 text-yellow-400">{log.ip}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Central Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Radar Display */}
          <div className="flex-1 relative p-6">
            <div className="h-full bg-black/40 border border-cyan-400/30 rounded-sm relative overflow-hidden">
              {/* Radar Grid */}
              <svg ref={radarRef} className="absolute inset-0 w-full h-full">
                {/* Grid circles */}
                <g className="opacity-30">
                  {[1, 2, 3, 4].map((i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={`${i * 20}%`}
                      fill="none"
                      stroke="rgba(0, 255, 255, 0.3)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Grid lines */}
                  <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(0, 255, 255, 0.3)" strokeWidth="1" />
                  <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(0, 255, 255, 0.3)" strokeWidth="1" />
                  <line x1="14.6%" y1="14.6%" x2="85.4%" y2="85.4%" stroke="rgba(0, 255, 255, 0.3)" strokeWidth="1" />
                  <line x1="85.4%" y1="14.6%" x2="14.6%" y2="85.4%" stroke="rgba(0, 255, 255, 0.3)" strokeWidth="1" />
                </g>

                {/* Radar sweep */}
                <defs>
                  <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 255, 0, 0)" />
                    <stop offset="70%" stopColor="rgba(0, 255, 0, 0.3)" />
                    <stop offset="100%" stopColor="rgba(0, 255, 0, 0.8)" />
                  </linearGradient>
                </defs>
                <g transform="translate(50%, 50%)">
                  <path
                    d={`M 0,0 L ${Math.cos((radarAngle - 30) * (Math.PI / 180)) * 300},${
                      Math.sin((radarAngle - 30) * (Math.PI / 180)) * 300
                    } A 300,300 0 0,1 ${Math.cos(radarAngle * (Math.PI / 180)) * 300},${
                      Math.sin(radarAngle * (Math.PI / 180)) * 300
                    } Z`}
                    fill="url(#radarGradient)"
                    opacity="0.6"
                  />
                </g>

                {/* Network nodes */}
                {nodes.map((node) => (
                  <g key={node.id}>
                    {/* Node connections */}
                    {node.connections.map((connId) => {
                      const connectedNode = nodes.find((n) => n.id === connId)
                      if (!connectedNode) return null
                      return (
                        <line
                          key={`${node.id}-${connId}`}
                          x1={node.x}
                          y1={node.y}
                          x2={connectedNode.x}
                          y2={connectedNode.y}
                          stroke="rgba(0, 255, 255, 0.4)"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                      )
                    })}

                    {/* Node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="8"
                      fill={getNodeColor(node)}
                      stroke={getNodeColor(node)}
                      strokeWidth="2"
                      className="animate-pulse"
                    />

                    {/* Node label */}
                    <text x={node.x} y={node.y - 15} textAnchor="middle" className="text-xs font-mono fill-cyan-400">
                      {node.label}
                    </text>

                    {/* Ping indicator */}
                    <text x={node.x} y={node.y + 25} textAnchor="middle" className="text-xs font-mono fill-green-400">
                      {node.lastPing.toFixed(0)}ms
                    </text>

                    {/* Pulse animation for active nodes */}
                    {node.status === "active" && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="8"
                        fill="none"
                        stroke={getNodeColor(node)}
                        strokeWidth="1"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Radar Info Overlay */}
              <div className="absolute top-4 left-4 space-y-2 text-xs">
                <div className="text-cyan-400">NETWORK TOPOLOGY</div>
                <div className="text-green-400">NODES: {nodes.length}</div>
                <div className="text-yellow-400">THREATS: {nodes.filter((n) => n.type === "threat").length}</div>
              </div>

              {/* Coordinates */}
              <div className="absolute bottom-4 right-4 text-xs text-cyan-400">GRID: 500x400 | SCALE: 1:1000</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-cyan-400/30 bg-black/60 backdrop-blur-sm p-4">
          <div className="space-y-4">
            {/* Network Status */}
            <div className="border border-cyan-400/30 rounded-sm p-3 bg-black/40">
              <div className="flex items-center space-x-2 mb-3">
                <Network className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-bold text-cyan-400">NETWORK STATUS</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>ACTIVE NODES:</span>
                  <span className="text-green-400">{nodes.filter((n) => n.status === "active").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>WARNING:</span>
                  <span className="text-yellow-400">{nodes.filter((n) => n.status === "warning").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>CRITICAL:</span>
                  <span className="text-red-400">{nodes.filter((n) => n.status === "critical").length}</span>
                </div>
              </div>
            </div>

            {/* System Resources */}
            <div className="border border-cyan-400/30 rounded-sm p-3 bg-black/40">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="text-sm font-bold text-cyan-400">SYSTEM RESOURCES</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>CPU USAGE:</span>
                    <span className="text-green-400">{metrics.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300"
                      style={{ width: `${metrics.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>MEMORY:</span>
                    <span className="text-green-400">{metrics.memory.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
                      style={{ width: `${metrics.memory}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Network Traffic */}
            <div className="border border-cyan-400/30 rounded-sm p-3 bg-black/40">
              <div className="flex items-center space-x-2 mb-3">
                <Wifi className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-bold text-cyan-400">NETWORK TRAFFIC</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>INBOUND:</span>
                  <span className="text-green-400">{metrics.network.in.toFixed(1)} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span>OUTBOUND:</span>
                  <span className="text-blue-400">{metrics.network.out.toFixed(1)} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span>CONNECTIONS:</span>
                  <span className="text-cyan-400">{metrics.connections}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-cyan-400/30 rounded-sm p-3 bg-black/40">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-bold text-cyan-400">QUICK ACTIONS</span>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-400 text-red-400 text-xs h-8">
                  LOCKDOWN MODE
                </Button>
                <Button className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400 text-yellow-400 text-xs h-8">
                  SCAN NETWORK
                </Button>
                <Button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400 text-green-400 text-xs h-8">
                  SYSTEM REPORT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-cyan-400/30 bg-black/80 backdrop-blur-sm px-6 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-400" />
              <span>DB: ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>FIREWALL: ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <span>IDS: MONITORING</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>THREAT LEVEL: </span>
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400">ELEVATED</Badge>
            <span className="text-cyan-400">|</span>
            <span>CLEARANCE: ALPHA-7</span>
          </div>
        </div>
      </div>
    </div>
  )
}
