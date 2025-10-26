export interface CalendarEvent {
  id: string
  title: string
  description?: string | undefined
  startDate: Date
  endDate: Date
  color?: string | undefined
  category?: string | undefined
}

export interface CalendarViewProps {
  events: CalendarEvent[]
  onEventAdd: (event: CalendarEvent) => void
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void
  onEventDelete: (id: string) => void
  initialView?: 'month' | 'week'
  initialDate?: Date
}

export interface CalendarCell {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface TimeSlot {
  hour: number
  minute: number
  events: CalendarEvent[]
}

export interface DragState {
  isDragging: boolean
  startSlot?: { hour: number; minute: number } | undefined
  currentSlot?: { hour: number; minute: number } | undefined
  eventId?: string | undefined
}

export type CalendarView = 'month' | 'week'

export interface CalendarState {
  currentDate: Date
  view: CalendarView
  selectedDate: Date | null
}
