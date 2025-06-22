"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Trash2, CheckCircle, XCircle } from "lucide-react"
import { DatePickerWithRange } from "./date-picker-with-range"

interface HistoryConnection {
  id: string
  app: string
  path: string
  destination: string
  port: number
  direction: "inbound" | "outbound"
  status: "allowed" | "blocked"
  timestamp: Date
  duration?: number
  bytesTransferred?: number
}

interface ConnectionHistoryProps {
  connections: HistoryConnection[]
  onClearHistory: () => void
  onExportHistory: () => void
}

export function ConnectionHistory({ connections, onClearHistory, onExportHistory }: ConnectionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "allowed" | "blocked">("all")
  const [directionFilter, setDirectionFilter] = useState<"all" | "inbound" | "outbound">("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()

  const filteredConnections = connections.filter((conn) => {
    const matchesSearch =
      conn.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.path.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || conn.status === statusFilter
    const matchesDirection = directionFilter === "all" || conn.direction === directionFilter

    const matchesDate = !dateRange || (conn.timestamp >= dateRange.from && conn.timestamp <= dateRange.to)

    return matchesSearch && matchesStatus && matchesDirection && matchesDate
  })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Connection History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete log of all network connections ({connections.length} total)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onExportHistory} className="rounded-lg">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onClearHistory} className="rounded-lg text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "allowed" | "blocked") => setStatusFilter(value)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="allowed">Allowed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={directionFilter}
              onValueChange={(value: "all" | "inbound" | "outbound") => setDirectionFilter(value)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
              </SelectContent>
            </Select>

            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setDirectionFilter("all")
                setDateRange(undefined)
              }}
              className="rounded-lg"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="font-semibold">Application</TableHead>
                <TableHead className="font-semibold">Destination</TableHead>
                <TableHead className="font-semibold">Port</TableHead>
                <TableHead className="font-semibold">Direction</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConnections.map((conn) => (
                <TableRow key={conn.id} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="text-sm">{conn.timestamp.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{conn.app}</TableCell>
                  <TableCell>{conn.destination}</TableCell>
                  <TableCell>{conn.port}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {conn.direction}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={conn.status === "allowed" ? "default" : "destructive"}>
                      {conn.status === "allowed" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Allowed
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" /> Blocked
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{conn.duration ? formatDuration(conn.duration) : "-"}</TableCell>
                  <TableCell className="text-sm">
                    {conn.bytesTransferred ? formatBytes(conn.bytesTransferred) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredConnections.length === 0 && (
            <div className="text-center py-8 text-gray-500">No connections found matching your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
