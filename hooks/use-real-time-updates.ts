"use client"

import { useState, useEffect, useCallback } from "react"

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

export function useRealTimeUpdates(initialConnections: Connection[]) {
  const [connections, setConnections] = useState<Connection[]>(initialConnections)
  const [isConnected, setIsConnected] = useState(false)

  const simulateRealTimeUpdates = useCallback(() => {
    const apps = ["Chrome", "Slack", "Discord", "Spotify", "VS Code", "Terminal", "Safari"]
    const destinations = ["google.com", "slack.com", "discord.com", "spotify.com", "github.com", "apple.com"]
    const ports = [80, 443, 8080, 3000, 5432, 22]

    const interval = setInterval(() => {
      // Randomly add new connections
      if (Math.random() > 0.7) {
        const newConnection: Connection = {
          id: Date.now().toString(),
          app: apps[Math.floor(Math.random() * apps.length)],
          path: `/Applications/${apps[Math.floor(Math.random() * apps.length)]}.app`,
          destination: destinations[Math.floor(Math.random() * destinations.length)],
          port: ports[Math.floor(Math.random() * ports.length)],
          direction: Math.random() > 0.5 ? "outbound" : "inbound",
          status: Math.random() > 0.8 ? "blocked" : "active",
          timestamp: "Just now",
        }

        setConnections((prev) => [newConnection, ...prev.slice(0, 9)]) // Keep only 10 most recent
      }

      // Update timestamps
      setConnections((prev) =>
        prev.map((conn) => ({
          ...conn,
          timestamp:
            conn.timestamp === "Just now"
              ? "1 min ago"
              : conn.timestamp === "1 min ago"
                ? "2 min ago"
                : conn.timestamp === "2 min ago"
                  ? "5 min ago"
                  : conn.timestamp,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsConnected(true)
    const cleanup = simulateRealTimeUpdates()
    return cleanup
  }, [simulateRealTimeUpdates])

  return { connections, isConnected }
}
