// Cảnh "brush": phát video tranh màu nước vẽ bằng p5.brush (thư mục brush/, `node render.mjs --clip=a:b`),
// khớp theo thời gian bài. song.brush = [{ at: giây bắt đầu trong bài, src: "HB-001/brush/xxx.mp4" }, …]
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Song } from "../types";

export const BrushScene: React.FC<{ t: number; song: Song }> = ({ t, song }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clips = song.brush ?? [];
  let clip = clips[0];
  for (const c of clips) if (c.at <= t) clip = c;
  if (!clip) return <AbsoluteFill style={{ background: "#F3EBDC" }} />;
  // trimBefore không đổi qua các khung: (t − at)·fps − frame là hằng số trong một lần render
  const trimBefore = Math.max(0, Math.round((t - clip.at) * fps) - frame);
  return (
    <AbsoluteFill style={{ background: "#F3EBDC" }}>
      <OffthreadVideo muted src={staticFile(clip.src)} trimBefore={trimBefore} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
