"use client"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps {
  date: { from: Date; to: Date } | undefined
  onDateChange: (date: { from: Date; to: Date } | undefined) => void
}

export function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn("justify-start text-left font-normal rounded-lg", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
              </>
            ) : (
              date.from.toLocaleDateString()
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
