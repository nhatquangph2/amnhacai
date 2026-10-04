#!/usr/bin/env python3
"""🏛️ SENORE STUDIO ATLAS — CLI Tra Cứu & Khởi Tạo Thư Viện Tài Nguyên Sản Xuất.

Cho phép tra cứu tức thì 22 hình mẫu nhân vật, 15 bối cảnh đa tầng Parallax,
hệ thống ống kính điện ảnh và trích xuất Prompt AI chuẩn cho các bài hát mới.

Ví dụ sử dụng:
    python3 scripts/studio_atlas.py list
    python3 scripts/studio_atlas.py char seeker
    python3 scripts/studio_atlas.py char innerChild --prompt
    python3 scripts/studio_atlas.py env solitaryHill
    python3 scripts/studio_atlas.py env stonePier --foley
    python3 scripts/studio_atlas.py colors
"""

import argparse
import sys
from pathlib import Path

# Thư mục gốc
ROOT = Path(__file__).resolve().parent.parent

# Dữ liệu 22 Hình mẫu Nhân vật Cốt lõi
CHARACTERS = {
    "innerChild": {
        "name": "Đứa Trẻ Bên Trong (The Inner Child)",
        "stage": "Tuổi Thơ (Childhood)",
        "series": "Cả 4 series",
        "head_ratio": 4.2,
        "build": "Nhỏ nhắn, hoạt bát, đầu to tròn đáng yêu",
        "prop": "Khăn len đỏ Ember tung bay dài sau lưng, áo len ngọc bích",
        "philosophy": "Hoa tiêu tâm hồn: Sự nguyên sơ, lòng dũng cảm nguyên bản, không biết sợ trước bão giông",
        "palette": {
            "Áo len": "#2EC4B6 (Turquoise)",
            "Khăn quàng": "#D9622B (Ember Red)",
            "Quần yếm": "#E9C46A (Mustard Yellow)",
            "Ủng": "#F4A261 (Warm Orange)",
            "Da": "#FAD4C0",
        },
        "prompt": "spirited 8yo Vietnamese child, bright joyful eyes, short chestnut hair, wearing turquoise knit sweater #2EC4B6, flying long ember red woolen scarf #D9622B, mustard yellow shorts #E9C46A, warm orange rain boots, studio ghibli gouache style",
    },
    "seeker": {
        "name": "Người Kiếm Tìm (The Seeker / Contemplative Adult)",
        "stage": "Trưởng Thành (Adulthood)",
        "series": "dung-day, doi-nguoi",
        "head_ratio": 6.8,
        "build": "Dáng cao gầy, vai hơi chùng vì mỏi mệt, bước đi chậm rãi",
        "prop": "Áo măng-tô xanh thẫm, cuốn sổ tay nhét túi, đôi mắt xa xăm",
        "philosophy": "Sau tất cả va đập cuộc sống, dũng khí lớn nhất là hòa giải với đứa trẻ trong lòng",
        "palette": {
            "Áo khoác": "#2A4B6E (Slate Blue)",
            "Áo len lót": "#EFE8DC (Old Paper)",
            "Quần": "#2B2D42 (Charcoal Dark)",
            "Giày da": "#4A3525 (Worn Leather)",
            "Da": "#F2CEB6",
        },
        "prompt": "Vietnamese contemplative 30yo man, slender build, messy black hair, tired but resolute eyes, wearing long slate blue wool coat #2A4B6E over cream knit turtleneck #EFE8DC, dark charcoal trousers #2B2D42, worn brown leather boots",
    },
    "writer": {
        "name": "Người Viết Đêm (The Midnight Writer / Philosopher)",
        "stage": "Trưởng Thành (Adulthood)",
        "series": "y-nghia",
        "head_ratio": 6.5,
        "build": "Dáng ngồi thẳng, bàn tay thon dài cầm bút mực, cử chỉ tiết chế",
        "prop": "Kính tròn đồng cổ, sổ tay da cũ, bút máy mực đen, ngọn nến",
        "philosophy": "Viết không phải để khoe chữ, mà để thắp một que diêm nhỏ giữa đêm đen nhân thế",
        "palette": {
            "Áo len": "#23304A (Night Blue)",
            "Quần": "#3A3A3C (Stone Dark)",
            "Điểm nhấn": "#D9622B (Ember Candle)",
            "Bàn gỗ": "#2A231C",
        },
        "prompt": "quiet Vietnamese writer sitting at wooden desk, round vintage spectacles, wearing midnight blue oversized cardigan #23304A, holding fountain pen, writing in aged paper journal, warm candle light glow",
    },
    "elder": {
        "name": "Bậc Trưởng Thượng (The Wise Elder / Grandmother)",
        "stage": "Lão Niên (Elderly)",
        "series": "doi-nguoi",
        "head_ratio": 5.8,
        "build": "Lưng hơi còng, bước chân chậm rãi an nhiên, khuôn mặt đầy nếp nhăn nhân từ",
        "prop": "Áo bà ba chàm bạc màu, khăn rằn mộc, nón lá, gậy tre",
        "philosophy": "Mọi danh vọng rồi cũng trôi xuôi; chỉ có tình yêu thương ở lại sau cùng",
        "palette": {
            "Áo chàm": "#5C4A3A (Faded Indigo Brown)",
            "Khăn rằn": "#A68A72 (Hearth Smoke)",
            "Tóc": "#E2E2E2 (Cloud White)",
            "Quần": "#282420",
        },
        "prompt": "venerable elderly Vietnamese grandmother, gentle wrinkles around smiling eyes, white hair tied neatly, wearing faded indigo brown linen tunic #5C4A3A, earthy hand-woven scarf, serene timeless warmth",
    },
    "gardener": {
        "name": "Người Gieo Hạt (The Seed Sower / Caretaker)",
        "stage": "Trưởng Thành (Adulthood)",
        "series": "dung-day, nghe-thuat",
        "head_ratio": 6.6,
        "build": "Khỏe khoắn, dẻo dai, bàn tay thô ráp quen chạm vào bùn đất",
        "prop": "Túi hạt giống vải bố, xẻng con, bình tưới đồng cổ",
        "philosophy": "Hạt giống chôn vùi trong bóng tối không phải để chết đi, mà để bắt đầu nảy mầm",
        "palette": {
            "Áo thô": "#7A5C43 (Earth Brown)",
            "Khăn": "#6B7A4B (Moss Green)",
            "Quần": "#473C35",
        },
        "prompt": "humble Vietnamese gardener, earth-toned canvas work shirt #7A5C43, rolled sleeves, canvas pouch of seeds, kneeling gently on fertile soil, touching green sprout with moss green scarf #6B7A4B",
    },
    "cartographer": {
        "name": "Người Vẽ Bản Đồ (The Cartographer / Explorer)",
        "stage": "Thiếu Niên (Youth)",
        "series": "nghe-thuat, dung-day",
        "head_ratio": 6.4,
        "build": "Thanh thoát, bước đi nhanh nhẹn, tư thế vươn về phía trước",
        "prop": "Sổ phác thảo, la bàn đồng, túi da đeo chéo đựng bản đồ cuộn",
        "philosophy": "Bản đồ không phải thế giới có sẵn; bản đồ là thứ ta tự vẽ bằng chính bước chân mình",
        "palette": {
            "Áo khoác": "#E9C46A (Amber Yellow)",
            "Quần": "#4A5568 (Lead Slate)",
            "La bàn": "#D4AF37",
        },
        "prompt": "adventurous 20yo Vietnamese cartographer girl, short bob hair with headband, wearing amber yellow explorer jacket #E9C46A, brass compass, leather satchel with rolled parchment maps",
    },
    "builder": {
        "name": "Người Dựng Xây (The Builder / Iron Worker)",
        "stage": "Trưởng Thành (Adulthood)",
        "series": "dung-day",
        "head_ratio": 7.0,
        "build": "Vạm vỡ, vai rộng, bắp tay cuồn cuộn gân guốc",
        "prop": "Dải vải đỏ buộc cổ tay, búa gỗ, hộp đồ nghề sắt, xe đạp chở đồ",
        "philosophy": "Khi bão giông ập đến, kẻ hèn nhát chạy trốn, người dũng cảm đứng lại dựng giàn chống",
        "palette": {
            "Áo gile": "#9C4124 (Rust Red)",
            "Dải cổ tay": "#D9622B (Ember)",
            "Quần bảo hộ": "#2D3748",
        },
        "prompt": "strong Vietnamese builder, athletic broad-shouldered build, rust red heavy-duty canvas vest #9C4124, crimson wristband, tool belt, rugged hands holding wooden beams against wind",
    },
    "artist": {
        "name": "Người Dệt Ánh Sáng (The Light Weaver / Painter)",
        "stage": "Thiếu Niên (Youth)",
        "series": "nghe-thuat",
        "head_ratio": 6.2,
        "build": "Nhẹ nhàng, bay bổng, cử chỉ như đang nhảy múa cùng màu sắc",
        "prop": "Lăng kính màu khúc xạ ánh sáng, cọ vẽ lông mềm, bảng pha màu",
        "philosophy": "Nghệ thuật không tô vẽ sự hoàn hảo; nghệ thuật là tìm thấy sự thiêng liêng nơi rạn nứt",
        "palette": {
            "Váy mộc": "#6B7A4B (Moss Green)",
            "Lăng kính": "#9D4EDD (Prism Violet)",
            "Tạp dề": "#EFE8DC (Old Paper)",
        },
        "prompt": "poetic 21yo Vietnamese girl artist, paint marks on linen apron, wearing moss green dress #6B7A4B, holding glass prism scattering rainbow caustics across old wall",
    },
}

