import DatePicker from 'react-datepicker'
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'

type AppDatePickerProps = {
  name: string
  defaultValue?: string
  className?: string
  placeholder?: string
  required?: boolean
}

function parseDefaultDate(value?: string): Date | null {
  if (!value) {
    return null
  }

  const parsed = parseISO(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

export function AppDatePicker({ name, defaultValue, className, placeholder, required }: AppDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => parseDefaultDate(defaultValue))

  return (
    <div className="app-datepicker-field">
      <CalendarDays size={16} className="app-datepicker-icon" />
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        className={['app-date-input', className].filter(Boolean).join(' ')}
        calendarClassName="app-datepicker-calendar"
        popperClassName="app-datepicker-popper"
        wrapperClassName="app-datepicker-wrapper"
        placeholderText={placeholder}
        locale={vi}
        isClearable={!required}
        showPopperArrow={false}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={12}
      />
      <input type="hidden" name={name} value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} />
    </div>
  )
}
