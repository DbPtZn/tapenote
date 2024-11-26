
export function formatTime(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const centiseconds = Math.floor((sec * 100) % 100); // Get first two digits of milliseconds
  return [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0'), centiseconds.toString().padStart(2, '0')].join(':');
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

export function formatTime2(sec: number): string {
  const seconds = Math.floor(sec % 60);
  const centiseconds = Math.floor((sec * 100) % 100); // Get first two digits of milliseconds
  return [seconds.toString().padStart(2, '0'), centiseconds.toString().padStart(2, '0')].join(':');
}
