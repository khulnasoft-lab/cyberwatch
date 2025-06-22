"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, Database, Zap, Eye, RefreshCw, MapPin, Ban } from "lucide-react"

interface ThreatData {
  id: string
  ip: string
  country: string
  threatType: "malware" | "botnet" | "phishing" | "spam" | "scanning"
  severity: "low" | "medium" | "high" | "critical"
  confidence: number
  firstSeen: Date
  lastSeen: Date
  attempts: number
  blocked: boolean
  source: string
}

interface ThreatFeed {
  id: string
  name: string
  status: "active" | "inactive" | "error"
  lastUpdate: Date
  threats: number
  accuracy: number
}

interface GeolocationData {
  country: string
  threats: number
  percentage: number
}

const mockThreats: ThreatData[] = [
  {
    id: "1",
    ip: "185.220.101.42",
    country: "Russia",
    threatType: "malware",
    severity: "critical",
    confidence: 95,
    firstSeen: new Date(Date.now() - 86400000),
    lastSeen: new Date(Date.now() - 3600000),
    attempts: 15,
    blocked: true,
    source: "VirusTotal",
  },
  {
    id: "2",
    ip: "103.224.182.251",
    country: "China",
    threatType: "scanning",
    severity: "medium",
    confidence: 78,
    firstSeen: new Date(Date.now() - 172800000),
    lastSeen: new Date(Date.now() - 1800000),
    attempts: 8,
    blocked: true,
    source: "AbuseIPDB",
  },
  {
    id: "3",
    ip: "45.142.214.123",
    country: "Netherlands",
    threatType: "botnet",
    severity: "high",
    confidence: 89,
    firstSeen: new Date(Date.now() - 259200000),
    lastSeen: new Date(Date.now() - 900000),
    attempts: 23,
    blocked: true,
    source: "Spamhaus",
  },
  {
    id: "4",
    ip: "198.51.100.42",
    country: "United States",
    threatType: "phishing",
    severity: "high",
    confidence: 92,
    firstSeen: new Date(Date.now() - 345600000),
    lastSeen: new Date(Date.now() - 7200000),
    attempts: 5,
    blocked: false,
    source: "PhishTank",
  },
]

const mockFeeds: ThreatFeed[] = [
  {
    id: "1",
    name: "VirusTotal",
    status: "active",
    lastUpdate: new Date(Date.now() - 300000),
    threats: 1247,
    accuracy: 96.8,
  },
  {
    id: "2",
    name: "AbuseIPDB",
    status: "active",
    lastUpdate: new Date(Date.now() - 600000),
    threats: 892,
    accuracy: 94.2,
  },
  {
    id: "3",
    name: "Spamhaus",
    status: "active",
    lastUpdate: new Date(Date.now() - 900000),
    threats: 2156,
    accuracy: 98.1,
  },
  {
    id: "4",
    name: "PhishTank",
    status: "error",
    lastUpdate: new Date(Date.now() - 3600000),
    threats: 0,
    accuracy: 0,
  },
]

