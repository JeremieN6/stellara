/**
 * Converts a local civil date/time in a given IANA timezone to a UTC Date,
 * resolving DST by iterating the offset lookup against the candidate UTC instant.
 */
export function localDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const localAsUtcMillis = Date.UTC(year, month - 1, day, hour, minute, 0)
  let utcMillis = localAsUtcMillis

  for (let i = 0; i < 2; i++) {
    const offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcMillis), timeZone)
    utcMillis = localAsUtcMillis - offsetMinutes * 60_000
  }

  return new Date(utcMillis)
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value])) as Record<string, string>

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )

  return (asUtc - date.getTime()) / 60_000
}
