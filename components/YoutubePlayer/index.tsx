import React from "react";
import YouTube from "react-youtube";

interface YoutubePlayerProps {
  url: string;
}

export default function YoutubePlayer(Props: YoutubePlayerProps) {
  const videoReady = (event: any) => {
    event.target.pauseVideo();
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
              playerVars: { autoplay: 1 },
            }}
            onReady={videoReady}
          />
        </div>
      </div>
    </>
  );
}
