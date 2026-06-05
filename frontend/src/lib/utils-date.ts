import { format, type Locale } from 'date-fns'

export function dateInputToISO(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00.000Z`
  return new Date(value).toISOString()
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function toDateInput(value: string | Date): string {
  const d = new Date(value)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatUTC(value: string | Date, fmt: string, options?: { locale?: Locale }): string {
  const d = new Date(value)
  const utcDate = new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds(),
    ),
  )
  return options?.locale ? format(utcDate, fmt, { locale: options.locale }) : format(utcDate, fmt)
}
