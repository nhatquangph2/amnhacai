/**
 * 🏞️ THƯ VIỆN 15 BỐI CẢNH & KHÔNG GIAN ĐIỆN ẢNH ĐA TẦNG — SENORE CINEMATIC ENVIRONMENTS
 * Phân chia theo 5 Vùng Địa Lý Tâm Hồn: Sông Nước, Làng Quê, Vùng Cao, Đô Thị, Siêu Thực.
 * Tích hợp kiến trúc thị sai 3 lớp (Parallax Layers) và thông số ống kính (Focal Length).
 */

export type EnvironmentZone = "aquatic" | "rural" | "highlands" | "urban" | "surreal";

export type ParallaxLayers = {
  foreground: string; // Chi tiết cận cảnh (lau sậy, giọt mưa, cành cây tiền cảnh)
  midground: string; // Chủ thể và sân khấu chính (con thuyền, nhân vật, cây cầu)
  background: string; // Núi non xa, dãy nhà cổ, rừng thông
  skybox: string; // Bầu trời, mây bão, ánh hoàng hôn, trăng sao
};

export type EnvironmentSetting = {
  id: string;
  nameVi: string;
  nameEn: string;
  zone: EnvironmentZone;
  series: ("dung-day" | "doi-nguoi" | "y-nghia" | "nghe-thuat")[];
  metaphor: string; // Tầng nghĩa ẩn dụ
  focalLength: string; // Tiêu cự ống kính khuyên dùng
  parallax: ParallaxLayers;
  palette: [string, string, string, string]; // 4 mã màu Color Script
  lighting: {
    kelvin: number;
    type: "diffuse" | "direct_golden" | "bioluminescence" | "strobe_lightning" | "candle_hearth" | "mist_twilight";
    quality: string;
  };
  cameraPresets: string[];
  sfxAmbience: string[]; // Gợi ý tiếng động môi trường Foley
  promptTemplate: string; // Prompt nạp cho Midjourney / ComfyUI
};

