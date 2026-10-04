/**
 * 🎥 CẨM NANG NGÔN NGỮ ĐIỆN ẢNH & ĐỘNG LỰC HỌC MÁY QUAY — SENORE CINEMATOGRAPHY
 * Tiêu chuẩn kỹ thuật ống kính, tỷ lệ khung hình, bố cục và chuyển cảnh chuẩn Studio.
 */

export type AspectRatioSpec = {
  id: string;
  ratio: string;
  width: number;
  height: number;
  useCase: string;
};

export const ASPECT_RATIOS: Record<string, AspectRatioSpec> = {
  cinemaScope: {
    id: "cinemaScope",
    ratio: "2.39:1",
    width: 1920,
    height: 804,
    useCase: "MV chính thức (Official Cinematic MV), đại cảnh thiên nhiên và chiều sâu không gian",
  },
  standardWidescreen: {
    id: "standardWidescreen",
    ratio: "16:9",
    width: 1920,
    height: 1080,
    useCase: "Phát hành YouTube chuẩn, tương thích hoàn hảo mọi màn hình TV và máy tính",
  },
  academyNostalgia: {
    id: "academyNostalgia",
    ratio: "4:3",
    width: 1440,
    height: 1080,
    useCase: "Các phân cảnh hồi ức, ký ức tuổi thơ hoặc khung hình nhật ký của tác giả",
  },
  verticalShorts: {
    id: "verticalShorts",
    ratio: "9:16",
    width: 1080,
    height: 1920,
    useCase: "YouTube Shorts, TikTok, Instagram Reels, Spotify Canvas (3–8s loop)",
  },
};

export type LensSpec = {
  focalLength: string;
  name: string;
  fieldOfView: string;
  aestheticEffect: string;
  bestUsedFor: string;
};

export const LENS_SYSTEM: Record<string, LensSpec> = {
  ultraWide18mm: {
    focalLength: "18mm – 24mm",
    name: "Ultra-Wide Landscape Lens",
    fieldOfView: "Góc rộng 90° – 100°",
    aestheticEffect: "Kéo giãn không gian, tạo cảm giác choáng ngợp, con người lọt thỏm giữa vũ trụ bao la",
    bestUsedFor: "Đồi gió đơn độc, thác lũ bão dông, bến sông sáng sớm, biển mây vô tận",
  },
  narrative35mm: {
    focalLength: "35mm",
    name: "Narrative Environmental Lens",
    fieldOfView: "Góc nhìn 63°",
    aestheticEffect: "Cân bằng hoàn hảo giữa chủ thể và môi trường xung quanh, tạo cảm giác chân thực như người bạn đồng hành",
    bestUsedFor: "Cầu đá cổ, con thuyền rẽ sóng, thị trấn đồng hồ, sân đình làng quê",
  },
  humanEye50mm: {
    focalLength: "50mm",
    name: "Standard Human Eye Lens",
    fieldOfView: "Góc nhìn 47°",
    aestheticEffect: "Tái tạo chính xác góc nhìn và tỷ lệ của mắt người, chân thành, mộc mạc, không méo hình",
    bestUsedFor: "Bàn ăn khói bếp, người ngồi tựa cửa, ngõ mưa phố cổ, đối thoại giữa hai nhân vật",
  },
  portrait85mm: {
    focalLength: "85mm – 105mm",
    name: "Cinematic Portrait Lens",
    fieldOfView: "Góc hẹp 28° – 23°",
    aestheticEffect: "Xóa phông mượt mà (Shallow DOF), cô lập cảm xúc nhân vật khỏi thế giới xô bồ, tạo đốm bokeh lung linh",
    bestUsedFor: "Cận cảnh ánh mắt đứa trẻ, khóe môi người lớn, giọt nước mắt rơi, ngọn nến gác mái",
  },
  compression135mm: {
    focalLength: "135mm – 200mm",
    name: "Telephoto Compression Lens",
    fieldOfView: "Góc hẹp 18° – 12°",
    aestheticEffect: "Nén phối cảnh, mang các ngọn núi xa hoặc vầng thái dương khổng lồ áp sát ngay sau lưng nhân vật",
    bestUsedFor: "Cảnh hoàng hôn kết phim, bóng người đi ngược chiều gió, con thuyền trôi về mặt trời",
  },
};

export type CameraMovement = {
  id: string;
  nameVi: string;
  nameEn: string;
  emotionalFunction: string;
};

