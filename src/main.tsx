import React from 'react'
import ReactDOM from 'react-dom/client'
import { CalendarView } from './components/Calendar/CalendarView'
import { CalendarEvent } from './components/Calendar/CalendarView.types'
import './styles/globals.css'

// Some demo events to show how the calendar works
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(2024, 0, 15, 10, 0),
    endDate: new Date(2024, 0, 15, 11, 0),
    color: '#3b82f6',
    category: 'Work',
  },
  {
    id: '2',
    title: 'Doctor Visit',
    description: 'Annual checkup',
    startDate: new Date(2024, 0, 16, 14, 30),
    endDate: new Date(2024, 0, 16, 15, 30),
    color: '#10b981',
    category: 'Health',
  },
  {
    id: '3',
    title: 'Project Review',
    description: 'Review Q1 deliverables',
    startDate: new Date(2024, 0, 20, 17, 0),
    endDate: new Date(2024, 0, 20, 18, 0),
    color: '#ef4444',
    category: 'Work',
  },
]

const handleEventAdd = (event: CalendarEvent) => {
  console.log('Adding new event:', event)
}

const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
  console.log('Updating event:', id, updates)
}

const handleEventDelete = (id: string) => {
  console.log('Deleting event:', id)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CalendarView
          events={sampleEvents}
          onEventAdd={handleEventAdd}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          initialView="month"
        />
      </div>
    </div>
  </React.StrictMode>,
)
