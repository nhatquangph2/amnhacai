import type React from "react";
import type { Song, StyleId } from "../types";
import { Dark } from "./Dark";
import { Film } from "./Film";
import { Paper } from "./Paper";

export type StyleProps = {
  song: Song;
  t: number; // thời điểm trong bài (giây)
  duration: number; // độ dài bài (giây)
  vertical: boolean;
  fps: number;
};

// Thêm kiểu mới: tạo file trong styles/, đăng ký ở đây và trong StyleId (types.ts)
export const STYLES: Record<StyleId, React.FC<StyleProps>> = {
  paper: Paper,
  film: Film,
  dark: Dark,
};
