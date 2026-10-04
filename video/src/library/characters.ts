/**
 * 🏛️ THƯ VIỆN 22 HÌNH MẪU NHÂN VẬT CHUẨN STUDIO — SENORE MASTER CHARACTER MATRIX
 * Hệ thống nhân vật đa thế hệ, đa tầng triết lý phục vụ sản xuất dài hạn.
 * Phân chia theo 5 Vòng Đời: Tuổi Thơ, Thiếu Niên, Trưởng Thành, Trung Niên, Lão Niên.
 */

export type CharacterPalette = {
  skin: string;
  skinShadow: string;
  hair: string;
  outfitBase: string;
  outfitShadow: string;
  accent: string;
  pantsOrSkirt: string;
  footwear: string;
};

export type LifeStage = "childhood" | "youth" | "adulthood" | "midlife" | "elderly";

export type CharacterArchetype = {
  id: string;
  nameVi: string;
  nameEn: string;
  stage: LifeStage;
  series: ("dung-day" | "doi-nguoi" | "y-nghia" | "nghe-thuat")[];
  role: string;
  ageRange: string;
  headRatio: number; // Tỷ lệ đầu (Head units)
  build: string; // Dáng người
  signatureProp: string; // Vật bất ly thân
  philosophy: string; // Tầng nghĩa triết lý
  palette: CharacterPalette;
  aiPromptSnippet: string; // Prompt blueprint chuẩn cho Midjourney / ComfyUI
};