export const CAMERA_MOVEMENTS: Record<string, CameraMovement> = {
  staticZen: {
    id: "staticZen",
    nameVi: "Khung Hình Tĩnh Thiền Định (The Ozu Static Frame)",
    nameEn: "Static Zen Frame",
    emotionalFunction: "Để thời gian tự trôi, nhân vật tự bước vào và bước ra khỏi khung hình, tạo sự tĩnh lặng tuyệt đối",
  },
  slowLateralTrack: {
    id: "slowLateralTrack",
    nameVi: "Lướt Ngang Dòng Thời Gian (Lateral Scroll)",
    nameEn: "Lateral Time Tracking",
    emotionalFunction: "Mô phỏng cuộn tranh trục truyền thống Á Đông, kể câu chuyện một đời người nối tiếp qua từng cảnh vật",
  },
  risingCrane: {
    id: "risingCrane",
    nameVi: "Cẩu Máy Nâng Cao Hòa Vào Vũ Trụ (Rising Crane Reveal)",
    nameEn: "Cosmic Crane Ascend",
    emotionalFunction: "Nâng tầm nhìn từ nỗi buồn cá nhân lên toàn cảnh đất trời rộng lớn, đem lại sự giải thoát và hy vọng",
  },
  pushInIntrospection: {
    id: "pushInIntrospection",
    nameVi: "Tiến Sâu Vào Tâm Tưởng (Slow Push-In)",
    nameEn: "Introspective Push-In",
    emotionalFunction: "Máy quay từ từ tiến sát vào gương mặt nhân vật khi họ nhận ra chân lý hoặc đưa ra quyết định thay đổi cuộc đời",
  },
  pullBackCosmos: {
    id: "pullBackCosmos",
    nameVi: "Lùi Xa Buông Bỏ (Extreme Pull-Back)",
    nameEn: "Liberation Pull-Back",
    emotionalFunction: "Lùi dần ra xa để nhân vật và con thuyền tan biến vào hoàng hôn, ngầm nhắc nhở: mọi biến cố rồi sẽ hóa bình yên",
  },
  rackFocus: {
    id: "rackFocus",
    nameVi: "Chuyển Tiêu Cự Đổi Hướng Tâm Trí (Rack Focus)",
    nameEn: "Emotional Rack Focus",
    emotionalFunction: "Chuyển nét từ vật thể tiền cảnh (giọt mưa, cành lá) sang chủ thể hậu cảnh, biểu thị sự thức tỉnh tâm trí",
  },
};

export type MatchCutPattern = {
  id: string;
  nameVi: string;
  sourceVisual: string;
  targetVisual: string;
  symbolicMeaning: string;
};

export const SIGNATURE_MATCH_CUTS: MatchCutPattern[] = [
  {
    id: "rotational_time",
    nameVi: "Vòng Xoay Của Thời Gian",
    sourceVisual: "Kim đồng hồ cơ nhảy nấc trong căn phòng xám",
    targetVisual: "Kim tháp chuông thị trấn -> Bánh xe đạp người thợ -> Vòng vân gỗ cây cổ thụ",
    symbolicMeaning: "Thời gian là dòng chảy tuần hoàn, vạn vật chuyển dời nhưng bản chất sự sống vẫn tiếp nối",
  },
  {
    id: "falling_surrender",
    nameVi: "Giọt Rơi Buông Bỏ",
    sourceVisual: "Giọt nước mắt rơi chạm mặt hồ ký ức",
    targetVisual: "Giọt mưa đầu mùa rơi trên lá -> Chiếc lá phong đỏ chao liệng -> Mái chèo buông rơi vào sóng nước",
    symbolicMeaning: "Hành động buông bỏ những cố chấp để hòa mình vào dòng chảy nâng đỡ của cuộc đời",
  },
  {
    id: "spark_hope",
    nameVi: "Đốm Lửa Hy Vọng",
    sourceVisual: "Ngọn nến nhỏ trong căn phòng gác mái đêm",
    targetVisual: "Con đom đóm bờ suối quê -> Mảnh kính màu bắt tia nắng -> Ánh mắt đứa trẻ mỉm cười",
    symbolicMeaning: "Ánh sáng của niềm tin không bao giờ tắt; nó chỉ chuyển hóa từ dạng này sang dạng khác",
  },
  {
    id: "hand_solidarity",
    nameVi: "Bàn Tay Gắn Kết",
    sourceVisual: "Bàn tay đứa trẻ chìa ra kéo người lớn xuống thuyền",
    targetVisual: "Bàn tay người chăm cây nâng mầm non -> Năm bàn tay cùng nắm chặt thanh xà gỗ",
    symbolicMeaning: "Con người không sinh ra để cô độc; sức mạnh lớn nhất là dám mở lòng đón nhận sự giúp đỡ",
  },
  {
    id: "bridge_threshold",
    nameVi: "Cây Cầu Bến Đỗ",
    sourceVisual: "Bàn chân dừng lại trước lan can cầu đá cổ lúc bình minh",
    targetVisual: "Bàn chân bước lên cầu ván gỗ cập bến lúc hoàng hôn chia tay",
    symbolicMeaning: "Vòng tròn hoàn thành: khởi hành trong mỏi mệt, trở về trong tự do và thanh thản",
  },
];
