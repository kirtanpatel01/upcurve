export function calculateStreaks(logDates: Date[]) {
  if (logDates.length === 0) return { current: 0, longest: 0 }

  // Normalize and sort by date ascending
  const days = logDates
    .map(date => new Date(date.toDateString())) // remove time part
    .sort((a, b) => a.getTime() - b.getTime())

  let currentStreak = 1
  let longestStreak = 1

  for (let i = 1; i < days.length; i++) {
    const prev = days[i - 1]
    const curr = days[i]

    const diffInDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)

    if (diffInDays === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else if (diffInDays > 1) {
      currentStreak = 1
    }
  }

  // Check if the last date is today or yesterday
  const today = new Date()
  const last = days[days.length - 1]
  const diffToToday = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)

  const isStreakActive = diffToToday <= 1
  return {
    current: isStreakActive ? currentStreak : 0,
    longest: longestStreak
  }
}
