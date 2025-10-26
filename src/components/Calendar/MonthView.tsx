import React, { memo } from 'react'
import { CalendarEvent } from './CalendarView.types'
import { CalendarCell } from './CalendarCell'
import { getCalendarGrid, getWeekDays, isSameMonth, isToday } from '../../utils/date.utils'

export interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export const MonthView: React.FC<MonthViewProps> = memo(({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const calendarGrid = getCalendarGrid(currentDate)
  const weekDays = getWeekDays()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-neutral-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-neutral-600 bg-neutral-50"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarGrid.map((date, index) => (
          <CalendarCell
            key={index}
            date={date}
            isCurrentMonth={isSameMonth(date, currentDate)}
            isToday={isToday(date)}
            events={events}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  )
})

MonthView.displayName = 'MonthView'
