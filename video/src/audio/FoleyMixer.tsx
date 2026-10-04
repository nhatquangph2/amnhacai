import React from "react";
import { Audio, Loop, Sequence, staticFile, useVideoConfig } from "remotion";
import type { FoleyTrack, LyricLine, Song } from "../types";

/**
 * Tính hệ số Audio Ducking mượt mà (0.0 = đang hát / ducking sâu, 1.0 = không hát / âm lượng môi trường đầy đủ).
 * Sử dụng hàm smoothstep để đường cong giảm âm lượng tự nhiên như bàn tay sound engineer chuyên nghiệp gạt fader.
 */
export function getDuckingFactor(
  timeInSong: number,
  lines: LyricLine[],
  fadeDuration: number = 0.45
): number {
  if (!lines || lines.length === 0) return 1.0;

  let minFactor = 1.0;
  for (const line of lines) {
    const s = line.start;
    const e = line.end;

    // Nằm ngoài tầm ảnh hưởng của câu hát
    if (timeInSong < s - fadeDuration || timeInSong > e + fadeDuration) {
      continue;
    }

    // Đang trong lúc câu hát vang lên -> ducking tối đa
    if (timeInSong >= s && timeInSong <= e) {
      return 0.0;
    }

    // Fade down vào câu hát (trước khi ca sĩ cất lời)
    if (timeInSong >= s - fadeDuration && timeInSong < s) {
      const linear = (s - timeInSong) / fadeDuration; // 1 -> 0
      const smooth = linear * linear * (3 - 2 * linear);
      minFactor = Math.min(minFactor, smooth);
    }
    // Fade up sau khi dứt câu hát (âm thanh môi trường nổi dần lên)
    else if (timeInSong > e && timeInSong <= e + fadeDuration) {
      const linear = (timeInSong - e) / fadeDuration; // 0 -> 1
      const smooth = linear * linear * (3 - 2 * linear);
      minFactor = Math.min(minFactor, smooth);
    }
  }

  return Math.max(0.0, Math.min(1.0, minFactor));
}

// Thời lượng mặc định của các file foley tổng hợp (giây)
const FOLEY_LOOP_DURATIONS: Record<string, number> = {
  "foley/clock_tick.wav": 6.0,
  "foley/water_lap.wav": 8.0,
  "foley/wind_howl.wav": 8.0,
  "foley/rain_roof.wav": 8.0,
  "foley/page_turn.wav": 1.2,
  "foley/gentle_sigh.wav": 2.0,
};

const SingleFoleyTrack: React.FC<{
  track: FoleyTrack;
  lines: LyricLine[];
  songDuration: number;
  clipStart: number;
}> = ({ track, lines, songDuration, clipStart }) => {
  const { fps } = useVideoConfig();

  const startSec = track.start ?? 0;
  const endSec = Math.min(track.end ?? songDuration, songDuration);
  const trackDurSec = endSec - startSec;
  if (trackDurSec <= 0) return null;

  const startFrame = Math.round(startSec * fps);
  const durationInFrames = Math.round(trackDurSec * fps);

  const baseVol = track.baseVolume ?? 0.55;
  const duckVol = track.duckVolume ?? 0.12;
  const fade = track.duckFade ?? 0.45;

  const loopSec = FOLEY_LOOP_DURATIONS[track.src] ?? 8.0;
  const loopFrames = Math.max(1, Math.round(loopSec * fps));

  const volumeFunc = (frameInTrack: number) => {
    // Thời điểm tuyệt đối trong bài hát
    const t = startSec + frameInTrack / fps;
    const ducking = getDuckingFactor(t, lines, fade);
    // Khi ducking = 0 -> duckVol (12%), khi ducking = 1 -> baseVol (55%)
    return duckVol + (baseVol - duckVol) * ducking;
  };

  const audioEl = (
    <Audio
      src={staticFile(track.src)}
      volume={volumeFunc}
    />
  );

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      {track.loop ? (
        <Loop durationInFrames={loopFrames}>{audioEl}</Loop>
      ) : (
        audioEl
      )}
    </Sequence>
  );
};

export const FoleyMixer: React.FC<{
  song: Song;
  songDuration?: number;
  clipStart?: number;
}> = ({ song, songDuration = 240, clipStart = 0 }) => {
  const tracks = song.foley;
  if (!tracks || tracks.length === 0) return null;

  return (
    <>
      {tracks.map((track) => (
        <SingleFoleyTrack
          key={track.id}
          track={track}
          lines={song.lines}
          songDuration={songDuration}
          clipStart={clipStart}
        />
      ))}
    </>
  );
};
