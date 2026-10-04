/**
 * 🎨 THƯ VIỆN PRESET COLOR SCRIPT & ÁNH SÁNG CẢM XÚC — SENORE COLOR PRESETS
 * Xây dựng theo phương pháp luận Ralph Eggleston (Pixar Animation Studios).
 */

export type ColorPreset = {
  id: string;
  nameVi: string;
  nameEn: string;
  mood: string;
  kelvin: number;
  contrastRatio: "low_flat" | "medium_soft" | "high_dramatic" | "extreme_strobe";
  palette: [string, string, string, string]; // 4 mã màu chuẩn Color Script
  description: string;
};

export const COLOR_PRESETS: Record<string, ColorPreset> = {
  // 1. SƯƠNG SỚM CÔ ĐƠN (PHỐ THỊ BẾ TẮC)
  MIST_SOLITUDE: {
    id: "MIST_SOLITUDE",
    nameVi: "Sương Sớm Cô Đơn",
    nameEn: "Mist & Solitude",
    mood: "Trĩu nặng, lạc lõng, mỏi mệt",
    kelvin: 6500,
    contrastRatio: "low_flat",
    palette: ["#B8C5D0", "#4A5866", "#212930", "#6B8294"],
    description: "Tông xám xanh lạnh, sương mù khuếch tán làm mờ đường chân trời, khử bão hòa",
  },

  // 2. THUNG LŨNG DIỆU KỲ (THỨC TỈNH TRẺ THƠ)
  GOLDEN_WONDER: {
    id: "GOLDEN_WONDER",
    nameVi: "Thung Lũng Diệu Kỳ",
    nameEn: "Golden Wonder & Awakening",
    mood: "Bừng sáng, hồn nhiên, ngạc nhiên, tự do",
    kelvin: 3500,
    contrastRatio: "medium_soft",
    palette: ["#48CAE4", "#FFD166", "#06D6A0", "#0096C7"],
    description: "Vàng mật ong kết hợp ngọc bích và xanh bầu trời, ánh sáng xiên rực rỡ",
  },

  // 3. HỒ KÝ ỨC TĨNH LẶNG (ĐỐI DIỆN TỔN THƯƠNG)
  DEEP_MEMORY: {
    id: "DEEP_MEMORY",
    nameVi: "Hồ Ký Ức Tĩnh Lặng",
    nameEn: "Abyssal Memory & Introspection",
    mood: "Lắng đọng, xót xa, buông bỏ, thanh tẩy",
    kelvin: 2400,
    contrastRatio: "high_dramatic",
    palette: ["#0B132B", "#06D6A0", "#1C2541", "#FAF6EE"],
    description: "Đen tuyền thăm thẳm điểm xuyết ánh sáng xanh ngọc bích phát quang",
  },

  // 4. BÃO GIÔNG KIÊN CƯỜNG (THÁC LŨ THỬ THÁCH)
  STORM_RESOLVE: {
    id: "STORM_RESOLVE",
    nameVi: "Bão Giông & Thử Thách",
    nameEn: "Storm & Indomitable Resolve",
    mood: "Căng thẳng, hiểm nguy, kiên cường, đối đầu",
    kelvin: 8000,
    contrastRatio: "extreme_strobe",
    palette: ["#1D2D44", "#0D1B2A", "#7077A1", "#00F5D4"],
    description: "Xanh chàm bão tố, đen kịt vực thẳm và chớp xanh neon giật cục",
  },

  // 5. BẾP LỬA QUÊ NHÀ (BÌNH AN NGUYÊN SƠ)
  HEARTH_WARMTH: {
    id: "HEARTH_WARMTH",
    nameVi: "Bếp Lửa Quê Nhà",
    nameEn: "Hearth Warmth & Rustic Peace",
    mood: "Ấm cúng, chở che, giản dị, thương yêu",
    kelvin: 2200,
    contrastRatio: "medium_soft",
    palette: ["#FAF0CA", "#DDA15E", "#BC6C25", "#7A5C43"],
    description: "Vàng rơm, nâu đất ấm, ánh lửa bập bùng và khói bếp lan tỏa",
  },

  // 6. HOÀNG HÔN GIẢI THOÁT (HÒA GIẢI & BƯỚC TIẾP)
  SUNSET_LIBERATION: {
    id: "SUNSET_LIBERATION",
    nameVi: "Hoàng Hôn Tái Sinh",
    nameEn: "Sunset & Radiant Liberation",
    mood: "Thanh thản, tự tin, viên mãn, bất diệt",
    kelvin: 2800,
    contrastRatio: "medium_soft",
    palette: ["#D9622B", "#9D4EDD", "#F4A261", "#FFE5B4"],
    description: "Cam đất nung Senore Ember, tím hoàng hôn và vàng mơ trải dài chân trời",
  },
};
