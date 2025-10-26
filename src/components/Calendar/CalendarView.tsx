import React, { useState, useCallback } from 'react'
import { CalendarViewProps, CalendarEvent } from './CalendarView.types'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { EventModal } from './EventModal'
import { Button } from '../primitives/Button'
import { Select } from '../primitives/Select'
import { useCalendar } from '../../hooks/useCalendar'
import { useEventManager } from '../../hooks/useEventManager'
import { getMonthName, format } from '../../utils/date.utils'
import { clsx } from 'clsx'

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: externalEvents = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate,
}) => {
  const {
    currentDate,
    view,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    setView,
    setSelectedDate,
    setCurrentDate,
  } = useCalendar(initialDate, initialView)

  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEventManager()

  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>()

  // Use external events if provided, otherwise use internal state
  const displayEvents = externalEvents.length > 0 ? externalEvents : events

  const handleEventAdd = useCallback((event: CalendarEvent) => {
    if (externalEvents.length > 0) {
      onEventAdd(event)
    } else {
      addEvent(event)
    }
  }, [externalEvents.length, onEventAdd, addEvent])

  const handleEventUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    if (externalEvents.length > 0) {
      onEventUpdate(id, updates)
    } else {
      updateEvent(id, updates)
    }
  }, [externalEvents.length, onEventUpdate, updateEvent])

  const handleEventDelete = useCallback((id: string) => {
    if (externalEvents.length > 0) {
      onEventDelete(id)
    } else {
      deleteEvent(id)
    }
  }, [externalEvents.length, onEventDelete, deleteEvent])

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date)
    setModalInitialDate(date)
    setIsEventModalOpen(true)
  }, [setSelectedDate])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }, [])

  const handleSlotClick = useCallback((date: Date, hour: number, minute: number) => {
    const slotDate = new Date(date)
    slotDate.setHours(hour, minute, 0, 0)
    setModalInitialDate(slotDate)
    setIsEventModalOpen(true)
  }, [])

  const handleEventSave = useCallback((event: CalendarEvent) => {
    if (selectedEvent) {
      handleEventUpdate(selectedEvent.id, event)
    } else {
      handleEventAdd(event)
    }
    setSelectedEvent(null)
  }, [selectedEvent, handleEventUpdate, handleEventAdd])

  const handleEventDeleteCallback = useCallback((eventId: string) => {
    handleEventDelete(eventId)
    setSelectedEvent(null)
  }, [handleEventDelete])

  const handleCloseModal = useCallback(() => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
    setModalInitialDate(undefined)
  }, [])

  const viewOptions = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
  ]

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), i, 1)
    return { value: i.toString(), label: format(date, 'MMMM') }
  })

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentDate.getFullYear() - 5 + i
    return { value: year.toString(), label: year.toString() }
  })

  const handleMonthChange = useCallback((month: string) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(parseInt(month))
    setCurrentDate(newDate)
  }, [currentDate, setCurrentDate])

  const handleYearChange = useCallback((year: string) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(parseInt(year))
    setCurrentDate(newDate)
  }, [currentDate, setCurrentDate])

  return (
    <div className="calendar-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            {getMonthName(currentDate)}
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select
              options={monthOptions}
              value={currentDate.getMonth().toString()}
              onChange={handleMonthChange}
            />
            <Select
              options={yearOptions}
              value={currentDate.getFullYear().toString()}
              onChange={handleYearChange}
            />
          </div>
          
          <Select
            options={viewOptions}
            value={view}
            onChange={(value) => setView(value as 'month' | 'week')}
          />
        </div>
      </div>
      
      {/* Calendar Content */}
      <div className={clsx(
        'calendar-content',
        view === 'week' && 'week-view'
      )}>
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={displayEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={displayEvents}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
      </div>
      
      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        onSave={handleEventSave}
        onDelete={handleEventDeleteCallback}
        initialDate={modalInitialDate}
      />
    </div>
  )
}
