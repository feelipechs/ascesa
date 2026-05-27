import { format, parseISO } from 'date-fns'

export function dateInputToISO(value: string): string {
  const date = parseISO(value)
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
}

export function nowISO(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")
}

export function toDateInput(value: string | Date): string {
  return format(new Date(value), 'yyyy-MM-dd')
}
