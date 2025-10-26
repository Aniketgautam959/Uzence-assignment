import React, { useState, useEffect } from 'react'
import { CalendarEvent } from './CalendarView.types'
import { Modal } from '../primitives/Modal'
import { Button } from '../primitives/Button'
import { Select } from '../primitives/Select'
import { getEventCategories, getEventColor } from '../../utils/event.utils'
import { formatDateTime } from '../../utils/date.utils'

export interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent | null
  onSave: (event: CalendarEvent) => void
  onDelete?: (eventId: string) => void
  initialDate?: Date | undefined
}

const colorOptions = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#ef4444', label: 'Red' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Yellow' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Lime' },
]

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
  initialDate,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    color: colorOptions[0].value,
    category: '',
  })
  const [errors, setErrors] = useState<string[]>([])

  const categories = getEventCategories().map(cat => ({ value: cat, label: cat }))

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: formatDateTime(event.startDate),
        endDate: formatDateTime(event.endDate),
        color: event.color || colorOptions[0].value,
        category: event.category || '',
      })
    } else if (initialDate) {
      const startDate = new Date(initialDate)
      const endDate = new Date(initialDate)
      endDate.setHours(startDate.getHours() + 1)
      
      setFormData({
        title: '',
        description: '',
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        color: getEventColor(),
        category: '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        color: colorOptions[0].value,
        category: '',
      })
    }
    setErrors([])
  }, [event, initialDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors: string[] = []
    
    if (!formData.title.trim()) {
      validationErrors.push('Title is required')
    }
    
    if (formData.title.length > 100) {
      validationErrors.push('Title must be 100 characters or less')
    }
    
    if (formData.description.length > 500) {
      validationErrors.push('Description must be 500 characters or less')
    }
    
    if (!formData.startDate) {
      validationErrors.push('Start date is required')
    }
    
    if (!formData.endDate) {
      validationErrors.push('End date is required')
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      
      if (start >= end) {
        validationErrors.push('End date must be after start date')
      }
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    const eventData: CalendarEvent = {
      id: event?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      color: formData.color,
      category: formData.category || undefined,
    }
    
    onSave(eventData)
    onClose()
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Add Event'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <ul className="text-sm text-red-600 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Event title"
            maxLength={100}
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Event description"
            rows={3}
            maxLength={500}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date *
            </label>
            <input
              id="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-1">
              End Date *
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-1">
              Color
            </label>
            <Select
              options={colorOptions}
              value={formData.color}
              onChange={(value) => handleInputChange('color', value)}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <Select
              options={categories}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              placeholder="Select category"
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <div>
            {event && onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
