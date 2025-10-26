# Calendar Component

A React calendar component built with TypeScript and Tailwind CSS. This calendar supports both month and week views with full event management capabilities.

## 🚀 Live Demo

**Storybook**: [Deploy to your preferred hosting service](https://your-storybook-url.com)

## 📦 Getting Started

```bash
# Clone and install
git clone <repository-url>
cd calendar-component
npm install

# Start development
npm run dev

# View Storybook
npm run storybook

# Build for production
npm run build
```

## 🏗️ Project Structure

```
calendar-component/
├─ src/
│ ├─ components/
│ │ ├─ primitives/          # Basic UI components
│ │ │ ├─ Button.tsx
│ │ │ ├─ Modal.tsx
│ │ │ └─ Select.tsx
│ │ └─ Calendar/            # Calendar-specific components
│ │ ├─ CalendarView.tsx     # Main calendar wrapper
│ │ ├─ MonthView.tsx        # Month view implementation
│ │ ├─ WeekView.tsx         # Week view implementation
│ │ ├─ CalendarCell.tsx     # Individual calendar cell
│ │ ├─ EventModal.tsx       # Event creation/editing modal
│ │ └─ CalendarView.types.ts # TypeScript definitions
│ ├─ hooks/
│ │ ├─ useCalendar.ts       # Calendar state management
│ │ └─ useEventManager.ts   # Event CRUD operations
│ ├─ utils/
│ │ ├─ date.utils.ts        # Date helper functions
│ │ └─ event.utils.ts       # Event-related utilities
│ └─ styles/
│ └─ globals.css            # Global styles
├─ .storybook/              # Storybook configuration
└─ package.json
```

## ✨ Features

### Month View
- 42-cell grid (6×7) showing current and adjacent months
- Today highlighting
- Up to 3 events per day with "+N more" overflow
- Click empty day to add event
- Click event to edit

### Week View
- 7-day horizontal layout with time slots (00:00–23:00)
- 30-minute grid lines
- Event positioning by start time and duration
- Side-by-side overlap display
- Drag to create/move events

### Event Management
- Add, edit, and delete events
- Title (required, max 100 chars)
- Description (optional, max 500 chars)
- Start/End datetime with validation
- Color presets and categories
- Modal-based editing

### Navigation
- Previous/Next month buttons
- Today button
- Month/Year dropdowns
- View toggle (Month ↔ Week)
- Keyboard navigation support

### Accessibility
- ARIA roles and labels
- Keyboard navigation (Tab, Enter, Space, Esc, Arrows)
- Focus management
- Screen reader support
- High contrast support

## 🎨 Design System

### Colors
- **Primary**: Blue spectrum (#0ea5e9 to #0c4a6e)
- **Neutral**: Gray spectrum (#fafafa to #171717)
- **Events**: 8 predefined colors with random assignment

### Typography
- **Font**: Inter, system-ui, sans-serif
- **Spacing**: 4px base scale
- **Radius**: 0.75rem for rounded corners

## 📚 Storybook Stories

1. **Default** - Current month with sample events
2. **Empty State** - Clean calendar without events
3. **Week View** - Time slots with overlaps
4. **With Many Events** - 20+ events for performance testing
5. **Interactive Playground** - Full CRUD functionality
6. **Keyboard Accessibility** - Navigation demo

## 🛠️ Tech Stack

- **React 18** - Latest React with concurrent features
- **TypeScript 5** - Strict type checking
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3** - Utility-first styling
- **date-fns** - Date manipulation library
- **clsx** - Conditional className utility
- **zustand** - Lightweight state management
- **Storybook 7** - Component development environment

### Development Tools
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🎯 Usage

### Basic Setup
```tsx
import { CalendarView } from './components/Calendar/CalendarView'

const MyCalendar = () => {
  const handleEventAdd = (event) => {
    console.log('New event:', event)
  }

  const handleEventUpdate = (id, updates) => {
    console.log('Updated event:', id, updates)
  }

  const handleEventDelete = (id) => {
    console.log('Deleted event:', id)
  }

  return (
    <CalendarView
      events={[]}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="month"
    />
  )
}
```

### With Events
```tsx
const events = [
  {
    id: '1',
    title: 'Team Meeting',
    startDate: new Date(2024, 0, 15, 10, 0),
    endDate: new Date(2024, 0, 15, 11, 0),
    color: '#3b82f6',
    category: 'Work',
  },
]

<CalendarView
  events={events}
  onEventAdd={handleEventAdd}
  onEventUpdate={handleEventUpdate}
  onEventDelete={handleEventDelete}
/>
```

## 🧪 Testing

### Manual Testing
- [ ] Month view renders 42-cell grid correctly
- [ ] Today is highlighted distinctly
- [ ] Events show with "+N more" for overflow
- [ ] Week view shows time slots 00:00-23:00
- [ ] Events position correctly by time
- [ ] Overlaps display side-by-side
- [ ] Drag to create/move events works
- [ ] Modal opens/closes with proper focus management
- [ ] Keyboard navigation works end-to-end
- [ ] Responsive design adapts to screen sizes

### Accessibility Testing
- [ ] Screen reader announces calendar structure
- [ ] Keyboard navigation works without mouse
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards
- [ ] Modal traps focus correctly

## 🚀 Deployment

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Storybook build
npm run build-storybook

# Preview production build
npm run preview
```

### Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist` folder
- **Chromatic**: Deploy Storybook for design system
- **GitHub Pages**: Static hosting for documentation

## 📝 Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext ts,tsx --fix"
}
```

## 🤝 Contributing

### Git Workflow
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- Create feature branches from `main`
- Submit pull requests with clear descriptions
- Ensure all tests pass and linting is clean

### Code Standards
- TypeScript strict mode enabled
- No `any` types allowed
- Prefer interfaces over types
- Use discriminated unions where appropriate
- Follow React best practices and hooks rules

## 📞 Contact

**Developer**: Frontend Engineer
**Email**: [your-email@example.com]
**GitHub**: [your-github-username]

## ⚠️ Known Limitations

1. **Drag Performance**: Large numbers of events (>1000) may impact drag performance
2. **Mobile Gestures**: Swipe navigation not yet implemented
3. **Time Zones**: Currently uses local timezone only
4. **Recurring Events**: Not supported in current version
5. **Event Conflicts**: No automatic conflict resolution

## 🎁 Future Enhancements

- **Local Storage**: Optional persistence of events
- **Export/Import**: JSON export/import functionality
- **Dark Mode**: Theme switching capability
- **Custom Colors**: User-defined event colors
- **Event Templates**: Predefined event types
- **Keyboard Shortcuts**: Power user shortcuts
- **Event Search**: Filter events by title/category
- **Print Support**: Calendar printing styles

## 📄 License

MIT License - see LICENSE file for details.
