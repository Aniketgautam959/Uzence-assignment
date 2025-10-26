import React, { memo } from 'react'
import { CalendarEvent } from './CalendarView.types'
import { getEventsForDate } from '../../utils/event.utils'
import { clsx } from 'clsx'

export interface CalendarCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export const CalendarCell: React.FC<CalendarCellProps> = memo(({
  date,
  isCurrentMonth,
  isToday,
  events,
  onDateClick,
  onEventClick,
}) => {
  const dayEvents = getEventsForDate(events, date)
  const visibleEvents = dayEvents.slice(0, 3)
  const remainingCount = dayEvents.length - 3

  const handleDateClick = () => {
    onDateClick(date)
  }

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick(event)
  }

  return (
    <div
      className={clsx(
        'calendar-cell',
        isToday && 'today',
        !isCurrentMonth && 'other-month'
      )}
      onClick={handleDateClick}
      role="button"
      tabIndex={0}
      aria-label={`${date.toLocaleDateString()}${isToday ? ', today' : ''}${dayEvents.length > 0 ? `, ${dayEvents.length} events` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleDateClick()
        }
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={clsx(
          'text-sm font-medium',
          isToday && 'text-primary-600',
          !isCurrentMonth && 'text-neutral-400'
        )}>
          {date.getDate()}
        </span>
      </div>
      
      <div className="space-y-1">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="event-chip"
            style={{ backgroundColor: event.color }}
            onClick={(e) => handleEventClick(event, e)}
            title={`${event.title} - ${event.startDate.toLocaleTimeString()}`}
          >
            {event.title}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <button
            className="text-xs text-neutral-500 hover:text-neutral-700 px-1 py-0.5 rounded hover:bg-neutral-100"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Show expanded view with all events
            }}
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  )
})

CalendarCell.displayName = 'CalendarCell'
