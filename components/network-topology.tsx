"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Network, Router, Monitor, Server, Shield, AlertTriangle, Globe, Zap, Eye, RefreshCw } from "lucide-react"

interface NetworkNode {
  id: string
  name: string
  type: "router" | "device" | "server" | "firewall" | "internet"
  ip: string
  status: "online" | "offline" | "warning"
  connections: string[]
  traffic: {
    inbound: number
    outbound: number
  }
  riskLevel: "low" | "medium" | "high"
  location: { x: number; y: number }
}

interface NetworkConnection {
  id: string
  from: string
  to: string
  type: "ethernet" | "wifi" | "vpn" | "internet"
  bandwidth: number
  latency: number
  status: "active" | "inactive" | "blocked"
}

const mockNodes: NetworkNode[] = [
  {
    id: "firewall",
    name: "FireGuard",
    type: "firewall",
    ip: "192.168.1.1",
    status: "online",
    connections: ["router", "internet"],
    traffic: { inbound: 15.2, outbound: 8.7 },
    riskLevel: "low",
    location: { x: 400, y: 200 },
  },
  {
    id: "router",
    name: "Main Router",
    type: "router",
    ip: "192.168.1.1",
    status: "online",
    connections: ["firewall", "laptop", "phone", "server"],
    traffic: { inbound: 45.8, outbound: 32.1 },
    riskLevel: "low",
    location: { x: 400, y: 300 },
  },
  {
    id: "laptop",
    name: "MacBook Pro",
    type: "device",
    ip: "192.168.1.101",
    status: "online",
    connections: ["router"],
    traffic: { inbound: 12.3, outbound: 5.6 },
    riskLevel: "low",
    location: { x: 200, y: 400 },
  },
  {
    id: "phone",
    name: "iPhone",
    type: "device",
    ip: "192.168.1.102",
    status: "online",
    connections: ["router"],
    traffic: { inbound: 3.2, outbound: 1.8 },
    riskLevel: "low",
    location: { x: 600, y: 400 },
  },
  {
    id: "server",
    name: "File Server",
    type: "server",
    ip: "192.168.1.200",
    status: "warning",
    connections: ["router"],
    traffic: { inbound: 25.7, outbound: 18.9 },
    riskLevel: "medium",
    location: { x: 400, y: 500 },
  },
  {
    id: "internet",
    name: "Internet",
    type: "internet",
    ip: "0.0.0.0",
    status: "online",
    connections: ["firewall"],
    traffic: { inbound: 89.4, outbound: 67.2 },
    riskLevel: "high",
    location: { x: 400, y: 100 },
  },
]

const mockConnections: NetworkConnection[] = [
  {
    id: "1",
    from: "internet",
    to: "firewall",
    type: "internet",
    bandwidth: 100,
    latency: 15,
    status: "active",
  },
  {
    id: "2",
    from: "firewall",
    to: "router",
    type: "ethernet",
    bandwidth: 1000,
    latency: 1,
    status: "active",
  },
  {
    id: "3",
    from: "router",
    to: "laptop",
    type: "wifi",
    bandwidth: 300,
    latency: 5,
    status: "active",
  },
  {
    id: "4",
    from: "router",
    to: "phone",
    type: "wifi",
    bandwidth: 150,
    latency: 8,
    status: "active",
  },
  {
    id: "5",
    from: "router",
    to: "server",
    type: "ethernet",
    bandwidth: 1000,
    latency: 2,
    status: "active",
  },
]