export const ENVIRONMENT_SETTINGS: Record<string, EnvironmentSetting> = {
  // =========================================================================
  // VÙNG 1: SÔNG NƯỚC & BẾN BÃI (AQUATIC & ESTUARY)
  // =========================================================================

  stonePier: {
    id: "stonePier",
    nameVi: "Bến Sông & Cầu Đá Cổ",
    nameEn: "Ancient Stone Pier & Quiet River",
    zone: "aquatic",
    series: ["doi-nguoi", "dung-day"],
    metaphor: "Nơi dừng chân, đối diện dòng đời, điểm hẹn và chia tay của mọi cuộc hội ngộ",
    focalLength: "35mm Narrative",
    parallax: {
      foreground: "Rặng lau sậy đung đưa sát ống kính, dây thừng neo thuyền buộc cọc gỗ",
      midground: "Cầu đá cong vòm phủ rêu phong, bậc thềm đá dẫn xuống mép nước, con thuyền gỗ",
      background: "Bờ sông bên kia mờ ảo trong khói lam chiều, hàng tre nghiêng bóng",
      skybox: "Bầu trời bình minh ửng hồng qua màn sương sông mỏng manh",
    },
    palette: ["#8EA8C3", "#4A5866", "#7A5C43", "#FAF6EE"],
    lighting: {
      kelvin: 5000,
      type: "diffuse",
      quality: "Ánh sáng ban mai khuếch tán qua sương, phản chiếu lấp lánh nhẹ trên bậc đá ướt",
    },
    cameraPresets: [
      "Low-angle nhìn xuống bước chân dừng lại bên lan can đá",
      "High-angle Smooth Pan từ thành cầu xuống mũi thuyền mộc",
      "Wide Two-Shot bao quát người trên bờ vẫy chào người dưới thuyền",
    ],
    sfxAmbience: [
      "Tiếng sóng vỗ mạn thuyền gỗ bì bõm",
      "Tiếng bước chân gõ trên mặt cầu đá rêu",
      "Tiếng gió sông sớm xào xạc qua rặng lau sậy",
    ],
    promptTemplate:
      "ancient Vietnamese stone bridge arching over tranquil misty river, mossy stone pier, wooden steps, delicate reed grass, papercraft gouache texture, soft morning fog, 16:9 widescreen",
  },

  ferryCrossing: {
    id: "ferryCrossing",
    nameVi: "Bến Đò Ngang Chiều Mưa",
    nameEn: "The Rainstorm Ferry Crossing",
    zone: "aquatic",
    series: ["doi-nguoi", "y-nghia"],
    metaphor: "Khoảnh khắc chờ đợi trong kiên nhẫn, sự chuyển giao giữa hai bờ số phận",
    focalLength: "50mm Human Eye",
    parallax: {
      foreground: "Tấm bạt che mưa rách mép nhỏ từng giọt nước xuống vũng sình",
      midground: "Con đò ngang tròng trành chở khách mặc áo tơi, người lái đò cắm sào",
      background: "Rặng bần ven sông nhạt nhòa trong mưa trắng xóa",
      skybox: "Mây xám chì trĩu nặng bao trùm không gian",
    },
    palette: ["#506169", "#2B3A42", "#8E9CA3", "#FAF0CA"],
    lighting: {
      kelvin: 6000,
      type: "mist_twilight",
      quality: "Ánh sáng xám bạc mờ mịt của cơn mưa rào, điểm xuyết ánh đèn bão vàng leo lét trên mũi đò",
    },
    cameraPresets: [
      "Tracking ngang song song với thân đò đang rẽ sóng",
      "Over-the-shoulder nhìn qua vai người khách sang bờ bên kia mờ mịt",
      "Static Close-Up đầu mũi sào cắm ngập vào lòng bùn",
    ],
    sfxAmbience: [
      "Tiếng mưa xối xả đập rào rào trên mặt sông",
      "Tiếng máy đò nổ lạch tạch hoặc tiếng sào tre ken két",
      "Tiếng còi đò ngân dài trầm đục",
    ],
    promptTemplate:
      "nostalgic Vietnamese river ferry crossing in heavy monsoon rain, weathered wooden boat with raincoat passengers, rustic bamboo poles, slate blue rainy ripples, melancholic cinematic atmosphere",
  },

  mangroveReeds: {
    id: "mangroveReeds",
    nameVi: "Rặng Lau Sậy & Cửa Biển Hoàng Hôn",
    nameEn: "Golden Reeds & Estuary Sunset",
    zone: "aquatic",
    series: ["y-nghia", "nghe-thuat"],
    metaphor: "Sự uốn mình mềm mại trước gió lớn, vẻ đẹp bao la nơi sông hòa vào biển cả",
    focalLength: "85mm Compression",
    parallax: {
      foreground: "Bông lau trắng muốt xóa phông mịn màng bay lòa xòa qua mép khung hình",
      midground: "Con thuyền buồm đơn độc giương buồm trắng rẽ qua luồng lạch",
      background: "Rừng đước ngập mặn trải dài tít tắp, đàn hải âu chao lượn",
      skybox: "Vầng thái dương tròn đỏ rực chìm dần vào đường chân trời biển tím ngát",
    },
    palette: ["#D9622B", "#F4A261", "#9D4EDD", "#2EC4B6"],
    lighting: {
      kelvin: 2800,
      type: "direct_golden",
      quality: "Ánh nắng vàng cam ngược sáng (Backlit) dát vàng lên từng sợi bông lau và mạn thuyền",
    },
    cameraPresets: [
      "Rack focus từ bông lau tiền cảnh sang cánh buồm xa xa",
      "Slow lateral pan bắt trọn vầng thái dương lặn",
      "Extreme Long Shot chiếc thuyền nhỏ bé lướt trên mặt biển vàng óng",
    ],
    sfxAmbience: [
      "Tiếng bông lau xào xạc trong gió biển chiều",
      "Tiếng đàn chim biển ríu rít gọi bầy về tổ",
      "Tiếng sóng biển rì rào từ cửa sông xa xa",
    ],
    promptTemplate:
      "vast Vietnamese coastal estuary with swaying golden reeds, solitary sailboat silhouette against enormous burning orange sun, lavender twilight sky, rim lighting, papercut anime gouache art",
  },

  // =========================================================================
  // VÙNG 2: ĐỒNG BẰNG & LÀNG QUÊ CỘI NGUỒN (RURAL & HEARTHLANDS)
  // =========================================================================

  grassyDyke: {
    id: "grassyDyke",
    nameVi: "Bờ Đê Lộng Gió & Cánh Đồng Lúa",
    nameEn: "The Wind-Swept Dyke & Golden Rice Fields",
    zone: "rural",
    series: ["doi-nguoi", "dung-day"],
    metaphor: "Quê hương thanh bình, tầm nhìn khoáng đạt, nơi nâng cánh những ước mơ tuổi nhỏ",
    focalLength: "24mm Ultra-Wide",
    parallax: {
      foreground: "Vạt cỏ may và hoa xuyến chi rung rinh theo chiều gió",
      midground: "Con đường đất đỏ trên đỉnh đê, bóng người đạp xe hoặc chú bé cưỡi trâu",
      background: "Biển lúa vàng óng ả dập dềnh như sóng lượn, lũy tre làng xanh ngắt",
      skybox: "Trời xanh ngắt bao la với những đám mây trắng xốp trôi lững lờ",
    },
    palette: ["#E9C46A", "#6B7A4B", "#7A5C43", "#48CAE4"],
    lighting: {
      kelvin: 4500,
      type: "direct_golden",
      quality: "Nắng hè rực rỡ, gió lộng làm sáng bừng từng ngọn lúa uốn câu",
    },
    cameraPresets: [
      "Ultra-wide tracking bám theo bánh xe đạp lăn trên đỉnh đê",
      "Low-angle ngắm diều giấy bay vút lên trời xanh",
      "Slow pan 180 độ bao quát thảm lúa vàng trải dài vô tận",
    ],
    sfxAmbience: [
      "Tiếng gió lùa qua cánh đồng lúa rì rào như tiếng sóng",
      "Tiếng ve sầu kêu râm ran từ rặng tre xa",
      "Tiếng sáo diều vi vu ngân nga trên tầng không",
    ],
    promptTemplate:
      "expansive Vietnamese rural grass dyke overlooking endless golden rice paddies, winding dirt path, lush bamboo groves, soaring paper kite in blue sky, radiant sunshine, makoto shinkai style",
  },

  riversideHearth: {
    id: "riversideHearth",
    nameVi: "Ngôi Làng Ven Suối & Bếp Lửa Quê",
    nameEn: "Riverside Village & Evening Hearth",
    zone: "rural",
    series: ["doi-nguoi", "y-nghia"],
    metaphor: "Sự bình dị nguyên sơ, hạnh phúc giản đơn của mái ấm mà con người mải miết đi xa mới nhận ra",
    focalLength: "50mm Human Eye",
    parallax: {
      foreground: "Giàn mướp hoa vàng rủ xuống hiên nhà, chõng tre mộc mạc",
      midground: "Bàn ăn gỗ bên hiên với hai bát cơm bốc khói, khói bếp tỏa lên mái rạ",
      background: "Dòng suối trong vắt uốn lượn sau vườn, rặng cau thẳng tắp",
      skybox: "Bầu trời chiều chuyển từ vàng mơ sang tím sẫm thanh bình",
    },
    palette: ["#FAF0CA", "#DDA15E", "#BC6C25", "#7A5C43"],
    lighting: {
      kelvin: 2200,
      type: "candle_hearth",
      quality: "Ánh lửa bập bùng hắt ra từ gian bếp, khói lam chiều bảng lảng ấm cúng",
    },
    cameraPresets: [
      "Medium Close-Up bàn ăn gỗ với hai bát cơm nóng hổi",
      "Warm wide pan qua mái nhà tranh và luống cải trổ hoa",
      "Static frame tĩnh lặng nhìn khói bếp bay lên trời chiều",
    ],
    sfxAmbience: [
      "Tiếng suối reo róc rách thanh bình",
      "Tiếng củi khô nổ lách tách trong bếp",
      "Tiếng trẻ con gọi nhau về ăn cơm từ đầu ngõ",
    ],
    promptTemplate:
      "cozy Vietnamese countryside wooden cottage at dusk, thatch roof with blue kitchen smoke curling up, warm lantern light through window, steaming rice bowls on porch table, nostalgic tranquility",
  },

  villageCourtyard: {
    id: "villageCourtyard",
    nameVi: "Sân Đình Cây Đa Giếng Nước",
    nameEn: "Ancient Village Courtyard & Banyan Tree",
    zone: "rural",
    series: ["doi-nguoi"],
    metaphor: "Ký ức cội nguồn, nếp sống cộng đồng, nơi tụ hội của bao thế hệ",
    focalLength: "35mm Narrative",
    parallax: {
      foreground: "Thành giếng đá ong rêu phong, gàu sòng múc nước bằng tre",
      midground: "Gốc đa cổ thụ nghìn năm rễ buông chằng chịt, sân đình lát gạch Bát Tràng",
      background: "Mái đình cong vút chạm rồng phượng, cổng làng cổ kính",
      skybox: "Ánh trăng rằm vằng vặc rọi qua kẽ lá đa tạo đốm sáng lung linh trên sân",
    },
    palette: ["#5C4A3A", "#3A3A3C", "#6B7A4B", "#EFE8DC"],
    lighting: {
      kelvin: 4000,
      type: "diffuse",
      quality: "Ánh trăng thanh khiết kết hợp bóng đổ đan xen huyền hoặc của tán đa già",
    },
    cameraPresets: [
      "Tilt-up từ giếng nước sâu lên vòm lá đa sừng sững",
      "Slow dolly qua hàng cột gỗ lim đình làng",
      "Master shot nhìn các cụ già ngồi đàm đạo bên ấm chè xanh",
    ],
    sfxAmbience: [
      "Tiếng nước dội mát lạnh từ gàu sòng giếng khơi",
      "Tiếng dế mèn rỉ rả dưới chân bờ tường đá ong",
      "Tiếng lá đa khô rụng khẽ khàng trên sân gạch",
    ],
    promptTemplate:
      "ancient Vietnamese communal courtyard paved with terracotta bricks, colossal sacred banyan tree with hanging aerial roots, mossy stone well, curved temple roof, moonlight filtering through foliage",
  },

  // =========================================================================
  // VÙNG 3: VÙNG CAO, ĐỒI NÚI & BÃO TỐ (HIGHLANDS & STORM THRESHOLDS)
  // =========================================================================

  solitaryHill: {
    id: "solitaryHill",
    nameVi: "Đồi Gió Đơn Độc & Cây Đại Thụ",
    nameEn: "The Solitary Hill of Resilience",
    zone: "highlands",
    series: ["dung-day"],
    metaphor: "Biểu tượng sống còn của Senore: bão lay rễ sâu, kiên cường đứng vững giữa đất trời",
    focalLength: "24mm Ultra-Wide",
    parallax: {
      foreground: "Mặt đất đá nứt nẻ, những ngọn cỏ úa rạp mình sát đất theo chiều gió giật",
      midground: "Cây đại thụ uốn mình chống bão, người quàng khăn đỏ ghì chân đứng vững",
      background: "Những dãy núi xa xa xám đen cuộn sóng chìm trong mưa trắng",
      skybox: "Bầu trời giông bão cuồn cuộn mây xoáy đen đặc, chớp giật xé toạc chân trời",
    },
    palette: ["#1D2D44", "#0D1B2A", "#7077A1", "#00F5D4"],
    lighting: {
      kelvin: 8000,
      type: "strobe_lightning",
      quality: "Ánh chớp nhấp nháy tạo bóng đổ gắt góc 90 độ, viền sáng bạc rực rỡ quanh thân cây",
    },
    cameraPresets: [
      "Extreme Long Shot (ELS) cây cô độc hiên ngang giữa đỉnh đồi",
      "Slow tilt-down xuyên qua lớp đất thấy mạng lưới rễ bám sâu vào lòng đá",
      "Dynamic tracking bám theo tà áo khăn đỏ bay phần phật trong gió",
    ],
    sfxAmbience: [
      "Tiếng gió bão gầm rú rít từng cơn lạnh buốt",
      "Tiếng sấm nổ đùng đoàng rung chuyển mặt đất",
      "Tiếng cành cây cọ xát ken két kiên cường",
    ],
    promptTemplate:
      "solitary massive ancient tree enduring catastrophic mountain thunderstorm, deep roots anchored into bedrock, dramatic lightning flash, ember red leaf swirling, epic cinematic power, gouache art",
  },

  mistyTerraces: {
    id: "mistyTerraces",
    nameVi: "Ruộng Bậc Thang Mờ Sương Bình Minh",
    nameEn: "Misty Terrace Cascades at Dawn",
    zone: "highlands",
    series: ["nghe-thuat", "doi-nguoi"],
    metaphor: "Bản giao hưởng kỳ vĩ giữa bàn tay lao động con người và vẻ đẹp tạo hóa",
    focalLength: "50mm Human Eye",
    parallax: {
      foreground: "Bông lúa đẫm sương mai cận cảnh, giọt sương long lanh phản chiếu nắng",
      midground: "Những đường cong ruộng bậc thang tầng tầng lớp lớp uốn lượn theo sườn núi",
      background: "Đỉnh núi Fansipan hùng vĩ chìm nổi giữa biển mây trắng bồng bềnh",
      skybox: "Bình minh dát vàng trên thảm mây cuồn cuộn",
    },
    palette: ["#E9C46A", "#2EC4B6", "#FAF0CA", "#8EA8C3"],
    lighting: {
      kelvin: 3800,
      type: "direct_golden",
      quality: "Những vệt nắng xiên (God rays) xuyên qua biển sương rọi sáng từng mặt nước bậc thang",
    },
    cameraPresets: [
      "Slow crane down theo nhịp uốn lượn của từng tầng ruộng",
      "Macro ECU giọt sương mai trượt nhẹ trên lá lúa",
      "Wide establishing shot biển mây tràn qua thung lũng",
    ],
    sfxAmbience: [
      "Tiếng nước chảy róc rách qua các ống bương tre dẫn nước",
      "Tiếng chim rừng hót líu lo chào ngày mới",
      "Tiếng chuông bò lách cách từ xa vọng lại",
    ],
    promptTemplate:
      "breathtaking Vietnamese Sapa terraced rice fields in golden morning mist, cascading green and yellow water curves, volumetric sunbeams piercing mountain fog, poetic highland serenity",
  },

  waterfallGorge: {
    id: "waterfallGorge",
    nameVi: "Hẻm Núi Thác Gầm & Vách Đá Tai Mèo",
    nameEn: "The Raging Waterfall Gorge",
    zone: "highlands",
    series: ["dung-day"],
    metaphor: "Khúc quanh hiểm trở nhất của số phận, nơi bắt buộc phải đối mặt và buông bỏ sự kiểm soát",
    focalLength: "18mm Ultra-Wide",
    parallax: {
      foreground: "Bọt nước tung trắng xóa làm ướt ống kính, mỏm đá tai mèo sắc nhọn",
      midground: "Con thuyền gỗ buồm lướt qua mép vực thác, người lớn vứt mái chèo đón tay đứa trẻ",
      background: "Hai vách núi đá đen dựng đứng sừng sững như bức tường thành",
      skybox: "Màn sương nước mịt mù bốc lên che khuất bầu trời",
    },
    palette: ["#0D1B2A", "#1D2D44", "#00F5D4", "#FAF6EE"],
    lighting: {
      kelvin: 7000,
      type: "diffuse",
      quality: "Ánh sáng ngọc bích ma mị phản chiếu từ làn nước cuộn sóng kết hợp bọt nước trắng",
    },
    cameraPresets: [
      "Dynamic follow tracking phía sau mạn thuyền đang lao xuống ghềnh",
      "Top-down xoáy nước sâu hút con thuyền chìm vào lòng nước",
      "Slow-motion cận cảnh mái chèo rời tay trôi vào vệt bọt trắng",
    ],
    sfxAmbience: [
      "Tiếng thác nước gầm thét dội vang vách đá điếc tai",
      "Tiếng bọt nước va đập ầm ầm vào mạn thuyền",
      "Tiếng hít thở sâu dồn dập trước khi buông tay chèo",
    ],
    promptTemplate:
      "monumental mountain canyon waterfall gorge, raging turquoise white-water rapids, towering black jagged cliffs, small wooden boat navigating edge of abyss, dramatic kinetic energy, papercraft anime art",
  },

  // =========================================================================
  // VÙNG 4: ĐÔ THỊ CHIÊM NGHIỆM & PHỐ CŨ (NOSTALGIC URBAN LANDSCAPES)
  // =========================================================================

  clockworkTown: {
    id: "clockworkTown",
    nameVi: "Thị Trấn Bánh Răng & Tháp Đồng Hồ",
    nameEn: "Clockwork Town & Mechanical Towers",
    zone: "urban",
    series: ["doi-nguoi", "y-nghia"],
    metaphor: "Guồng quay bất tận của thời gian, sự cuống cuồng mưu sinh và cảm giác lạc lõng của người hiện đại",
    focalLength: "35mm Narrative",
    parallax: {
      foreground: "Những chiếc bánh răng khổng lồ bằng đồng đang quay ken két sát góc máy",
      midground: "Kênh nước nhân tạo chảy giữa thị trấn, con thuyền lướt qua dòng người chạy vội",
      background: "Dãy nhà mái ngói san sát gắn đầy mặt đồng hồ đủ kích cỡ",
      skybox: "Tháp đồng hồ trung tâm vươn cao chọc thủng màn khói xám đô thị",
    },
    palette: ["#B8C5D0", "#3A3A3C", "#C77DFF", "#212930"],
    lighting: {
      kelvin: 6500,
      type: "diffuse",
      quality: "Màu xám lạnh của sương khói công nghiệp, loang loáng bóng nước phản chiếu ánh tím huyền ảo",
    },
    cameraPresets: [
      "ECU kim đồng hồ cơ nhảy từng nhịp khô khốc",
      "Slow drone zoom-out từ tháp chuông ra toàn cảnh thị trấn",
      "Lateral tracking lướt ngang qua tủ kính trưng bày đồng hồ cát",
    ],
    sfxAmbience: [
      "Tiếng kim đồng hồ tích tắc khô khốc đan xen đa tầng",
      "Tiếng bánh răng kim loại rít nhẹ",
      "Tiếng chuông nhà thờ ngân dài điểm nhịp cô đơn",
    ],
    promptTemplate:
      "surreal steampunk Vietnamese clockwork town, giant brass cogs embedded in weathered tile roofs, narrow canals, mysterious silhouette citizens, mechanical clocktower, muted slate and violet palette",
  },

  rainyAlley: {
    id: "rainyAlley",
    nameVi: "Ngõ Phố Cổ Mưa Rào & Ban Công Rêu",
    nameEn: "Old Town Rain-Slick Alley",
    zone: "urban",
    series: ["y-nghia", "dung-day"],
    metaphor: "Nơi trú chân giữa dòng đời xô bồ, vẻ đẹp của những điều giản dị tĩnh lặng trong lòng thành phố",
    focalLength: "50mm Human Eye",
    parallax: {
      foreground: "Những giọt mưa lăn dài trên mặt kính cửa sổ quán nước vỉa hè",
      midground: "Con ngõ nhỏ lát gạch sẫm nước, người áo xanh bước đi dưới tán ô, ánh đèn đường vàng hắt",
      background: "Ban công sắt hoa văn Pháp cổ phủ đầy rêu và giàn hoa giấy ướt sũng",
      skybox: "Bầu trời xám xanh của một buổi chiều mưa dai dẳng",
    },
    palette: ["#23304A", "#1E1E1E", "#FFD166", "#6B7A4B"],
    lighting: {
      kelvin: 3000,
      type: "diffuse",
      quality: "Ánh đèn đường vàng ấm tương phản với màn mưa đêm xanh ngắt, tạo quầng sáng lung linh",
    },
    cameraPresets: [
      "Smooth tracking lùi trước mặt nhân vật đang bước đi",
      "Low-angle ngắm phản chiếu ánh đèn phố trên vũng nước mưa",
      "Static shot cánh hoa giấy đỏ rơi xuống vũng nước ven ngõ",
    ],
    sfxAmbience: [
      "Tiếng mưa rào rả rích trên mái ngói phố cổ",
      "Tiếng bước chân bì bõm giẫm trên vũng nước",
      "Tiếng còi xe máy xa xăm vọng lại từ phố lớn",
    ],
    promptTemplate:
      "nostalgic Hanoi old quarter narrow alley in pouring rain, wet cobblestones reflecting glowing amber streetlamps, French colonial wrought iron balconies with dripping bougainvillea flowers, poetic urban solitude",
  },

  writersAttic: {
    id: "writersAttic",
    nameVi: "Căn Phòng Gác Mái & Bàn Viết Đêm",
    nameEn: "The Writer's Attic Study",
    zone: "urban",
    series: ["y-nghia", "nghe-thuat"],
    metaphor: "Không gian thai nghén nghệ thuật, nơi chuyển hóa nỗi buồn thành câu hát để đời",
    focalLength: "50mm Human Eye",
    parallax: {
      foreground: "Trang giấy bản thảo thấm mực ướt, chiếc chặn giấy bằng đá cuội mài nhẵn",
      midground: "Người viết ngồi trầm tư bên bàn gỗ mun, ngọn nến nhỏ lay động, tách trà nguội",
      background: "Kệ sách gỗ mộc chất đầy sách cũ, khung cửa sổ áp mái nhìn ra thành phố đêm",
      skybox: "Bầu trời đêm đầy sao lấp lánh sau khi mưa tạnh",
    },
    palette: ["#23304A", "#1E1E1E", "#EFE8DC", "#D9622B"],
    lighting: {
      kelvin: 2200,
      type: "candle_hearth",
      quality: "Ánh nến bập bùng tạo quầng sáng ấm áp tập trung trên trang giấy, bóng đổ dài trên vách gỗ",
    },
    cameraPresets: [
      "Macro CU ngòi bút máy đang viết từng nét chữ run rẩy trên giấy dó",
      "Over-the-shoulder nhìn qua vai người viết ra khung cửa sổ mưa đêm",
      "Slow orbit xoay nhẹ quanh ngọn nến lay lắt trong gió",
    ],
    sfxAmbience: [
      "Tiếng ngòi bút sột soạt trên mặt giấy ráp",
      "Tiếng mưa đêm lộp độp trên kính cửa sổ gác mái",
      "Tiếng thở dài nhẹ nhõm khi viết xong một câu hát chân thành",
    ],
    promptTemplate:
      "poetic artist attic studio at midnight, vintage wooden writing desk, brass desk lamp, single flickering beeswax candle, open sketchbook with ink calligraphy, skylight window showing starry sky",
  },

  // =========================================================================
  // VÙNG 5: KHÔNG GIAN TÂM TƯỞNG & SIÊU THỰC (SURREAL DREAMSCAPES)
  // =========================================================================

  mirrorLake: {
    id: "mirrorLake",
    nameVi: "Hồ Ký Ức Đen & Biển Sao Ngân Hà",
    nameEn: "Abyssal Star-Mirror Lake",
    zone: "surreal",
    series: ["y-nghia", "doi-nguoi"],
    metaphor: "Tầng sâu vô thức, nơi đối diện với nỗi cô đơn, những giọt nước mắt và sự thanh tẩy tâm hồn",
    focalLength: "35mm Narrative",
    parallax: {
      foreground: "Gợn sóng lăn tăn nhẹ quanh mũi thuyền gỗ mộc đang đứng yên",
      midground: "Hai nhân vật ngồi tĩnh lặng trên thuyền, giọt lệ rơi xuống tạo vòng tròn ánh sáng",
      background: "Rặng thông đen tuyền in bóng sắc nét xuống mặt nước tĩnh lặng như gương",
      skybox: "Dải Ngân Hà rực rỡ muôn triệu vì sao lấp lánh phản chiếu trọn vẹn dưới đáy hồ",
    },
    palette: ["#0B132B", "#06D6A0", "#1C2541", "#FAF6EE"],
    lighting: {
      kelvin: 2400,
      type: "bioluminescence",
      quality: "Ánh sáng ngọc bích phát quang từ đáy nước lan tỏa, hòa cùng ánh sao đêm huyền diệu",
    },
    cameraPresets: [
      "Static frame tĩnh lặng tuyệt đối nhìn chiếc thuyền giữa hồ gương",
      "Macro ECU giọt nước mắt rơi chạm mặt hồ tạo sóng ánh sáng lan tỏa",
      "Top-down vuông góc từ trời cao xuống mặt nước phản chiếu sao",
    ],
    sfxAmbience: [
      "Khoảng lặng âm thanh tĩnh mịch tuyệt đối (Absolute Silence)",
      "Tiếng giọt nước tí tách rơi vang vọng ngân dài",
      "Tiếng gió thoảng nhẹ qua rặng thông đêm",
    ],
    promptTemplate:
      "deep obsidian mirror lake at midnight reflecting cosmic starry galaxy, silhouette pine trees, small wooden boat floating, bioluminescent turquoise water ripples blooming from center, studio ghibli fantasy",
  },

  celestialValley: {
    id: "celestialValley",
    nameVi: "Thung Lũng Cá Bay & Bầu Trời Lăng Kính",
    nameEn: "Valley of Celestial Flying Fish",
    zone: "surreal",
    series: ["nghe-thuat", "dung-day"],
    metaphor: "Sự thăng hoa của trí tưởng tượng, tự do tuyệt đối khi thoát khỏi những định kiến trói buộc",
    focalLength: "24mm Ultra-Wide",
    parallax: {
      foreground: "Đàn cá nhỏ trong suốt phát quang bơi lội vòng quanh mạn thuyền trên không",
      midground: "Con thuyền gỗ lướt trên dòng sông lơ lửng giữa thung lũng hoa vàng",
      background: "Những ngọn núi đá vôi bay bổng giữa biển mây màu vàng mật ong",
      skybox: "Bầu trời màu ngọc lam trong vắt với muôn ngàn vệt nắng cầu vồng",
    },
    palette: ["#48CAE4", "#FFD166", "#06D6A0", "#0096C7"],
    lighting: {
      kelvin: 3500,
      type: "direct_golden",
      quality: "Ánh sáng vàng mật ong chan hòa, bụi tiên óng ánh lơ lửng trong không trung",
    },
    cameraPresets: [
      "Crane cẩu máy từ dưới nước vút lên trời theo đàn cá bay",
      "Medium shot đứa trẻ phấn khích giơ tay đón chú cá phát sáng",
      "Wide tracking con thuyền bay lướt qua thung lũng mộng",
    ],
    sfxAmbience: [
      "Tiếng đàn harp rải những nốt lấp lánh như giọt pha lê",
      "Tiếng vỗ cánh quẫy đuôi trong không khí huyền ảo",
      "Tiếng cười vang trong trẻo của đứa trẻ hòa cùng gió",
    ],
    promptTemplate:
      "surreal valley of luminous flying koi fish swimming gracefully through vibrant cyan sky, wooden boat gliding on river of clouds, honey golden sunlight, emerald floating meadows, joyful magical realism",
  },

  restoredGarden: {
    id: "restoredGarden",
    nameVi: "Khu Vườn Hoang Phế Bung Nở Hoa",
    nameEn: "The Reborn Greenhouse Sanctuary",
    zone: "surreal",
    series: ["nghe-thuat", "dung-day"],
    metaphor: "Sức mạnh của tình bạn, sự cộng hưởng nghệ thuật và hồi sinh những tâm hồn rạn nứt",
    focalLength: "35mm Narrative",
    parallax: {
      foreground: "Những dây hoa leo nở bung sắc đỏ cam quấn quanh khung sắt rỉ sét",
      midground: "Cây non trung tâm nay vươn cao tỏa bóng mát, 5 người vây quanh vòng hạt giống",
      background: "Khung nhà kính đổ nát nay treo đầy hàng ngàn mảnh kính màu khúc xạ ánh nắng",
      skybox: "Ánh mặt trời rực rỡ sau mưa chiếu qua mái kính vỡ tạo cầu vồng lộng lẫy",
    },
    palette: ["#E9C46A", "#2EC4B6", "#9D4EDD", "#D9622B"],
    lighting: {
      kelvin: 3200,
      type: "direct_golden",
      quality: "Ánh nắng vàng sau mưa khúc xạ qua lăng kính tạo muôn ngàn đốm sáng cầu vồng nhảy múa",
    },
    cameraPresets: [
      "Master wide shot cánh cổng sắt mở toang đón cộng đồng ùa vào",
      "Crane up từ gốc cây non lên toàn cảnh khu vườn trác tuyệt giữa lòng phố",
      "Close-up 5 bàn tay cùng vùi hạt giống quý xuống đất mềm",
    ],
    sfxAmbience: [
      "Tiếng chim hót ríu rít tưng bừng sau cơn mưa",
      "Tiếng chuông gió kính màu leng keng trong trẻo",
      "Toàn bộ dàn nhạc giao hưởng tấu lên khúc ca đăng quang huy hoàng",
    ],
    promptTemplate:
      "magnificent abandoned greenhouse greenhouse garden transformed into blooming Eden, thousands of hanging stained-glass prisms scattering rainbow light, lush blooming flowers, celebratory community",
  },
};
