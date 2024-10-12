export default function validateYouTubeUrl(url: string): boolean {
  const regex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  try {
    new URL(url);
    if (!url.match(regex)) {
      throw undefined;
    }
  } catch (_) {
    return false;
  }

  return true;
}
