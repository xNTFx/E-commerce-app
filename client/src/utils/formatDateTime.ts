export default function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const formattedDate = date.toISOString().split('T')[0];
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return { date: formattedDate, time: formattedTime };
}