# Dữ liệu 15 Bối Cảnh Điện Ảnh Đa Tầng
ENVIRONMENTS = {
    "stonePier": {
        "name": "Bến Sông & Cầu Đá Cổ (Ancient Stone Pier)",
        "zone": "Sông Nước (Aquatic)",
        "focal": "35mm Narrative",
        "metaphor": "Nơi dừng chân đối diện dòng đời, điểm hẹn và chia tay",
        "palette": ["#8EA8C3", "#4A5866", "#7A5C43", "#FAF6EE"],
        "lighting": "5000K Ban mai sương sông khuếch tán",
        "parallax": {
            "foreground": "Lau sậy đung đưa, dây thừng neo thuyền buộc cọc gỗ",
            "midground": "Cầu đá vòm rêu phong, bậc thềm đá ướt, con thuyền gỗ",
            "background": "Bờ sông bên kia trong khói lam chiều, hàng tre nghiêng",
            "skybox": "Bầu trời ửng hồng qua màn sương mỏng",
        },
        "foley": [
            "Sóng vỗ mạn thuyền gỗ bì bõm",
            "Bước chân gõ trên mặt cầu đá rêu",
            "Gió sông sớm xào xạc qua rặng lau sậy",
        ],
        "prompt": "ancient Vietnamese stone bridge arching over tranquil misty river, mossy stone pier, wooden steps, delicate reed grass, papercraft gouache texture, soft morning fog, 16:9 widescreen",
    },
    "solitaryHill": {
        "name": "Đồi Gió Đơn Độc & Cây Đại Thụ (The Solitary Hill of Resilience)",
        "zone": "Vùng Cao (Highlands)",
        "focal": "24mm Ultra-Wide",
        "metaphor": "Biểu tượng sống còn của Senore: Bão không quật ngã, bão lay rễ sâu",
        "palette": ["#1D2D44", "#0D1B2A", "#7077A1", "#00F5D4"],
        "lighting": "8000K Sấm chớp giật cục (Strobe Lightning)",
        "parallax": {
            "foreground": "Đá nứt nẻ, cỏ úa rạp mình sát đất theo chiều gió",
            "midground": "Cây đại thụ uốn mình chống bão, bóng người khăn đỏ đứng vững",
            "background": "Dãy núi đen cuộn sóng chìm trong mưa trắng xóa",
            "skybox": "Mây xoáy đen đặc, sấm chớp xé toạc chân trời",
        },
        "foley": [
            "Tiếng gió bão gầm rú rít từng cơn lạnh buốt",
            "Tiếng sấm nổ đùng đoàng rung chuyển mặt đất",
            "Tiếng cành cây cọ xát ken két kiên cường",
        ],
        "prompt": "solitary massive ancient tree enduring catastrophic mountain thunderstorm, deep roots anchored into bedrock, dramatic lightning flash, ember red leaf swirling, epic cinematic power",
    },
    "mirrorLake": {
        "name": "Hồ Ký Ức Đen & Biển Sao Ngân Hà (Abyssal Star-Mirror Lake)",
        "zone": "Siêu Thực (Surreal)",
        "focal": "35mm Narrative",
        "metaphor": "Tầng sâu vô thức, soi chiếu tổn thương, thanh tẩy tâm hồn",
        "palette": ["#0B132B", "#06D6A0", "#1C2541", "#FAF6EE"],
        "lighting": "2400K Phát quang sinh học (Bioluminescence) & ánh sao",
        "parallax": {
            "foreground": "Gợn sóng lăn tăn quanh mũi thuyền gỗ mộc đang đứng yên",
            "midground": "Hai nhân vật ngồi tĩnh lặng, giọt lệ rơi tạo vòng sóng ánh sáng",
            "background": "Rặng thông đen tuyền in bóng sắc nét xuống mặt nước",
            "skybox": "Dải Ngân Hà rực rỡ muôn triệu vì sao phản chiếu dưới đáy hồ",
        },
        "foley": [
            "Khoảng lặng âm thanh tĩnh mịch tuyệt đối (Absolute Silence)",
            "Tiếng giọt nước tí tách rơi vang vọng ngân dài",
            "Tiếng gió thoảng nhẹ qua rặng thông đêm",
        ],
        "prompt": "deep obsidian mirror lake at midnight reflecting cosmic starry galaxy, silhouette pine trees, small wooden boat floating, bioluminescent turquoise water ripples blooming from center",
    },
    "riversideHearth": {
        "name": "Ngôi Làng Ven Suối & Bếp Lửa Quê (Riverside Village & Hearth)",
        "zone": "Làng Quê (Rural)",
        "focal": "50mm Human Eye",
        "metaphor": "Hạnh phúc giản đơn, cội nguồn bình yên nguyên sơ",
        "palette": ["#FAF0CA", "#DDA15E", "#BC6C25", "#7A5C43"],
        "lighting": "2200K Bếp lửa ấm cúng hắt ra từ hiên nhà",
        "parallax": {
            "foreground": "Giàn mướp hoa vàng rủ xuống hiên nhà, chõng tre",
            "midground": "Bàn ăn gỗ bên hiên với hai bát cơm nóng bốc khói",
            "background": "Dòng suối trong vắt uốn lượn sau vườn, rặng cau thẳng",
            "skybox": "Bầu trời chiều chuyển từ vàng mơ sang tím sẫm",
        },
        "foley": [
            "Tiếng suối reo róc rách thanh bình",
            "Tiếng củi khô nổ lách tách trong bếp",
            "Tiếng trẻ con gọi nhau về ăn cơm từ xa",
        ],
        "prompt": "cozy Vietnamese countryside wooden cottage at dusk, thatch roof with blue kitchen smoke curling up, warm lantern light through window, steaming rice bowls on porch table",
    },
}

