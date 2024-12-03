
export function formatTime(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':');
}

export function formatTimeToMinutesSecondsMilliseconds(sec: number) {
  const minutes = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0')
  const milliseconds = Math.floor((sec - Math.floor(sec)) * 100)
    .toString()
    .padStart(2, '0')

  return `${minutes}:${seconds}:${milliseconds}`
}

