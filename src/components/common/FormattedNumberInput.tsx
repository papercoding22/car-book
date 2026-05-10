import { useState } from 'react'

type FormattedNumberInputProps = {
  name: string
  defaultValue?: number | string
  className?: string
  placeholder?: string
  required?: boolean
  min?: number
}

const formatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
})

function toDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function normalizeDefaultValue(value?: number | string): string {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  return toDigits(String(value))
}

export function FormattedNumberInput({
  name,
  defaultValue,
  className,
  placeholder,
  required,
  min,
}: FormattedNumberInputProps) {
  const [rawValue, setRawValue] = useState(() => normalizeDefaultValue(defaultValue))

  const displayValue = rawValue ? formatter.format(Number(rawValue)) : ''

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(event) => {
          const nextValue = toDigits(event.target.value)
          if (min !== undefined && nextValue !== '' && Number(nextValue) < min) {
            setRawValue(String(min))
            return
          }
          setRawValue(nextValue)
        }}
        className={className}
        placeholder={placeholder}
        required={required}
      />
      <input type="hidden" name={name} value={rawValue} />
    </>
  )
}
