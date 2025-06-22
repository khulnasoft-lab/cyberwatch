"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FolderOpen, Plus } from "lucide-react"

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

interface RuleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (rule: Omit<Rule, "id">) => void
  editingRule?: Rule | null
}

export function RuleForm({ open, onOpenChange, onSubmit, editingRule }: RuleFormProps) {
  const [formData, setFormData] = useState({
    app: editingRule?.app || "",
    path: editingRule?.path || "",
    destination: editingRule?.destination || "*",
    port: editingRule?.port || "*",
    direction: editingRule?.direction || ("outbound" as "inbound" | "outbound"),
    action: editingRule?.action || ("allow" as "allow" | "block"),
    enabled: editingRule?.enabled ?? true,
    description: editingRule?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      app: "",
      path: "",
      destination: "*",
      port: "*",
      direction: "outbound",
      action: "allow",
      enabled: true,
      description: "",
    })
  }

  const handleBrowsePath = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll set a sample path
    setFormData((prev) => ({
      ...prev,
      path: "/Applications/Example.app",
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>{editingRule ? "Edit Rule" : "Create New Rule"}</span>
          </DialogTitle>
          <DialogDescription>
            {editingRule ? "Modify the existing firewall rule" : "Add a new firewall rule to control network access"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app">Application Name</Label>
              <Input
                id="app"
                value={formData.app}
                onChange={(e) => setFormData((prev) => ({ ...prev, app: e.target.value }))}
                placeholder="e.g., Chrome, Slack"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction">Direction</Label>
              <Select
                value={formData.direction}
                onValueChange={(value: "inbound" | "outbound") =>
                  setFormData((prev) => ({ ...prev, direction: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Application Path</Label>
            <div className="flex space-x-2">
              <Input
                id="path"
                value={formData.path}
                onChange={(e) => setFormData((prev) => ({ ...prev, path: e.target.value }))}
                placeholder="/Applications/Example.app"
                required
              />
              <Button type="button" variant="outline" onClick={handleBrowsePath}>
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="* or specific domain/IP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port(s)</Label>
              <Input
                id="port"
                value={formData.port}
                onChange={(e) => setFormData((prev) => ({ ...prev, port: e.target.value }))}
                placeholder="* or 80,443"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select
                value={formData.action}
                onValueChange={(value: "allow" | "block") => setFormData((prev) => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="enabled">Enable Rule</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this rule..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingRule ? "Update Rule" : "Create Rule"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
