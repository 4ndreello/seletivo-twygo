import { YoutubeResponseTarget } from "@/types";
import React from "react";
import YouTube from "react-youtube";

interface YoutubePlayerProps {
  onReady?: (data: YoutubeResponseTarget) => void;
  onStateChange?: (data: YoutubeResponseTarget) => void;
  url: string;
  mute?: boolean;
}

export default function YoutubePlayer(Props: YoutubePlayerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoReady = (event: any) => {
    if (event.target) {
      event.target.pauseVideo();
    }

    if (Props.onReady) {
      Props.onReady(event.target as YoutubeResponseTarget);
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            maxWidth: "800px",
            margin: "auto",
            marginTop: "12px",
            minHeight: "30vh",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <YouTube
            videoId={Props.url}
            opts={{
              width: "100%",
              borderRadius: "2rem",
              playerVars: { autoplay: 1, mute: Props.mute ? 1 : 0 },
            }}
            onReady={videoReady}
            {...(Props.onStateChange && {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onStateChange: (event: any) => {
                if (Props.onStateChange) {
                  Props.onStateChange(event.target as YoutubeResponseTarget);
                }
              },
            })}
          />
        </div>
      </div>
    </>
  );
}
