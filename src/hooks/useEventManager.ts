import { useState, useCallback, useRef } from 'react'
import { CalendarEvent, DragState } from '../components/Calendar/CalendarView.types'
import { generateId, validateEvent, getEventColor } from '../utils/event.utils'

export const useEventManager = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [dragState, setDragState] = useState<DragState>({ isDragging: false })
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null)

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const validationErrors = validateEvent(event)
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }

    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
      color: event.color || getEventColor(),
    }

    setEvents(prev => [...prev, newEvent])
    return newEvent
  }, [])

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    const validationErrors = validateEvent(updates)
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }

    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    )
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }, [])

  const getEvent = useCallback((id: string) => {
    return events.find(event => event.id === id)
  }, [events])

  const startDrag = useCallback((eventId: string, startPosition: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      eventId,
    })
    dragStartPosition.current = startPosition
  }, [])

  const updateDrag = useCallback(() => {
    if (!dragState.isDragging) return

    setDragState(prev => ({
      ...prev,
    }))
  }, [dragState.isDragging])

  const endDrag = useCallback((endPosition: { x: number; y: number }) => {
    if (!dragState.isDragging || !dragState.eventId) return

    // Figure out what time slot this corresponds to
    const newTime = calculateTimeFromPosition(endPosition)
    
    if (newTime) {
      const event = getEvent(dragState.eventId)
      if (event) {
        // Keep the same duration, just move the start time
        const duration = event.endDate.getTime() - event.startDate.getTime()
        const newStartDate = new Date(event.startDate)
        newStartDate.setHours(newTime.hour, newTime.minute, 0, 0)
        
        const newEndDate = new Date(newStartDate.getTime() + duration)
        
        updateEvent(dragState.eventId, {
          startDate: newStartDate,
          endDate: newEndDate,
        })
      }
    }

    setDragState({ isDragging: false })
    dragStartPosition.current = null
  }, [dragState.isDragging, dragState.eventId, getEvent, updateEvent])

  const cancelDrag = useCallback(() => {
    setDragState({ isDragging: false })
    dragStartPosition.current = null
  }, [])

  const createEventFromDrag = useCallback((
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) => {
    const startTime = calculateTimeFromPosition(startPosition)
    const endTime = calculateTimeFromPosition(endPosition)

    if (!startTime || !endTime) return

    const startDate = new Date()
    startDate.setHours(startTime.hour, startTime.minute, 0, 0)
    
    const endDate = new Date()
    endDate.setHours(endTime.hour, endTime.minute, 0, 0)

    // Make sure end is after start
    if (endDate <= startDate) {
      endDate.setMinutes(startDate.getMinutes() + 30)
    }

    return addEvent({
      title: 'New Event',
      startDate,
      endDate,
    })
  }, [addEvent])

  const calculateTimeFromPosition = (position: { x: number; y: number }) => {
    // Each time slot is 32px tall
    const slotHeight = 32 
    const slotIndex = Math.floor(position.y / slotHeight)
    
    const hour = Math.floor(slotIndex / 2)
    const minute = slotIndex % 2 === 0 ? 0 : 30

    if (hour >= 0 && hour < 24) {
      return { hour, minute }
    }

    return null
  }

  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      const targetDate = new Date(date)
      
      return eventStart <= targetDate && eventEnd >= targetDate
    })
  }, [events])

  const getEventsForTimeSlot = useCallback((hour: number, minute: number) => {
    const slotStart = new Date()
    slotStart.setHours(hour, minute, 0, 0)
    
    const slotEnd = new Date()
    slotEnd.setHours(hour, minute + 30, 0, 0)
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      
      return eventStart < slotEnd && eventEnd > slotStart
    })
  }, [events])

  return {
    events,
    dragState,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    createEventFromDrag,
    getEventsForDate,
    getEventsForTimeSlot,
  }
}
