import validateYouTubeUrl from "./validateYoutubeUrl";

export default function extractYoutubeId(input: string) {
  const IsYoutubeLink = validateYouTubeUrl(input);
  if (!IsYoutubeLink) {
    return input;
  }

  const url = new URL(input);
  const searchParams = new URLSearchParams(url.search);

  return searchParams.get("v") || "";
}