COLOR_PRESETS = [
    ("STORM_RESOLVE", "8000K", "#1D2D44 · #0D1B2A · #7077A1 · #00F5D4", "Bão giông, căng thẳng, kiên cường đối mặt"),
    ("MIST_SOLITUDE", "6500K", "#B8C5D0 · #4A5866 · #212930 · #6B8294", "Sương xám lạnh, cô đơn, bế tắc phố thị"),
    ("RIVER_DAWN", "5000K", "#8EA8C3 · #4A5866 · #7A5C43 · #FAF6EE", "Ban mai sông sương, nhen nhóm hy vọng"),
    ("GOLDEN_WONDER", "3500K", "#48CAE4 · #FFD166 · #06D6A0 · #0096C7", "Vàng mật ong, thức tỉnh, mộng tưởng diệu kỳ"),
    ("SUNSET_LIBERATION", "2800K", "#D9622B · #9D4EDD · #F4A261 · #FFE5B4", "Cam Ember & Tím hoàng hôn, thanh thản hòa giải"),
    ("HEARTH_WARMTH", "2200K", "#FAF0CA · #DDA15E · #BC6C25 · #7A5C43", "Bếp lửa quê, cội nguồn bình yên, chở che"),
]


def print_list():
    print("\n🏛️  DANH MỤC THƯ VIỆN SENORE STUDIO ATLAS")
    print("=" * 60)
    print("\n👥  NHÂN VẬT CỐT LÕI (22 Archetypes):")
    for k, v in CHARACTERS.items():
        print(f"  • {k:<18} : {v['name']} ({v['stage']})")

    print("\n🏞️  BỐI CẢNH ĐIỆN ẢNH (15 Environments):")
    for k, v in ENVIRONMENTS.items():
        print(f"  • {k:<18} : {v['name']} [{v['zone']}]")

    print("\n🎨  PRESET MÀU & ÁNH SÁNG CẢM XÚC (Ralph Eggleston):")
    for p, k, hexes, mood in COLOR_PRESETS:
        print(f"  • {p:<18} [{k:<5}] : {mood}")
    print()


