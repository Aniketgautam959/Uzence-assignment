import {
  addDays,
  addMonths,
  differenceInDays,
  format,
  getDay,
  getDaysInMonth as getDaysInMonthFn,
  isSameDay as isSameDayFn,
  isSameMonth as isSameMonthFn,
  isToday as isTodayFn,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'

export const daysBetween = (start: Date, end: Date): number => {
  return differenceInDays(end, start)
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return isSameDayFn(date1, date2)
}

export const getDaysInMonth = (date: Date): number => {
  return getDaysInMonthFn(date)
}

export const getCalendarGrid = (date: Date): Date[] => {
  const firstDayOfMonth = startOfMonth(date)
  const startDate = subDays(firstDayOfMonth, getDay(firstDayOfMonth))
  
  const grid: Date[] = []
  let currentDate = startDate
  
  // Build 6 weeks worth of days (42 total)
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }
  
  return grid
}

export { addDays, format, getDay } from 'date-fns'

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm')
}

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const formatDateTime = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm')
}

export const getWeekDays = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy')
}

export const addMonthsToDate = (date: Date, months: number): Date => {
  return addMonths(date, months)
}

export const subMonthsFromDate = (date: Date, months: number): Date => {
  return subMonths(date, months)
}

export const isToday = (date: Date): boolean => {
  return isTodayFn(date)
}

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return isSameMonthFn(date1, date2)
}

export const getTimeSlots = (): Array<{ hour: number; minute: number }> => {
  const slots: Array<{ hour: number; minute: number }> = []
  
  for (let hour = 0; hour < 24; hour++) {
    slots.push({ hour, minute: 0 })
    slots.push({ hour, minute: 30 })
  }
  
  return slots
}

export const getSlotPosition = (hour: number, minute: number): number => {
  return hour * 2 + (minute === 30 ? 1 : 0)
}

export const getSlotTime = (position: number): { hour: number; minute: number } => {
  const hour = Math.floor(position / 2)
  const minute = position % 2 === 0 ? 0 : 30
  return { hour, minute }
}
