import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrandFonts } from "./common";
import { STYLES } from "./styles";
import { FoleyMixer } from "./audio/FoleyMixer";
import type { LyricVideoProps } from "./types";

export const LyricVideo: React.FC<LyricVideoProps> = ({ song, clipStart = 0, songDuration }) => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const Style = STYLES[song.style];
  const t = clipStart + frame / fps;
  // Với Shorts, "duration" là cả bài để Ken Burns/thẻ tên tính theo bài gốc
  const duration = songDuration ?? durationInFrames / fps;

  return (
    <AbsoluteFill>
      <Style song={song} t={t} duration={duration} vertical={height > width} fps={fps} />
      <Audio src={staticFile(song.audio)} trimBefore={Math.round(clipStart * fps)} />
      <FoleyMixer song={song} songDuration={duration} clipStart={clipStart} />
    </AbsoluteFill>
  );
};
