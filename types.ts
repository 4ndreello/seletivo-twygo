export interface Video {
  title: string;
  youtubeId: string;
  duration: number;
}

export type Course = {
  title: string;
  description: string;
  dueDate: string;
  videos: Array<Video>;
  totalDuration: number;
};

export type YoutubeResponseTarget = {
  pauseVideo: () => void;
  getDuration: () => number;
  options: {
    title: string;
    videoId: string;
    width: string;
    height: number;
    borderRadius: string;
    playerVars: {
      autoplay: number;
    };
    mute: boolean;
    events: {};
    host: string;
  };
};
