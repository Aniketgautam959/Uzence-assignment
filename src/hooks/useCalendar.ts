import { useState, useCallback } from 'react'
import { addMonths, subMonths, startOfMonth } from 'date-fns'
import { CalendarState, CalendarView } from '../components/Calendar/CalendarView.types'

export const useCalendar = (initialDate?: Date, initialView?: CalendarView) => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate || new Date(),
    view: initialView || 'month',
    selectedDate: null,
  })

  const goToNextMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: addMonths(prev.currentDate, 1),
    }))
  }, [])

  const goToPreviousMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: subMonths(prev.currentDate, 1),
    }))
  }, [])

  const goToToday = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(),
      selectedDate: new Date(),
    }))
  }, [])

  const setView = useCallback((view: CalendarView) => {
    setState(prev => ({
      ...prev,
      view,
    }))
  }, [])

  const setSelectedDate = useCallback((date: Date | null) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
    }))
  }, [])

  const setCurrentDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      currentDate: date,
    }))
  }, [])

  const goToDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      currentDate: startOfMonth(date),
      selectedDate: date,
    }))
  }, [])

  return {
    ...state,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    setView,
    setSelectedDate,
    setCurrentDate,
    goToDate,
  }
}