export function NetworkTopology() {
  const [nodes, setNodes] = useState<NetworkNode[]>(mockNodes)
  const [connections, setConnections] = useState<NetworkConnection[]>(mockConnections)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [viewMode, setViewMode] = useState<"topology" | "traffic" | "security">("topology")
  const svgRef = useRef<SVGSVGElement>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          traffic: {
            inbound: Math.max(0, node.traffic.inbound + (Math.random() - 0.5) * 10),
            outbound: Math.max(0, node.traffic.outbound + (Math.random() - 0.5) * 8),
          },
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "router":
        return <Router className="h-6 w-6" />
      case "device":
        return <Monitor className="h-6 w-6" />
      case "server":
        return <Server className="h-6 w-6" />
      case "firewall":
        return <Shield className="h-6 w-6" />
      case "internet":
        return <Globe className="h-6 w-6" />
      default:
        return <Network className="h-6 w-6" />
    }
  }

  const getNodeColor = (node: NetworkNode) => {
    if (viewMode === "security") {
      switch (node.riskLevel) {
        case "high":
          return "text-red-600 bg-red-100 dark:bg-red-900/30"
        case "medium":
          return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
        case "low":
          return "text-green-600 bg-green-100 dark:bg-green-900/30"
      }
    }

    switch (node.status) {
      case "online":
        return "text-green-600 bg-green-100 dark:bg-green-900/30"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
      case "offline":
        return "text-red-600 bg-red-100 dark:bg-red-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30"
    }
  }

  const getConnectionColor = (connection: NetworkConnection) => {
    if (viewMode === "traffic") {
      const intensity = Math.min(connection.bandwidth / 1000, 1)
      return `stroke-blue-${Math.round(intensity * 600 + 400)}`
    }

    switch (connection.status) {
      case "active":
        return "stroke-green-500"
      case "blocked":
        return "stroke-red-500"
      case "inactive":
        return "stroke-gray-400"
      default:
        return "stroke-gray-400"
    }
  }

  const getConnectionWidth = (connection: NetworkConnection) => {
    if (viewMode === "traffic") {
      return Math.max(2, Math.min(8, connection.bandwidth / 200))
    }
    return 2
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Network Topology</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visual representation of your network infrastructure and connections
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="topology">Topology</SelectItem>
              <SelectItem value="traffic">Traffic Flow</SelectItem>
              <SelectItem value="security">Security View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Diagram */}
        <Card className="lg:col-span-2 rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Network Map</span>
              <Badge variant="outline" className="ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
            </CardTitle>
            <CardDescription>
              {viewMode === "topology" && "Interactive network topology view"}
              {viewMode === "traffic" && "Real-time traffic flow visualization"}
              {viewMode === "security" && "Security risk assessment view"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
              <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
                {/* Connections */}
                {connections.map((connection) => {
                  const fromNode = nodes.find((n) => n.id === connection.from)
                  const toNode = nodes.find((n) => n.id === connection.to)
                  if (!fromNode || !toNode) return null

                  return (
                    <line
                      key={connection.id}
                      x1={fromNode.location.x}
                      y1={fromNode.location.y}
                      x2={toNode.location.x}
                      y2={toNode.location.y}
                      className={getConnectionColor(connection)}
                      strokeWidth={getConnectionWidth(connection)}
                      strokeDasharray={connection.type === "wifi" ? "5,5" : "none"}
                    />
                  )
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.location.x}
                      cy={node.location.y}
                      r="30"
                      className={`${getNodeColor(node)} cursor-pointer transition-all hover:scale-110`}
                      onClick={() => setSelectedNode(node)}
                    />
                    <foreignObject
                      x={node.location.x - 12}
                      y={node.location.y - 12}
                      width="24"
                      height="24"
                      className="pointer-events-none"
                    >
                      <div className="flex items-center justify-center w-full h-full">{getNodeIcon(node.type)}</div>
                    </foreignObject>
                    <text
                      x={node.location.x}
                      y={node.location.y + 45}
                      textAnchor="middle"
                      className="text-xs font-medium fill-current"
                    >
                      {node.name}
                    </text>
                    {viewMode === "traffic" && (
                      <text
                        x={node.location.x}
                        y={node.location.y + 58}
                        textAnchor="middle"
                        className="text-xs fill-current opacity-70"
                      >
                        ↓{node.traffic.inbound.toFixed(1)} ↑{node.traffic.outbound.toFixed(1)}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Node Details */}
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Node Details</span>
            </CardTitle>
            <CardDescription>
              {selectedNode ? `Information for ${selectedNode.name}` : "Select a node to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getNodeColor(selectedNode)}`}>
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <div className="font-medium">{selectedNode.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{selectedNode.ip}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={selectedNode.status === "online" ? "default" : "destructive"}>
                      {selectedNode.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Risk Level:</span>
                    <Badge
                      variant={
                        selectedNode.riskLevel === "low"
                          ? "default"
                          : selectedNode.riskLevel === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {selectedNode.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Traffic:</span>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Inbound:</span>
                        <span>{selectedNode.traffic.inbound.toFixed(1)} MB/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outbound:</span>
                        <span>{selectedNode.traffic.outbound.toFixed(1)} MB/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Connections:</span>
                    <div className="space-y-1">
                      {selectedNode.connections.map((connId) => {
                        const connectedNode = nodes.find((n) => n.id === connId)
                        return connectedNode ? (
                          <div key={connId} className="text-sm text-gray-600 dark:text-gray-400">
                            → {connectedNode.name} ({connectedNode.ip})
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on a node in the network map to view its details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Monitor className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
            <div className="text-xs text-muted-foreground">
              {nodes.filter((n) => n.status === "online").length} online
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connections.filter((c) => c.status === "active").length}</div>
            <div className="text-xs text-muted-foreground">
              {connections.filter((c) => c.status === "blocked").length} blocked
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.filter((n) => n.riskLevel === "high").length}</div>
            <div className="text-xs text-muted-foreground">
              {nodes.filter((n) => n.riskLevel === "medium").length} warnings
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
