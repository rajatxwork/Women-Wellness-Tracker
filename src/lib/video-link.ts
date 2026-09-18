export function formVideoSearchUrl(exerciseName: string): string {
  return `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(exerciseName)}+form+tutorial`;
}