const mockGeoData: GeolocationData[] = [
  { country: "Russia", threats: 45, percentage: 32.1 },
  { country: "China", threats: 38, percentage: 27.1 },
  { country: "United States", threats: 22, percentage: 15.7 },
  { country: "Netherlands", threats: 18, percentage: 12.9 },
  { country: "Germany", threats: 12, percentage: 8.6 },
  { country: "Others", threats: 5, percentage: 3.6 },
]

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatData[]>(mockThreats)
  const [feeds, setFeeds] = useState<ThreatFeed[]>(mockFeeds)
  const [geoData] = useState<GeolocationData[]>(mockGeoData)
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate real-time threat updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new threats
      if (Math.random() > 0.8) {
        const newThreat: ThreatData = {
          id: Date.now().toString(),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          country: ["Russia", "China", "Brazil", "India", "Iran"][Math.floor(Math.random() * 5)],
          threatType: ["malware", "botnet", "phishing", "spam", "scanning"][Math.floor(Math.random() * 5)] as any,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          confidence: Math.floor(Math.random() * 40) + 60,
          firstSeen: new Date(),
          lastSeen: new Date(),
          attempts: Math.floor(Math.random() * 20) + 1,
          blocked: Math.random() > 0.3,
          source: ["VirusTotal", "AbuseIPDB", "Spamhaus"][Math.floor(Math.random() * 3)],
        }
        setThreats((prev) => [newThreat, ...prev.slice(0, 9)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefreshFeeds = async () => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFeeds((prev) =>
      prev.map((feed) => ({
        ...feed,
        lastUpdate: new Date(),
        threats: feed.status === "active" ? feed.threats + Math.floor(Math.random() * 50) : feed.threats,
      })),
    )
    setIsUpdating(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/30"
      case "high":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30"
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30"
    }
  }

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <Shield className="h-4 w-4" />
      case "botnet":
        return <Zap className="h-4 w-4" />
      case "phishing":
        return <Eye className="h-4 w-4" />
      case "scanning":
        return <Database className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const totalThreats = threats.length
  const blockedThreats = threats.filter((t) => t.blocked).length
  const criticalThreats = threats.filter((t) => t.severity === "critical").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Threat Intelligence</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time threat detection and intelligence from multiple sources
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshFeeds} disabled={isUpdating} className="rounded-lg">
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? "animate-spin" : ""}`} />
            Update Feeds
          </Button>
        </div>
      </div>

      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalThreats}</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <Ban className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{blockedThreats}</div>
            <div className="text-xs text-muted-foreground">
              {((blockedThreats / totalThreats) * 100).toFixed(1)}% success rate
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{criticalThreats}</div>
            <div className="text-xs text-muted-foreground">Require immediate attention</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Feeds</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{feeds.filter((f) => f.status === "active").length}</div>
            <div className="text-xs text-muted-foreground">
              {feeds.filter((f) => f.status === "error").length} offline
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-lg">
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
          <TabsTrigger value="feeds">Intelligence Feeds</TabsTrigger>
          <TabsTrigger value="geography">Geographic Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Recent Threats</span>
                <Badge variant="outline" className="ml-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>Real-time threat detection and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getSeverityColor(threat.severity)}`}>
                        {getThreatTypeIcon(threat.threatType)}
                      </div>
                      <div>
                        <div className="font-medium">{threat.ip}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {threat.country} • {threat.threatType} • {threat.attempts} attempts
                        </div>
                        <div className="text-xs text-gray-500">
                          Source: {threat.source} • Confidence: {threat.confidence}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={threat.severity === "critical" ? "destructive" : "secondary"}>
                        {threat.severity.toUpperCase()}
                      </Badge>
                      <Badge variant={threat.blocked ? "default" : "destructive"}>
                        {threat.blocked ? "BLOCKED" : "ALLOWED"}
                      </Badge>
                      <div className="text-right text-xs text-gray-500">
                        <div>Last seen:</div>
                        <div>{threat.lastSeen.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Threat Intelligence Feeds</span>
              </CardTitle>
              <CardDescription>Status and performance of threat intelligence sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feeds.map((feed) => (
                  <div key={feed.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            feed.status === "active"
                              ? "bg-green-500"
                              : feed.status === "error"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{feed.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Last update: {feed.lastUpdate.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm">
                          <div className="font-medium">{feed.threats.toLocaleString()}</div>
                          <div className="text-gray-600 dark:text-gray-400">threats</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{feed.accuracy.toFixed(1)}%</div>
                          <div className="text-gray-600 dark:text-gray-400">accuracy</div>
                        </div>
                        <Badge variant={feed.status === "active" ? "default" : "destructive"}>
                          {feed.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    {feed.status === "active" && <Progress value={feed.accuracy} className="h-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Geographic Threat Distribution</span>
              </CardTitle>
              <CardDescription>Threat origins by country and region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geoData.map((geo, index) => (
                  <div key={geo.country} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{geo.country}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{geo.threats} threats</span>
                        <span className="text-sm font-medium">{geo.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={geo.percentage} className="h-2" />
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
