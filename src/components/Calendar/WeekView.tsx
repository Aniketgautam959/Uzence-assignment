import React, { memo, useState, useRef, useCallback } from 'react'
import { CalendarEvent, DragState } from './CalendarView.types'
import { getTimeSlots, formatTime, addDays, format, getDay } from '../../utils/date.utils'
import { calculateEventPosition, getEventsForTimeSlot } from '../../utils/event.utils'
import { clsx } from 'clsx'

export interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: Date, hour: number, minute: number) => void
  onEventCreate?: (startTime: Date, endTime: Date) => void
}

export const WeekView: React.FC<WeekViewProps> = memo(({
  currentDate,
  events,
  onEventClick,
  onSlotClick,
  onEventCreate,
}) => {
  const [dragState, setDragState] = useState<DragState>({ isDragging: false })
  const [isCreating, setIsCreating] = useState(false)
  const [createStart, setCreateStart] = useState<{ hour: number; minute: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const timeSlots = getTimeSlots()
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i - getDay(currentDate)))

  const handleSlotClick = useCallback((hour: number, minute: number, dayIndex: number) => {
    const date = weekDays[dayIndex]
    date.setHours(hour, minute, 0, 0)
    onSlotClick(date, hour, minute)
  }, [weekDays, onSlotClick])

  const handleSlotMouseDown = useCallback((hour: number, minute: number, _dayIndex: number, e: React.MouseEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setCreateStart({ hour, minute })
  }, [])

  const handleSlotMouseMove = useCallback((_hour: number, _minute: number, _dayIndex: number, e: React.MouseEvent) => {
    if (!isCreating || !createStart) return
    
    e.preventDefault()
    // TODO: Add visual feedback for drag-to-create
  }, [isCreating, createStart])

  const handleSlotMouseUp = useCallback((hour: number, minute: number, dayIndex: number, e: React.MouseEvent) => {
    if (!isCreating || !createStart) return
    
    e.preventDefault()
    setIsCreating(false)
    
    if (onEventCreate && createStart) {
      const startDate = new Date(weekDays[dayIndex])
      startDate.setHours(createStart.hour, createStart.minute, 0, 0)
      
      const endDate = new Date(weekDays[dayIndex])
      endDate.setHours(hour, minute, 0, 0)
      
      if (endDate > startDate) {
        onEventCreate(startDate, endDate)
      }
    }
    
    setCreateStart(null)
  }, [isCreating, createStart, onEventCreate, weekDays])

  const handleEventMouseDown = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragState({
      isDragging: true,
      eventId: event.id,
    })
  }, [])

  const handleEventMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging) return
    
    e.preventDefault()
    // TODO: Update drag preview position
  }, [dragState.isDragging])

  const handleEventMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging) return
    
    e.preventDefault()
    setDragState({ isDragging: false })
  }, [dragState.isDragging])

  const getEventStyle = (event: CalendarEvent): React.CSSProperties => {
    const position = calculateEventPosition(event)
    const dayEvents = getEventsForTimeSlot(events, event.startDate.getHours(), event.startDate.getMinutes())
    const eventIndex = dayEvents.findIndex(e => e.id === event.id)
    
    return {
      top: `${position.top}px`,
      height: `${position.height}px`,
      left: `${(eventIndex * 100) / dayEvents.length}%`,
      width: `${100 / dayEvents.length}%`,
      backgroundColor: event.color,
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-neutral-200">
        <div className="p-3 text-sm font-medium text-neutral-600 bg-neutral-50 border-r border-neutral-200">
          Time
        </div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="p-3 text-center text-sm font-medium text-neutral-600 bg-neutral-50 border-r border-neutral-200 last:border-r-0"
          >
            <div>{format(day, 'EEE')}</div>
            <div className="text-lg font-semibold">{day.getDate()}</div>
          </div>
        ))}
      </div>
      
      {/* Time Grid */}
      <div className="grid grid-cols-8 max-h-96 overflow-y-auto" ref={containerRef}>
        {timeSlots.map((slot, slotIndex) => (
          <React.Fragment key={slotIndex}>
            {/* Time Label */}
            <div className={clsx(
              'time-slot border-r border-neutral-200',
              slot.minute === 0 && 'hour'
            )}>
              {slot.minute === 0 && formatTime(new Date(2024, 0, 1, slot.hour, 0, 0))}
            </div>
            
            {/* Day Columns */}
            {weekDays.map((day, dayIndex) => (
              <div
                key={`${slotIndex}-${dayIndex}`}
                className={clsx(
                  'time-slot border-r border-neutral-200 last:border-r-0 cursor-pointer hover:bg-neutral-50',
                  slot.minute === 0 && 'border-t border-neutral-300'
                )}
                onClick={() => handleSlotClick(slot.hour, slot.minute, dayIndex)}
                onMouseDown={(e) => handleSlotMouseDown(slot.hour, slot.minute, dayIndex, e)}
                onMouseMove={(e) => handleSlotMouseMove(slot.hour, slot.minute, dayIndex, e)}
                onMouseUp={(e) => handleSlotMouseUp(slot.hour, slot.minute, dayIndex, e)}
                role="button"
                tabIndex={0}
                aria-label={`${formatTime(new Date(2024, 0, 1, slot.hour, slot.minute, 0))} on ${format(day, 'MMM d')}`}
              >
                {/* Events for this time slot */}
                {events
                  .filter(event => {
                    const eventStart = new Date(event.startDate)
                    const eventEnd = new Date(event.endDate)
                    const slotStart = new Date(day)
                    slotStart.setHours(slot.hour, slot.minute, 0, 0)
                    const slotEnd = new Date(day)
                    slotEnd.setHours(slot.hour, slot.minute + 30, 0, 0)
                    
                    return eventStart < slotEnd && eventEnd > slotStart
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      className="absolute inset-x-1 bg-primary-500 text-white text-xs p-1 rounded cursor-pointer hover:bg-primary-600 transition-colors"
                      style={getEventStyle(event)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      onMouseDown={(e) => handleEventMouseDown(event, e)}
                      onMouseMove={handleEventMouseMove}
                      onMouseUp={handleEventMouseUp}
                      title={`${event.title} - ${formatTime(event.startDate)}`}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
})

WeekView.displayName = 'WeekView'
