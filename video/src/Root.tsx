import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { LyricVideo } from "./LyricVideo";
import type { LyricVideoProps, Song } from "./types";

const FPS = 30;
// Mỗi bài có thể đặt fps riêng (song.fps) — vd 24 cho hoạt hình vẽ trên 2s/3s (koma-uchi)
const fpsOf = (song: Song) => song.fps ?? FPS;

// Mọi file src/songs/*.json tự thành composition: "HB-002" (16:9) và "HB-002-short" (9:16)
const ctx = require.context("./songs", false, /\.json$/);
const songs: Song[] = ctx.keys().map((k) => ctx(k) as Song);

const fullLength: CalculateMetadataFunction<LyricVideoProps> = async ({ props }) => {
  const songDuration = await getAudioDurationInSeconds(staticFile(props.song.audio));
  // --from/--to: xuất một đoạn (vd video mẫu), mặc định cả bài
  const len = Math.min(props.clipEnd ?? songDuration, songDuration) - (props.clipStart ?? 0);
  const fps = fpsOf(props.song);
  return { durationInFrames: Math.ceil(len * fps), fps, props: { ...props, songDuration } };
};

const clipLength: CalculateMetadataFunction<LyricVideoProps> = async ({ props }) => {
  const songDuration = await getAudioDurationInSeconds(staticFile(props.song.audio));
  const start = props.clipStart ?? 0;
  const end = Math.min(props.clipEnd ?? start + 30, songDuration);
  const fps = fpsOf(props.song);
  return { durationInFrames: Math.ceil((end - start) * fps), fps, props: { ...props, songDuration } };
};

/** Mặc định Shorts = điệp khúc đầu tiên (tối đa 40s). Đổi bằng --props khi render. */
const firstChorus = (song: Song) => {
  const chorus = song.lines.filter((l) => /chorus|điệp khúc|hook/i.test(l.section ?? ""));
  if (!chorus.length) return { clipStart: song.lines[0]?.start ?? 0, clipEnd: (song.lines[0]?.start ?? 0) + 30 };
  const sec = chorus[0].section;
  const same = chorus.filter((l) => l.section === sec);
  const clipStart = Math.max(0, same[0].start - 1.5);
  return { clipStart, clipEnd: Math.min(same[same.length - 1].end + 1.5, clipStart + 40) };
};

export const Root: React.FC = () => (
  <>
    {songs.map((song) => (
      <React.Fragment key={song.id}>
        <Composition
          id={song.id}
          component={LyricVideo}
          width={1920}
          height={1080}
          fps={fpsOf(song)}
          durationInFrames={FPS * 10}
          defaultProps={{ song } as LyricVideoProps}
          calculateMetadata={fullLength}
        />
        <Composition
          id={`${song.id}-short`}
          component={LyricVideo}
          width={1080}
          height={1920}
          fps={fpsOf(song)}
          durationInFrames={FPS * 10}
          defaultProps={{ song, ...firstChorus(song) } as LyricVideoProps}
          calculateMetadata={clipLength}
        />
      </React.Fragment>
    ))}
  </>
);
