"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Filter, X, Plus, Save, Clock, Globe, Shield } from "lucide-react"
import { DatePickerWithRange } from "./date-picker-with-range"

interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
  type: "text" | "select" | "date" | "number"
}

interface SavedFilter {
  id: string
  name: string
  conditions: FilterCondition[]
  createdAt: Date
}

interface AdvancedFilteringProps {
  onApplyFilter: (conditions: FilterCondition[]) => void
  onSaveFilter: (filter: Omit<SavedFilter, "id" | "createdAt">) => void
  savedFilters: SavedFilter[]
  onLoadFilter: (filter: SavedFilter) => void
  onDeleteFilter: (id: string) => void
}

const filterFields = [
  { value: "app", label: "Application", type: "text" },
  { value: "path", label: "Path", type: "text" },
  { value: "destination", label: "Destination", type: "text" },
  { value: "port", label: "Port", type: "text" },
  { value: "direction", label: "Direction", type: "select", options: ["inbound", "outbound"] },
  { value: "action", label: "Action", type: "select", options: ["allow", "block"] },
  { value: "status", label: "Status", type: "select", options: ["active", "blocked", "allowed"] },
  { value: "timestamp", label: "Timestamp", type: "date" },
  { value: "duration", label: "Duration", type: "number" },
  { value: "bytesTransferred", label: "Data Transferred", type: "number" },
]

const operators = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "notContains", label: "Does not contain" },
  ],
  select: [
    { value: "equals", label: "Equals" },
    { value: "notEquals", label: "Not equals" },
  ],
  date: [
    { value: "after", label: "After" },
    { value: "before", label: "Before" },
    { value: "between", label: "Between" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "lastWeek", label: "Last week" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "greaterThan", label: "Greater than" },
    { value: "lessThan", label: "Less than" },
    { value: "between", label: "Between" },
  ],
}

