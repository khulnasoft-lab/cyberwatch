"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, CheckCircle, XCircle } from "lucide-react"

interface RuleTemplate {
  id: string
  name: string
  description: string
  category: string
  rules: Array<{
    app: string
    path: string
    destination: string
    port: string
    direction: "inbound" | "outbound"
    action: "allow" | "block"
  }>
}

interface RuleTemplatesProps {
  onApplyTemplate: (template: RuleTemplate) => void
}

const templates: RuleTemplate[] = [
  {
    id: "web-browsers",
    name: "Web Browsers",
    description: "Common rules for web browsers",
    category: "Internet",
    rules: [
      {
        app: "Chrome",
        path: "/Applications/Google Chrome.app",
        destination: "*",
        port: "80,443",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Safari",
        path: "/Applications/Safari.app",
        destination: "*",
        port: "80,443",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Firefox",
        path: "/Applications/Firefox.app",
        destination: "*",
        port: "80,443",
        direction: "outbound",
        action: "allow",
      },
    ],
  },
  {
    id: "communication",
    name: "Communication Apps",
    description: "Rules for messaging and video calling",
    category: "Communication",
    rules: [
      {
        app: "Slack",
        path: "/Applications/Slack.app",
        destination: "*",
        port: "443",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Discord",
        path: "/Applications/Discord.app",
        destination: "*",
        port: "443,80",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Zoom",
        path: "/Applications/zoom.us.app",
        destination: "*",
        port: "443,80,8801,8802",
        direction: "outbound",
        action: "allow",
      },
    ],
  },
  {
    id: "development",
    name: "Development Tools",
    description: "Rules for development environments",
    category: "Development",
    rules: [
      {
        app: "VS Code",
        path: "/Applications/Visual Studio Code.app",
        destination: "*",
        port: "443,80",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Terminal",
        path: "/Applications/Utilities/Terminal.app",
        destination: "*",
        port: "22,443,80",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Docker",
        path: "/Applications/Docker.app",
        destination: "*",
        port: "*",
        direction: "outbound",
        action: "allow",
      },
    ],
  },
  {
    id: "security-strict",
    name: "High Security",
    description: "Strict security rules blocking most connections",
    category: "Security",
    rules: [
      {
        app: "*",
        path: "*",
        destination: "*",
        port: "*",
        direction: "inbound",
        action: "block",
      },
      {
        app: "Unknown Process",
        path: "*",
        destination: "*",
        port: "*",
        direction: "outbound",
        action: "block",
      },
    ],
  },
  {
    id: "media-streaming",
    name: "Media & Streaming",
    description: "Rules for media and streaming applications",
    category: "Entertainment",
    rules: [
      {
        app: "Spotify",
        path: "/Applications/Spotify.app",
        destination: "*",
        port: "443,80",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "Netflix",
        path: "/Applications/Netflix.app",
        destination: "*",
        port: "443,80",
        direction: "outbound",
        action: "allow",
      },
      {
        app: "VLC",
        path: "/Applications/VLC.app",
        destination: "*",
        port: "*",
        direction: "outbound",
        action: "allow",
      },
    ],
  },
]

export function RuleTemplates({ onApplyTemplate }: RuleTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Rule Templates</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pre-configured rule sets for common applications and scenarios
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-lg"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-lg"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rules ({template.rules.length}):
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {template.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="font-medium">{rule.app}</span>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {rule.direction}
                        </Badge>
                        {rule.action === "allow" ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => onApplyTemplate(template)} className="w-full rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Apply Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
