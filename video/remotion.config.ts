import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Nhạc là trọng tâm: giữ audio chất lượng cao khi xuất lên YouTube
Config.setAudioCodec("aac");
Config.setAudioBitrate("320k");
