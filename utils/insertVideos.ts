import { Video } from "@/types";
import extractYoutubeId from "./extractYoutubeId";

export default async function insertVideosGetTotalDuration(
  prisma: any,
  courseId: string,
  videos: Array<Video>
): Promise<number> {
  let totalDuration = 0;
  if (videos && videos.length > 0) {
    await prisma.video.createMany({
      data: videos.map((video: Video) => {
        const { title, duration } = video;
        const youtubeId = extractYoutubeId(video.youtubeId);
        totalDuration += duration;
        return {
          title,
          duration,
          youtubeId,
          courseId,
        };
      }),
    });
  }
  return totalDuration;
}