export function AdvancedFiltering({
  onApplyFilter,
  onSaveFilter,
  savedFilters,
  onLoadFilter,
  onDeleteFilter,
}: AdvancedFilteringProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [quickFilters, setQuickFilters] = useState({
    showOnlyBlocked: false,
    showOnlyAllowed: false,
    showOnlyRecent: false,
    showOnlyHighTraffic: false,
  })

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: Date.now().toString(),
      field: "app",
      operator: "contains",
      value: "",
      type: "text",
    }
    setConditions([...conditions, newCondition])
  }

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map((condition) => (condition.id === id ? { ...condition, ...updates } : condition)))
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id))
  }

  const handleFieldChange = (id: string, field: string) => {
    const fieldConfig = filterFields.find((f) => f.value === field)
    updateCondition(id, {
      field,
      type: fieldConfig?.type as any,
      operator: operators[fieldConfig?.type as keyof typeof operators]?.[0]?.value || "contains",
      value: "",
    })
  }

  const applyFilters = () => {
    const validConditions = conditions.filter((c) => c.value.trim() !== "")
    onApplyFilter(validConditions)
  }

  const clearFilters = () => {
    setConditions([])
    setQuickFilters({
      showOnlyBlocked: false,
      showOnlyAllowed: false,
      showOnlyRecent: false,
      showOnlyHighTraffic: false,
    })
    onApplyFilter([])
  }

  const saveCurrentFilter = () => {
    if (filterName.trim() && conditions.length > 0) {
      onSaveFilter({
        name: filterName,
        conditions: conditions.filter((c) => c.value.trim() !== ""),
      })
      setFilterName("")
      setShowSaveDialog(false)
    }
  }

  const loadFilter = (filter: SavedFilter) => {
    setConditions(filter.conditions)
    onLoadFilter(filter)
  }

  const getFieldConfig = (fieldValue: string) => {
    return filterFields.find((f) => f.value === fieldValue)
  }

  const getOperators = (type: string) => {
    return operators[type as keyof typeof operators] || operators.text
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Filtering</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create complex filters to find exactly what you're looking for
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearFilters} className="rounded-lg">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={applyFilters} className="rounded-lg">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-base">Quick Filters</CardTitle>
          <CardDescription>Common filter presets for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="blocked"
                checked={quickFilters.showOnlyBlocked}
                onCheckedChange={(checked) => setQuickFilters((prev) => ({ ...prev, showOnlyBlocked: checked }))}
              />
              <Label htmlFor="blocked" className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span>Only Blocked</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allowed"
                checked={quickFilters.showOnlyAllowed}
                onCheckedChange={(checked) => setQuickFilters((prev) => ({ ...prev, showOnlyAllowed: checked }))}
              />
              <Label htmlFor="allowed" className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Only Allowed</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recent"
                checked={quickFilters.showOnlyRecent}
                onCheckedChange={(checked) => setQuickFilters((prev) => ({ ...prev, showOnlyRecent: checked }))}
              />
              <Label htmlFor="recent" className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Last Hour</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="highTraffic"
                checked={quickFilters.showOnlyHighTraffic}
                onCheckedChange={(checked) => setQuickFilters((prev) => ({ ...prev, showOnlyHighTraffic: checked }))}
              />
              <Label htmlFor="highTraffic" className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-purple-600" />
                <span>High Traffic</span>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Conditions */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Filter Conditions</CardTitle>
              <CardDescription>Build complex queries with multiple conditions</CardDescription>
            </div>
            <Button onClick={addCondition} variant="outline" className="rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {conditions.map((condition, index) => (
            <div key={condition.id} className="space-y-4">
              {index > 0 && (
                <div className="flex items-center space-x-2">
                  <Separator className="flex-1" />
                  <Badge variant="outline">AND</Badge>
                  <Separator className="flex-1" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="space-y-2">
                  <Label>Field</Label>
                  <Select value={condition.field} onValueChange={(value) => handleFieldChange(condition.id, value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Operator</Label>
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(condition.id, { operator: value })}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperators(condition.type).map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Value</Label>
                  {condition.type === "select" ? (
                    <Select value={condition.value} onValueChange={(value) => updateCondition(condition.id, { value })}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFieldConfig(condition.field)?.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : condition.type === "date" ? (
                    <DatePickerWithRange
                      date={
                        condition.value ? { from: new Date(condition.value), to: new Date(condition.value) } : undefined
                      }
                      onDateChange={(date) => updateCondition(condition.id, { value: date?.from?.toISOString() || "" })}
                    />
                  ) : (
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                      placeholder={`Enter ${getFieldConfig(condition.field)?.label.toLowerCase()}`}
                      className="rounded-lg"
                    />
                  )}
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                    className="rounded-lg text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {conditions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No filter conditions yet.</p>
              <p className="text-sm">Click "Add Condition" to create your first filter.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Filters */}
      <Card className="rounded-xl shadow-sm border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Saved Filters</CardTitle>
              <CardDescription>Quick access to your frequently used filters</CardDescription>
            </div>
            {conditions.length > 0 && (
              <Button onClick={() => setShowSaveDialog(true)} variant="outline" className="rounded-lg">
                <Save className="h-4 w-4 mr-2" />
                Save Current Filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {savedFilters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedFilters.map((filter) => (
                <div key={filter.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{filter.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteFilter(filter.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1 mb-3">
                    {filter.conditions.slice(0, 2).map((condition, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        {getFieldConfig(condition.field)?.label} {condition.operator} "{condition.value}"
                      </div>
                    ))}
                    {filter.conditions.length > 2 && (
                      <div className="text-xs text-gray-500">+{filter.conditions.length - 2} more conditions</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{filter.createdAt.toLocaleDateString()}</span>
                    <Button size="sm" onClick={() => loadFilter(filter)} className="rounded-lg">
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Save className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved filters yet.</p>
              <p className="text-sm">Create and save filters for quick access later.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Filter</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="filterName">Filter Name</Label>
                <Input
                  id="filterName"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter a name for this filter"
                  className="rounded-lg"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This filter has {conditions.filter((c) => c.value.trim() !== "").length} conditions
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="flex-1 rounded-lg">
                Cancel
              </Button>
              <Button onClick={saveCurrentFilter} disabled={!filterName.trim()} className="flex-1 rounded-lg">
                Save Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
