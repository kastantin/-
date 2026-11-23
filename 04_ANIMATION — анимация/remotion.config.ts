import { Config } from '@remotion/cli/config';

// Формат студии: MP4 / H.264, качество близкое к исходнику
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setCrf(18);
// Стандартный формат цвета — совместим с YouTube Shorts, TikTok, Reels и плеерами
Config.setPixelFormat('yuv420p');
// bt709 даёт yuv420p с TV-диапазоном вместо yuvj420p от JPEG-кадров
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
