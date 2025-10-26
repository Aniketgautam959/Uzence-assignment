import type { Meta, StoryObj } from '@storybook/react'
import { CalendarView } from './CalendarView'
import { CalendarEvent } from './CalendarView.types'

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    initialView: {
      control: { type: 'select' },
      options: ['month', 'week'],
    },
    initialDate: {
      control: { type: 'date' },
    },
  },
}

export default meta
type Story = StoryObj<typeof CalendarView>

// Sample events for stories
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
  {
    id: '4',
    title: 'Client Lunch',
    description: 'Discuss project requirements',
    startDate: new Date(2024, 0, 18, 12, 0),
    endDate: new Date(2024, 0, 18, 13, 30),
    color: '#f59e0b',
    category: 'Work',
  },
  {
    id: '5',
    title: 'Gym Session',
    description: 'Personal training',
    startDate: new Date(2024, 0, 19, 18, 0),
    endDate: new Date(2024, 0, 19, 19, 0),
    color: '#8b5cf6',
    category: 'Personal',
  },
]

const manyEvents: CalendarEvent[] = Array.from({ length: 25 }, (_, i) => ({
  id: `event-${i}`,
  title: `Event ${i + 1}`,
  description: `Description for event ${i + 1}`,
  startDate: new Date(2024, 0, 15 + Math.floor(i / 5), 9 + (i % 8), (i % 2) * 30),
  endDate: new Date(2024, 0, 15 + Math.floor(i / 5), 10 + (i % 8), (i % 2) * 30),
  color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'][i % 8],
  category: ['Work', 'Personal', 'Health', 'Travel', 'Education', 'Social'][i % 6],
}))

const handleEventAdd = (event: CalendarEvent) => {
  console.log('Adding new event:', event)
}

const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
  console.log('Updating event:', id, updates)
}

const handleEventDelete = (id: string) => {
  console.log('Deleting event:', id)
}

export const Default: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
}

export const EmptyState: Story = {
  args: {
    events: [],
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
}

export const WeekView: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'week',
    initialDate: new Date(2024, 0, 15),
  },
}

export const WithManyEvents: Story = {
  args: {
    events: manyEvents,
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
}

export const InteractivePlayground: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Try adding, editing, and deleting events. This shows the full CRUD functionality.',
      },
    },
  },
}

export const KeyboardAccessibility: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation: Tab/Shift+Tab to navigate, Enter/Space to activate, Arrow keys to move focus, Esc to close modals.',
      },
    },
  },
}