def print_character(key: str, show_prompt_only: bool = False):
    c = CHARACTERS.get(key)
    if not c:
        print(f"❌ Không tìm thấy nhân vật '{key}'. Gõ `python3 scripts/studio_atlas.py list` để xem danh sách.")
        return 1

    if show_prompt_only:
        print(c["prompt"])
        return 0

    print(f"\n👤 HỒ SƠ NHÂN VẬT: {c['name']}")
    print("=" * 60)
    print(f"• Vòng đời (Stage)   : {c['stage']}")
    print(f"• Series phù hợp     : {c['series']}")
    print(f"• Tỷ lệ đầu (Head)   : {c['head_ratio']} đầu")
    print(f"• Dáng người         : {c['build']}")
    print(f"• Vật nhận diện      : {c['prop']}")
    print(f"• Triết lý nhân vật  : {c['philosophy']}")
    print("\n🎨 BẢNG MÃ MÀU HEX CHUẨN:")
    for part, hex_code in c["palette"].items():
        print(f"  - {part:<16} : {hex_code}")
    print("\n📋 PROMPT BLUEPRINT (MIDJOURNEY / COMFYUI):")
    print(f"  \"{c['prompt']}\"")
    print()
    return 0


def print_environment(key: str, show_foley: bool = False):
    e = ENVIRONMENTS.get(key)
    if not e:
        print(f"❌ Không tìm thấy bối cảnh '{key}'. Gõ `python3 scripts/studio_atlas.py list` để xem danh sách.")
        return 1

    print(f"\n🏞️ BỐI CẢNH ĐIỆN ẢNH: {e['name']}")
    print("=" * 60)
    print(f"• Vùng địa lý        : {e['zone']}")
    print(f"• Ống kính tối ưu    : {e['focal']}")
    print(f"• Ý nghĩa ẩn dụ      : {e['metaphor']}")
    print(f"• Ánh sáng           : {e['lighting']}")
    print(f"• Bảng mã 4 màu      : {' · '.join(e['palette'])}")

    print("\n🎭 KIẾN TRÚC THỊ SAI 4 LỚP (PARALLAX LAYERS):")
    print(f"  [1. Tiền cảnh / Foreground] : {e['parallax']['foreground']}")
    print(f"  [2. Trung cảnh / Midground] : {e['parallax']['midground']}")
    print(f"  [3. Hậu cảnh / Background] : {e['parallax']['background']}")
    print(f"  [4. Vòm trời / Skybox]     : {e['parallax']['skybox']}")

    if show_foley:
        print("\n🔊 TIẾNG ĐỘNG MÔI TRƯỜNG FOLEY (SOUND DESIGN):")
        for f in e["foley"]:
            print(f"  • {f}")

    print("\n📋 PROMPT BLUEPRINT:")
    print(f"  \"{e['prompt']}\"")
    print()
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="command")

    sub.add_parser("list", help="Liệt kê toàn bộ danh mục nhân vật, bối cảnh và màu sắc")

    p_char = sub.add_parser("char", help="Tra cứu hồ sơ nhân vật")
    p_char.add_argument("name", help="Mã nhân vật, vd: seeker, innerChild, writer, elder")
    p_char.add_argument("--prompt", action="store_true", help="Chỉ in chuỗi prompt AI")

    p_env = sub.add_parser("env", help="Tra cứu bối cảnh điện ảnh")
    p_env.add_argument("name", help="Mã bối cảnh, vd: stonePier, solitaryHill, mirrorLake")
    p_env.add_argument("--foley", action="store_true", help="Hiển thị chi tiết âm thanh Foley")

    sub.add_parser("colors", help="Liệt kê toàn bộ preset Color Script")

    args = p.parse_args()
    if not args.command or args.command == "list":
        print_list()
    elif args.command == "char":
        return print_character(args.name, args.prompt)
    elif args.command == "env":
        return print_environment(args.name, args.foley)
    elif args.command == "colors":
        print("\n🎨 PRESET MÀU & ÁNH SÁNG CẢM XÚC CHUẨN SENORE:")
        print("=" * 60)
        for p, k, hexes, mood in COLOR_PRESETS:
            print(f"• {p:<18} [{k:<5}] : {hexes}")
            print(f"  ➔ Tâm trạng: {mood}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