export const CHARACTER_ARCHETYPES: Record<string, CharacterArchetype> = {
  // =========================================================================
  // GIAI ĐOẠN 1: TUỔI THƠ & BẢN THỂ NGUYÊN SƠ (CHILDHOOD & INNOCENCE)
  // =========================================================================

  innerChild: {
    id: "innerChild",
    nameVi: "Đứa Trẻ Bên Trong",
    nameEn: "The Inner Child",
    stage: "childhood",
    series: ["dung-day", "doi-nguoi", "y-nghia", "nghe-thuat"],
    role: "Linh hồn & hoa tiêu tâm thức xuyên suốt toàn bộ vũ trụ Senore",
    ageRange: "7 – 9 tuổi",
    headRatio: 4.2,
    build: "Nhỏ nhắn, hoạt bát, đầu to tròn đáng yêu, tứ chi năng động",
    signatureProp: "Khăn len đỏ Ember tung bay dài sau lưng, áo len ngọc bích",
    philosophy: "Sự nguyên sơ, lòng dũng cảm nguyên bản, không biết sợ hãi trước bão giông",
    palette: {
      skin: "#FAD4C0",
      skinShadow: "#E0A98F",
      hair: "#4A2E1B",
      outfitBase: "#2EC4B6", // Xanh ngọc bích
      outfitShadow: "#1F8A80",
      accent: "#D9622B", // Đỏ Ember Senore
      pantsOrSkirt: "#E9C46A", // Vàng mù tạt
      footwear: "#F4A261", // Ủng cam ấm
    },
    aiPromptSnippet:
      "spirited 8yo Vietnamese child, bright joyful eyes, short chestnut hair, wearing turquoise knit sweater #2EC4B6, flying long ember red woolen scarf #D9622B, mustard yellow shorts #E9C46A, warm orange rain boots, studio ghibli gouache style",
  },

  fluteBoy: {
    id: "fluteBoy",
    nameVi: "Chú Bé Chăn Trâu & Tiếng Sáo",
    nameEn: "The Pastoral Boy with Bamboo Flute",
    stage: "childhood",
    series: ["doi-nguoi", "y-nghia"],
    role: "Hiện thân của sự tự tại, hòa tan vào tự nhiên đất trời",
    ageRange: "8 – 11 tuổi",
    headRatio: 4.5,
    build: "Dáng mảnh khảnh dẻo dai, nước da bánh mật rám nắng khỏe khoắn",
    signatureProp: "Cây sáo trúc nhỏ quấn chỉ đỏ, mũ lá sen / nón rơm",
    philosophy: "Hạnh phúc không nằm ở chỗ nắm giữ nhiều, mà ở chỗ biết thưởng thức từng làn gió",
    palette: {
      skin: "#C8956E",
      skinShadow: "#A4704B",
      hair: "#1E1A18",
      outfitBase: "#6B7A4B", // Vải nâu lá sen
      outfitShadow: "#485332",
      accent: "#D9622B",
      pantsOrSkirt: "#4A3B32", // Quần đùi nâu đất
      footwear: "#C8956E", // Chân trần
    },
    aiPromptSnippet:
      "sun-kissed Vietnamese rural boy resting on back of water buffalo, holding bamboo flute, lotus leaf hat, earthy brown roll-up shorts, breezy sunny afternoon, lush green paddy fields",
  },

  paperBoatGirl: {
    id: "paperBoatGirl",
    nameVi: "Cô Bé Thả Thuyền Giấy",
    nameEn: "The Girl with Paper Boats",
    stage: "childhood",
    series: ["y-nghia", "doi-nguoi"],
    role: "Kẻ ấp ủ những ước mơ đầu đời gửi vào dòng nước",
    ageRange: "6 – 8 tuổi",
    headRatio: 4.0,
    build: "Mảnh mai, bím tóc hai bên buộc dây vải đỏ, ánh mắt ngập tràn hy vọng",
    signatureProp: "Những chiếc thuyền giấy gấp từ trang vở cũ thả trôi rãnh nước mưa",
    philosophy: "Mọi hành trình vĩ đại đều bắt đầu từ một ước mơ mong manh được thả trôi dũng cảm",
    palette: {
      skin: "#FDE2D2",
      skinShadow: "#E3B49E",
      hair: "#292524",
      outfitBase: "#E9C46A", // Váy yếm vàng mơ
      outfitShadow: "#C49A42",
      accent: "#EFE8DC", // Thuyền giấy trắng ngà
      pantsOrSkirt: "#FAF0CA",
      footwear: "#D9622B", // Đôi guốc mộc quai đỏ
    },
    aiPromptSnippet:
      "tender 7yo Vietnamese girl with pigtails crouching beside clear rainwater stream, gently setting afloat origami folded paper boat, wearing sunny yellow cotton pinafore dress, nostalgic puddle reflections",
  },

  rainstormPaperboy: {
    id: "rainstormPaperboy",
    nameVi: "Đứa Trẻ Bán Báo Phố Mưa",
    nameEn: "The Rainstorm Paperboy",
    stage: "childhood",
    series: ["dung-day"],
    role: "Nghị lực kiên cường của trẻ thơ nơi phố thị, mầm cây mọc qua khe bê tông",
    ageRange: "9 – 12 tuổi",
    headRatio: 4.8,
    build: "Gầy gò, đôi mắt sáng rực kiên định, bước chạy thoăn thoắt",
    signatureProp: "Túi bạt bọc nilong che báo khỏi ướt, chiếc mũ nồi dạ nâu",
    philosophy: "Bão táp không dập tắt được nụ cười của người biết hướng về phía trước",
    palette: {
      skin: "#E4B18C",
      skinShadow: "#BD8762",
      hair: "#1A1A1A",
      outfitBase: "#3A506B", // Áo vải thô xanh xám
      outfitShadow: "#233347",
      accent: "#E9C46A", // Đèn đường vàng phản chiếu
      pantsOrSkirt: "#2B2D42",
      footwear: "#4A3525", // Giày vải sờn mũi
    },
    aiPromptSnippet:
      "determined young Vietnamese newspaper boy running through rainy twilight city alley, vintage canvas messenger bag, patched grey jacket, dark trousers, glowing streetlights reflecting on wet cobblestones",
  },

  // =========================================================================
  // GIAI ĐOẠN 2: THIẾU NIÊN & KHÁT KHAO KHÁM PHÁ (YOUTH & QUEST)
  // =========================================================================

  cartographer: {
    id: "cartographer",
    nameVi: "Người Vẽ Bản Đồ / Kẻ Mở Đường",
    nameEn: "The Cartographer / The Explorer",
    stage: "youth",
    series: ["nghe-thuat", "dung-day"],
    role: "Kẻ đi tìm những chân trời mới, dám lạc đường để định vị chính mình",
    ageRange: "18 – 22 tuổi",
    headRatio: 6.4,
    build: "Thanh thoát, bước đi nhanh nhẹn, tư thế vươn về phía trước",
    signatureProp: "Sổ phác thảo bọc da, la bàn đồng, ống da đựng giấy cuộn",
    philosophy: "Bản đồ không phải là thế giới có sẵn; bản đồ là thứ ta tự vẽ bằng chính bước chân mình",
    palette: {
      skin: "#F5D4BC",
      skinShadow: "#D6A98C",
      hair: "#292524",
      outfitBase: "#E9C46A", // Vàng hổ phách
      outfitShadow: "#B8963E",
      accent: "#2A4B6E", // Xanh mực bản đồ
      pantsOrSkirt: "#4A5568", // Kaki xám chì
      footwear: "#744210",
    },
    aiPromptSnippet:
      "adventurous 20yo Vietnamese cartographer girl, short bob hair with headband, wearing amber yellow explorer jacket #E9C46A, brass compass, leather satchel with rolled parchment maps, mountain breeze",
  },

  artist: {
    id: "artist",
    nameVi: "Người Nghệ Thuật / Người Dệt Ánh Sáng",
    nameEn: "The Light Weaver / The Painter",
    stage: "youth",
    series: ["nghe-thuat"],
    role: "Nhìn thấy vẻ đẹp và màu sắc ẩn giấu nơi những mảng tường nứt nẻ và phế tích",
    ageRange: "19 – 23 tuổi",
    headRatio: 6.2,
    build: "Nhẹ nhàng, bay bổng, cử chỉ mềm mại như đang đối thoại cùng màu sắc",
    signatureProp: "Lăng kính màu khúc xạ ánh sáng, cọ vẽ lông mềm, bảng pha màu loang",
    philosophy: "Nghệ thuật không tô vẽ sự hoàn hảo, nghệ thuật là tìm thấy sự thiêng liêng nơi rạn nứt",
    palette: {
      skin: "#FDE2D2",
      skinShadow: "#E3B49E",
      hair: "#3B2820",
      outfitBase: "#6B7A4B", // Moss Green
      outfitShadow: "#485332",
      accent: "#9D4EDD", // Tím lăng kính
      pantsOrSkirt: "#EFE8DC", // Vải mộc giấy cũ
      footwear: "#8B5E3C",
    },
    aiPromptSnippet:
      "poetic 21yo Vietnamese girl artist, paint marks on linen apron, wearing moss green dress #6B7A4B, holding glass prism scattering rainbow caustics across old wall, gentle starry eyes",
  },

  memoryCollector: {
    id: "memoryCollector",
    nameVi: "Người Nhặt Ký Ức",
    nameEn: "The Memory Collector",
    stage: "youth",
    series: ["doi-nguoi", "y-nghia"],
    role: "Người gom giữ những kỷ vật bình dị bị người đời lãng quên",
    ageRange: "17 – 21 tuổi",
    headRatio: 6.3,
    build: "Gầy, ánh mắt trầm tĩnh, cử chỉ cẩn trọng nâng niu từng đồ vật",
    signatureProp: "Chiếc hộp gỗ cũ đựng mảnh gốm vỡ, cánh hoa ép, vỏ ốc, vé tàu rách",
    philosophy: "Mỗi đồ vật bỏ đi đều là nhân chứng của một khoảnh khắc từng được yêu thương tha thiết",
    palette: {
      skin: "#EED5C2",
      skinShadow: "#D1B29E",
      hair: "#1F1D20",
      outfitBase: "#7A5C43", // Nâu đất Earth
      outfitShadow: "#533D2B",
      accent: "#48CAE4", // Xanh ký ức
      pantsOrSkirt: "#3A3A3C",
      footwear: "#4A3525",
    },
    aiPromptSnippet:
      "reflective Vietnamese youth kneeling on abandoned attic floor, holding polished wooden curiosity box filled with sea glass and dried autumn leaves, warm nostalgic sunbeam through dust",
  },

  cyclist: {
    id: "cyclist",
    nameVi: "Tay Đạp Xe Ngược Gió",
    nameEn: "The Headwind Cyclist",
    stage: "youth",
    series: ["dung-day"],
    role: "Sự bứt phá, sức sống thanh xuân đối mặt với giông lốc",
    ageRange: "18 – 24 tuổi",
    headRatio: 6.7,
    build: "Săn chắc, bắp chân gân guốc, lưng gập thấp đón gió",
    signatureProp: "Chiếc xe đạp khung sắt cổ điển, dải ruy-băng đỏ bay sau ghi-đông",
    philosophy: "Gió ngược làm ta mỏi gối, nhưng chỉ có gió ngược mới nâng cánh diều bay cao",
    palette: {
      skin: "#E2AC83",
      skinShadow: "#BD8157",
      hair: "#111012",
      outfitBase: "#D9622B", // Đỏ cam Ember
      outfitShadow: "#9E3C12",
      accent: "#EFE8DC",
      pantsOrSkirt: "#1D2D44",
      footwear: "#FAF6EE",
    },
    aiPromptSnippet:
      "spirited Vietnamese cyclist leaning hard into strong headwinds along grassy river dyke, vintage road bicycle, rust orange windbreaker #D9622B, dramatic stormy sky, flying leaves",
  },

  // =========================================================================
  // GIAI ĐOẠN 3: TRƯỞNG THÀNH & VA ĐẬP CUỘC SỐNG (ADULTHOOD & STRUGGLE)
  // =========================================================================

  seeker: {
    id: "seeker",
    nameVi: "Người Kiếm Tìm / Người Trưởng Thành",
    nameEn: "The Seeker / The Contemplative Adult",
    stage: "adulthood",
    series: ["dung-day", "doi-nguoi"],
    role: "Nhân vật chính chiêm nghiệm, đại diện cho người trải qua bão giông và áp lực cuộc sống",
    ageRange: "28 – 34 tuổi",
    headRatio: 6.8,
    build: "Dáng cao gầy, vai hơi chùng vì mỏi mệt, bước đi chậm rãi vững chãi",
    signatureProp: "Áo măng-tô xanh thẫm, cuốn sổ tay nhét túi, đôi mắt xa xăm",
    philosophy: "Sau tất cả những bon chen mệt mỏi, dũng khí lớn nhất là hòa giải với đứa trẻ trong lòng",
    palette: {
      skin: "#F2CEB6",
      skinShadow: "#D4A386",
      hair: "#212124",
      outfitBase: "#2A4B6E", // Xanh biển thẫm
      outfitShadow: "#1A334D",
      accent: "#EFE8DC", // Len mộc màu giấy cũ
      pantsOrSkirt: "#2B2D42", // Than tối
      footwear: "#4A3525", // Da sáp mòn đế
    },
    aiPromptSnippet:
      "Vietnamese contemplative 30yo man, slender build, messy black hair, tired but resolute eyes, wearing long slate blue wool coat #2A4B6E over cream knit turtleneck #EFE8DC, dark charcoal trousers #2B2D42, worn brown leather boots",
  },

  writer: {
    id: "writer",
    nameVi: "Người Viết Đêm / Kẻ Chiêm Nghiệm",
    nameEn: "The Midnight Writer / The Philosopher",
    stage: "adulthood",
    series: ["y-nghia"],
    role: "Hiện thân của tác giả Senore: người ngồi dưới ánh đèn dầu lắng nghe tiếng đêm",
    ageRange: "30 – 38 tuổi",
    headRatio: 6.5,
    build: "Dáng ngồi thẳng, bàn tay thon dài cầm bút mực, cử chỉ tiết chế",
    signatureProp: "Kính gọng tròn kim loại mờ, sổ tay da cũ, bút máy mực đen, ngọn nến",
    philosophy: "Viết không phải để khoe khoang câu chữ, mà để thắp một que diêm nhỏ giữa đêm đen nhân thế",
    palette: {
      skin: "#EED5C2",
      skinShadow: "#D1B29E",
      hair: "#1E1E20",
      outfitBase: "#23304A", // Night Blue
      outfitShadow: "#141D2E",
      accent: "#D9622B", // Ngọn lửa nhỏ Ember
      pantsOrSkirt: "#3A3A3C", // Màu đá xám
      footwear: "#2A231C",
    },
    aiPromptSnippet:
      "quiet Vietnamese writer sitting at wooden desk, round vintage spectacles, wearing midnight blue oversized cardigan #23304A, holding fountain pen, writing in aged paper journal, warm candle light glow",
  },

  gardener: {
    id: "gardener",
    nameVi: "Người Gieo Hạt / Người Chăm Cây",
    nameEn: "The Seed Sower / The Caretaker",
    stage: "adulthood",
    series: ["dung-day", "nghe-thuat"],
    role: "Tượng trưng cho sự kiên nhẫn, bền bỉ mọc rễ, tin vào mùa gặt sau cơn bão",
    ageRange: "27 – 35 tuổi",
    headRatio: 6.6,
    build: "Khỏe khoắn, dẻo dai, bàn tay thô ráp quen chạm vào bùn đất",
    signatureProp: "Túi vải bố đựng hạt giống, xẻng con, bình tưới nước đồng cổ",
    philosophy: "Hạt giống chôn vùi trong bóng tối không phải để chết đi, mà để bắt đầu nảy mầm",
    palette: {
      skin: "#E8B896",
      skinShadow: "#C4926E",
      hair: "#322216",
      outfitBase: "#7A5C43", // Earth Brown
      outfitShadow: "#533D2B",
      accent: "#6B7A4B", // Moss Green
      pantsOrSkirt: "#473C35",
      footwear: "#5A4433",
    },
    aiPromptSnippet:
      "humble Vietnamese gardener, earth-toned canvas work shirt #7A5C43, rolled sleeves, canvas pouch of seeds, kneeling gently on fertile soil, touching green sprout with moss green scarf #6B7A4B",
  },

  builder: {
    id: "builder",
    nameVi: "Người Dựng Xây / Kẻ Vượt Thác",
    nameEn: "The Builder / The Iron Worker",
    stage: "adulthood",
    series: ["dung-day"],
    role: "Sức mạnh hành động cụ thể, phá bỏ rào cản, chống đỡ mái giàn trong mưa bão",
    ageRange: "28 – 36 tuổi",
    headRatio: 7.0,
    build: "Vạm vỡ, vai rộng, bắp tay cuồn cuộn gân guốc, tư thế hiên ngang",
    signatureProp: "Dải vải đỏ buộc cổ tay, búa gỗ, hộp đồ nghề sắt, xe đạp chở đồ",
    philosophy: "Khi bão giông ập đến, kẻ hèn nhát chạy trốn, người dũng cảm đứng lại dựng giàn chống",
    palette: {
      skin: "#D89A72",
      skinShadow: "#B2734C",
      hair: "#1A1A1A",
      outfitBase: "#9C4124", // Đỏ gỉ sắt / Rust Red
      outfitShadow: "#6C2A15",
      accent: "#D9622B", // Ember đỏ lửa
      pantsOrSkirt: "#2D3748",
      footwear: "#1A202C", // Ủng da bảo hộ
    },
    aiPromptSnippet:
      "strong Vietnamese builder, athletic broad-shouldered build, rust red heavy-duty canvas vest #9C4124, crimson wristband, tool belt, rugged hands holding wooden beams against wind, resolute spirit",
  },

  potter: {
    id: "potter",
    nameVi: "Người Thợ Gốm / Kẻ Nhào Nặn Số Phận",
    nameEn: "The Potter / The Reshaper",
    stage: "adulthood",
    series: ["nghe-thuat", "doi-nguoi"],
    role: "Biểu tượng của sự kiên nhẫn vượt qua ngọn lửa thiêu đốt để định hình phẩm giá",
    ageRange: "30 – 40 tuổi",
    headRatio: 6.6,
    build: "Đôi bàn tay gân guốc nhào đất dẻo dai, ánh mắt tĩnh tại dõi theo bàn xoay",
    signatureProp: "Bàn xoay gốm thủ công, bình đất nung tráng men rạn, khăn lau đất sét",
    philosophy: "Đất sét phải chịu đau đớn qua bàn xoay và lửa đỏ nghìn độ mới hóa thành ngọc men rạn",
    palette: {
      skin: "#DDA15E",
      skinShadow: "#B87F3B",
      hair: "#2E241E",
      outfitBase: "#BC6C25", // Đất nung Terracotta
      outfitShadow: "#8C4D15",
      accent: "#2EC4B6", // Men ngọc rạn Celadon
      pantsOrSkirt: "#4A3F35",
      footwear: "#2E241E",
    },
    aiPromptSnippet:
      "focused Vietnamese master potter, clay-stained hands shaping ceramic vase on wooden pottery wheel, terracotta work clothes #BC6C25, kilns glowing in background with celadon glaze pots",
  },

  waitingWoman: {
    id: "waitingWoman",
    nameVi: "Người Đàn Bà Tựa Cửa / Bến Bình Yên",
    nameEn: "The Harbor Woman / The Safe Haven",
    stage: "adulthood",
    series: ["doi-nguoi", "y-nghia"],
    role: "Điểm tựa tĩnh lặng, biểu tượng của tình yêu thương thầm lặng đợi người trở về",
    ageRange: "28 – 35 tuổi",
    headRatio: 6.4,
    build: "Dịu dàng, đôn hậu, ánh mắt sâu thẳm nhìn ra con ngõ nhỏ",
    signatureProp: "Chiếc khăn choàng len màu cát, ngọn đèn bão đặt bên bậu cửa",
    philosophy: "Mọi con thuyền dù đi xa vạn dặm cũng luôn cần một ngọn đèn thầm lặng dẫn lối về nhà",
    palette: {
      skin: "#F5D4BC",
      skinShadow: "#D4A587",
      hair: "#1E1A17",
      outfitBase: "#506169", // Xanh lam khói mộc
      outfitShadow: "#354248",
      accent: "#E9C46A", // Ánh đèn vàng ấm
      pantsOrSkirt: "#EFE8DC",
      footwear: "#4A3B32",
    },
    aiPromptSnippet:
      "gentle Vietnamese woman standing beside wooden doorway in evening light, holding warm oil lantern, wearing soft dusty slate linen tunic #506169, sand-colored shawl, tender longing expression",
  },

  // =========================================================================
  // GIAI ĐOẠN 4: TRUNG NIÊN & SỰ THẤU HIỂU VÔ THƯỜNG (MIDLIFE & ACCEPTANCE)
  // =========================================================================

  ferryman: {
    id: "ferryman",
    nameVi: "Người Chở Đò Thời Gian",
    nameEn: "The Ferryman of Time",
    stage: "midlife",
    series: ["doi-nguoi", "y-nghia"],
    role: "Đại diện cho dòng chảy vô thường, đưa người qua những bước ngoặt số phận",
    ageRange: "45 – 55 tuổi",
    headRatio: 6.5,
    build: "Vai ngang vững chắc, dáng đứng chống sào khoan thai giữa đầu sóng",
    signatureProp: "Cây sào tre dài mộc mạc, chiếc nón lá cũ mòn vành, áo tơi lá cọ",
    philosophy: "Nước sông chảy mãi không ngừng, người qua đò ghé lại rồi đi, chỉ có dòng sông ở lại",
    palette: {
      skin: "#C68B59",
      skinShadow: "#9E6534",
      hair: "#4A4744", // Tóc hoa râm
      outfitBase: "#4A5866", // Xanh chàm đá
      outfitShadow: "#2F3942",
      accent: "#7A5C43", // Nâu sào tre
      pantsOrSkirt: "#282B30",
      footwear: "#C68B59", // Chân trần bám ván thuyền
    },
    aiPromptSnippet:
      "weather-beaten Vietnamese ferryman holding long bamboo pole on wooden sampan, peppered grey hair, conical hat tilted back, indigo storm tunic #4A5866, calm knowing eyes amid morning mist",
  },

  lamplighter: {
    id: "lamplighter",
    nameVi: "Người Thắp Đèn Đêm",
    nameEn: "The Midnight Lamplighter",
    stage: "midlife",
    series: ["y-nghia"],
    role: "Người thắp sáng những góc khuất tăm tối nơi phố thị và tâm hồn",
    ageRange: "42 – 50 tuổi",
    headRatio: 6.5,
    build: "Dáng người kiên nhẫn, bước đi thong thả mang theo cây đóm lửa",
    signatureProp: "Cây sào dài gắn móc châm lửa, chiếc lồng đèn bão bằng đồng cổ",
    philosophy: "Đừng nguyền rủa bóng đêm; hãy thầm lặng thắp lên một ngọn đèn dù nhỏ nhoi",
    palette: {
      skin: "#DDA15E",
      skinShadow: "#B47C3B",
      hair: "#2A2725",
      outfitBase: "#23304A", // Xanh đêm
      outfitShadow: "#141D2E",
      accent: "#FFD166", // Ngọn lửa vàng rực
      pantsOrSkirt: "#3A3A3C",
      footwear: "#201A15",
    },
    aiPromptSnippet:
      "humble Vietnamese municipal lamplighter lifting long brass pole to ignite vintage gas streetlamp in blue twilight alley, wearing deep midnight blue coat #23304A, golden flame catching spectacles",
  },

  lighthouseKeeper: {
    id: "lighthouseKeeper",
    nameVi: "Người Giữ Hải Đăng Cô Độc",
    nameEn: "The Solitary Lighthouse Keeper",
    stage: "midlife",
    series: ["dung-day", "y-nghia"],
    role: "Ngọn hải đăng tĩnh lặng định vị cho những con tàu lạc lối giữa bão dữ",
    ageRange: "48 – 58 tuổi",
    headRatio: 6.7,
    build: "Vững chãi như đá tảng, đôi mắt tinh anh nhìn thấu đêm bão trùng khơi",
    signatureProp: "Ống nhòm đồng, sổ hải trình bạc màu, áo khoác len thô cổ cao",
    philosophy: "Giá trị của sự cô đơn là giữ cho ngọn đèn luôn cháy để người khác không bị đắm tàu",
    palette: {
      skin: "#C28555",
      skinShadow: "#985F33",
      hair: "#706E6B", // Tóc muối tiêu bạc nhiều
      outfitBase: "#1D2D44", // Xanh hải quân sẫm
      outfitShadow: "#0F1A28",
      accent: "#E9C46A", // Tia sáng hải đăng
      pantsOrSkirt: "#2B2D42",
      footwear: "#1B1C22",
    },
    aiPromptSnippet:
      "rugged Vietnamese lighthouse keeper standing on spiral balcony high above churning dark ocean waves, wearing heavy navy fisherman sweater #1D2D44, sweeping golden beam cutting through rain storm",
  },

  fisherman: {
    id: "fisherman",
    nameVi: "Người Kéo Lưới Sớm",
    nameEn: "The Early Dawn Fisherman",
    stage: "midlife",
    series: ["doi-nguoi", "dung-day"],
    role: "Sự kiên nhẫn đối thoại cùng biển cả và đón nhận những gì thiên nhiên ban tặng",
    ageRange: "40 – 52 tuổi",
    headRatio: 6.6,
    build: "Gân guốc, cơ bắp cuộn sóng theo nhịp quăng chài, nước da nâu đỏ vị muối",
    signatureProp: "Mẻ lưới tròn tung bay như cánh quạt, chiếc thuyền nan mũi cong",
    philosophy: "Kéo lưới không chỉ mong cá đầy khoang; kéo lưới là kéo lên niềm tin vào ngày mai",
    palette: {
      skin: "#B87545",
      skinShadow: "#8C5229",
      hair: "#23211F",
      outfitBase: "#7A5C43", // Nâu bùn đất mộc
      outfitShadow: "#533D2B",
      accent: "#00F5D4", // Bọt sóng biển sớm
      pantsOrSkirt: "#3E342D",
      footwear: "#B87545", // Chân trần
    },
    aiPromptSnippet:
      "masterful Vietnamese fisherman casting wide circular net at sunrise, net blooming like giant translucent flower over glittering gold sea, muscular silhouette, salty ocean spray",
  },

  // =========================================================================
  // GIAI ĐOẠN 5: LÃO NIÊN & CỘI NGUỒN BẤT DIỆT (ELDERLY & ANCESTRY)
  // =========================================================================

  elder: {
    id: "elder",
    nameVi: "Bậc Trưởng Thượng / Người Đi Qua Năm Tháng",
    nameEn: "The Wise Elder / Grandmother",
    stage: "elderly",
    series: ["doi-nguoi"],
    role: "Đại diện cho cội nguồn, thời gian, sự tha thứ và lòng bao dung của đất mẹ",
    ageRange: "68 – 78 tuổi",
    headRatio: 5.8,
    build: "Lưng hơi còng, bước chân chậm rãi an nhiên, khuôn mặt đầy nếp nhăn nhân từ",
    signatureProp: "Áo bà ba / áo chàm bạc màu thời gian, khăn rằn mộc, gậy tre mộc",
    philosophy: "Mọi hận thù, danh vọng rồi cũng trôi xuôi; chỉ có tình yêu thương ở lại sau cùng",
    palette: {
      skin: "#DFB892",
      skinShadow: "#BA8C64",
      hair: "#E2E2E2", // Tóc bạc trắng như mây
      outfitBase: "#5C4A3A", // Nâu đất già
      outfitShadow: "#3C2F24",
      accent: "#A68A72", // Màu khói bếp
      pantsOrSkirt: "#282420",
      footwear: "#3E352B", // Dép quai mộc
    },
    aiPromptSnippet:
      "venerable elderly Vietnamese grandmother, gentle wrinkles around smiling eyes, white hair tied neatly, wearing faded indigo brown linen tunic #5C4A3A, earthy hand-woven scarf, serene timeless warmth",
  },

  forestElder: {
    id: "forestElder",
    nameVi: "Ông Lão Trồng Rừng",
    nameEn: "The Forest Planter",
    stage: "elderly",
    series: ["dung-day", "doi-nguoi"],
    role: "Biểu tượng của sự hy sinh vô điều kiện cho thế hệ mai sau",
    ageRange: "70 – 80 tuổi",
    headRatio: 6.0,
    build: "Lưng còng nhưng đôi chân vững như rễ si, nụ cười hiền hậu giữa đại ngàn",
    signatureProp: "Gùi tre đựng cây non trên lưng, chiếc gậy mộc, nón mê rách",
    philosophy: "Ý nghĩa cuộc đời là trồng những cái cây mà chính mình biết sẽ không kịp ngồi dưới bóng mát",
    palette: {
      skin: "#BA845A",
      skinShadow: "#905E38",
      hair: "#F0F0F0", // Tóc râu bạc phơ
      outfitBase: "#6B7A4B", // Vải chàm pha rêu
      outfitShadow: "#485332",
      accent: "#D9622B", // Quả rừng chín đỏ
      pantsOrSkirt: "#3B332B",
      footwear: "#5A4739",
    },
    aiPromptSnippet:
      "wise old Vietnamese forestry elder with flowing white beard, carrying woven bamboo basket of young saplings, climbing misty green hill slope, weathered joyful eyes, timeless environmental guardian",
  },

  woodblockCarver: {
    id: "woodblockCarver",
    nameVi: "Nghệ Nhân Mộc Bản / Kẻ Khắc Thời Gian",
    nameEn: "The Woodblock Master",
    stage: "elderly",
    series: ["nghe-thuat", "doi-nguoi"],
    role: "Người lưu giữ ký ức văn hóa, biến từng thớ gỗ thành vĩnh cửu",
    ageRange: "65 – 75 tuổi",
    headRatio: 6.0,
    build: "Dáng ngồi xếp bằng tĩnh tọa, đôi mắt sáng chăm chú soi từng đường đục",
    signatureProp: "Bộ đục thép hoa văn, khối gỗ thị đen bóng mài nhẵn, chổi quét mực tàu",
    philosophy: "Chữ khắc vào cát sẽ bị sóng cuốn; chữ khắc vào gỗ và vào lòng người sẽ sống nghìn năm",
    palette: {
      skin: "#CCA079",
      skinShadow: "#A4744E",
      hair: "#D0D0D0",
      outfitBase: "#3A3A3C", // Áo đũi xám tro
      outfitShadow: "#232325",
      accent: "#D9622B", // Mực dấu son đỏ
      pantsOrSkirt: "#1E1E1E",
      footwear: "#3A3A3C",
    },
    aiPromptSnippet:
      "elderly Vietnamese woodblock artisan carving intricate traditional typography into dark pearwood block, steel chisels, wood shavings, inkpots, quiet focused studio with morning dust particles",
  },
};
