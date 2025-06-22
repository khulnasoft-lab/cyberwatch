"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Folder, FolderOpen, Plus, Edit, Trash2, ChevronDown, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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

interface RuleGroup {
  id: string
  name: string
  description: string
  color: string
  enabled: boolean
  rules: Rule[]
  expanded?: boolean
}

interface RuleGroupsProps {
  groups: RuleGroup[]
  onCreateGroup: (group: Omit<RuleGroup, "id" | "rules">) => void
  onUpdateGroup: (id: string, group: Partial<RuleGroup>) => void
  onDeleteGroup: (id: string) => void
  onToggleGroup: (id: string) => void
  onMoveRuleToGroup: (ruleId: string, groupId: string) => void
}

const colors = [
  { name: "Blue", value: "bg-blue-500", light: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Green", value: "bg-green-500", light: "bg-green-100 dark:bg-green-900/30" },
  { name: "Red", value: "bg-red-500", light: "bg-red-100 dark:bg-red-900/30" },
  { name: "Yellow", value: "bg-yellow-500", light: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Purple", value: "bg-purple-500", light: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Pink", value: "bg-pink-500", light: "bg-pink-100 dark:bg-pink-900/30" },
]

export function RuleGroups({
  groups,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onToggleGroup,
  onMoveRuleToGroup,
}: RuleGroupsProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingGroup, setEditingGroup] = useState<RuleGroup | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
    enabled: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGroup) {
      onUpdateGroup(editingGroup.id, formData)
      setEditingGroup(null)
    } else {
      onCreateGroup(formData)
    }
    setShowCreateDialog(false)
    setFormData({ name: "", description: "", color: "bg-blue-500", enabled: true })
  }

  const handleEdit = (group: RuleGroup) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      description: group.description,
      color: group.color,
      enabled: group.enabled,
    })
    setShowCreateDialog(true)
  }

  const toggleGroupExpansion = (groupId: string) => {
    onUpdateGroup(groupId, {
      expanded: !groups.find((g) => g.id === groupId)?.expanded,
    })
  }

  const getColorClass = (colorValue: string, light = false) => {
    const color = colors.find((c) => c.value === colorValue)
    return light ? color?.light : color?.value
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Rule Groups</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Organize your firewall rules into logical groups</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.id} className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <Collapsible open={group.expanded} onOpenChange={() => toggleGroupExpansion(group.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {group.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <div className={`w-4 h-4 rounded-full ${group.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {group.description} • {group.rules.length} rules
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={group.enabled ? "default" : "secondary"}>
                        {group.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(group)
                          }}
                          className="rounded-md"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteGroup(group.id)
                          }}
                          className="rounded-md text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={group.enabled}
                          onCheckedChange={(checked) => {
                            onUpdateGroup(group.id, { enabled: checked })
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  {group.rules.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                          <TableHead className="font-semibold">Application</TableHead>
                          <TableHead className="font-semibold">Destination</TableHead>
                          <TableHead className="font-semibold">Port</TableHead>
                          <TableHead className="font-semibold">Direction</TableHead>
                          <TableHead className="font-semibold">Action</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.rules.map((rule) => (
                          <TableRow key={rule.id} className="border-b border-gray-100 dark:border-gray-800">
                            <TableCell className="font-medium">{rule.app}</TableCell>
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
                              <Switch checked={rule.enabled} disabled />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No rules in this group yet.</p>
                      <p className="text-sm">Drag rules here or use the rule editor to add them.</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}

        {groups.length === 0 && (
          <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardContent className="text-center py-12">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No rule groups yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first rule group to organize your firewall rules
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>{editingGroup ? "Edit Group" : "Create New Group"}</span>
            </DialogTitle>
            <DialogDescription>
              {editingGroup ? "Modify the group settings" : "Create a new group to organize your rules"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Web Browsers, Development Tools"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this group"
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full ${color.value} ${
                      formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="enabled">Enable Group</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingGroup ? "Update Group" : "Create Group"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
