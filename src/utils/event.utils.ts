import { CalendarEvent } from '../components/Calendar/CalendarView.types'

export const generateId = (): string => {
  // Simple ID generator - could be improved with uuid if needed
  return Math.random().toString(36).substr(2, 9)
}

export const validateEvent = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = []
  
  if (!event.title || event.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (event.title && event.title.length > 100) {
    errors.push('Title must be 100 characters or less')
  }
  
  if (event.description && event.description.length > 500) {
    errors.push('Description must be 500 characters or less')
  }
  
  if (!event.startDate) {
    errors.push('Start date is required')
  }
  
  if (!event.endDate) {
    errors.push('End date is required')
  }
  
  if (event.startDate && event.endDate && event.startDate >= event.endDate) {
    errors.push('End date must be after start date')
  }
  
  return errors
}

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    const targetDate = new Date(date)
    
    
    return eventStart <= targetDate && eventEnd >= targetDate
  })
}

export const getEventsForTimeSlot = (
  events: CalendarEvent[],
  hour: number,
  minute: number
): CalendarEvent[] => {
  const slotStart = new Date()
  slotStart.setHours(hour, minute, 0, 0)
  
  const slotEnd = new Date()
  slotEnd.setHours(hour, minute + 30, 0, 0)
  
  return events.filter(event => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    
    
    return eventStart < slotEnd && eventEnd > slotStart
  })
}

export const calculateEventPosition = (event: CalendarEvent): {
  top: number
  height: number
  left: number
  width: number
} => {
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)
  
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()
  
  const top = (startMinutes / 30) * 32 // 32px per 30-minute slot
  const height = ((endMinutes - startMinutes) / 30) * 32
  
  return {
    top,
    height: Math.max(height, 20), 
    left: 0,
    width: 100,
  }
}

export const getEventColor = (color?: string): string => {
  // Default color palette for events
  const colors = [
    '#3b82f6', 
    '#ef4444', 
    '#10b981', 
    '#f59e0b', 
    '#8b5cf6', 
    '#ec4899', 
    '#06b6d4', 
    '#84cc16', 
  ]
  
  return color || colors[Math.floor(Math.random() * colors.length)]
}

export const getEventCategories = (): string[] => {
  return [
    'Meeting',
    'Personal',
    'Work',
    'Travel',
    'Health',
    'Education',
    'Social',
    'Other',
  ]
}
