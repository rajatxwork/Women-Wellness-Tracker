import { PlayCircle } from "lucide-react";
import { formVideoSearchUrl } from "@/lib/video-link";

export function VideoLink({ exerciseName }: { exerciseName: string }) {
  return (
    <a
      href={formVideoSearchUrl(exerciseName)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch form video for ${exerciseName}`}
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-plum transition-colors hover:bg-plum/15 hover:text-plum"
    >
      <PlayCircle size={20} strokeWidth={1.8} />
    </a>
  );
}
