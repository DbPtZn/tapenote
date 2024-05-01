/** 将音频时长（duration）转化成 HH:MM:SS 格式 */
export function durationFormat(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${hours ? formattedHours + ':' : ''}${formattedMinutes}:${formattedSeconds}`;
}