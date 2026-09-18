export function formVideoSearchUrl(exerciseName: string): string {
  return `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(exerciseName)}+form+tutorial`;
}

export function stretchVideoSearchUrl(area: "upper" | "lower" | "full"): string {
  const phrase = area === "full" ? "full body" : `${area} body`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`dynamic warm up stretches for ${phrase}`)}`;
}
