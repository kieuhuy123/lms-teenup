import { format, parseISO } from 'date-fns'

export const formatDate = (
  dateString: string,
  formatString: string = 'dd/MM/yyyy'
): string => {
  try {
    return format(parseISO(dateString), formatString)
  } catch (error) {
    return dateString
  }
}

export const formatTime = (timeString: string): string => {
  return timeString
}

export const getDayOfWeekLabel = (day: string): string => {
  const days = {
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật'
  }
  return days[day as keyof typeof days] || day
}
