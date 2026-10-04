#!/usr/bin/env python3
"""
scripts/generate_foley.py
Tổng hợp các âm thanh Foley & Không gian môi trường (Cinematic Ambience) tự nhiên
dành riêng cho Studio Senore bằng thuật toán âm học vật lý (Physical Modeling & Subtractive Synthesis).
100% Python Standard Library (không cần cài thêm thư viện ngoài).
"""

import os
import wave
import struct
import math
import random

SAMPLE_RATE = 44100
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "video", "public", "foley")

def clamp(v, min_v=-1.0, max_v=1.0):
    return max(min_v, min(max_v, v))

def save_wav(filename, samples, sample_rate=SAMPLE_RATE, channels=2):
    os.makedirs(OUT_DIR, exist_ok=True)
    filepath = os.path.join(OUT_DIR, filename)
    with wave.open(filepath, "w") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2) # 16-bit PCM
        wf.setframerate(sample_rate)
        
        frames = bytearray()
        for s in samples:
            if channels == 1:
                val = int(clamp(s) * 32767)
                frames.extend(struct.pack("<h", val))
            elif channels == 2:
                left, right = s
                val_l = int(clamp(left) * 32767)
                val_r = int(clamp(right) * 32767)
                frames.extend(struct.pack("<hh", val_l, val_r))
        wf.writeframes(frames)
    print(f"✓ Đã tạo hiệu ứng Foley: {filepath} ({len(samples)/sample_rate:.1f}s, {channels}ch)")

def synth_clock_tick(duration=6.0):
    """
    Tiếng đồng hồ quả lắc / cơ khí bằng gỗ (Mechanical wooden clock tick... tock...).
    Tạo xung cơ khí tiếp xúc kim loại và hộp cộng hưởng gỗ gụ (Wood resonance).
    """
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    
    tick_interval = 1.0 # 1 giây 1 nhịp tích... tắc...
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        rel_t = t % tick_interval
        is_tock = int(t / tick_interval) % 2 == 1
        
        sample_l = 0.0
        sample_r = 0.0
        
        if rel_t < 0.18:
            # Nhịp gõ đập cơ học (impact impulse)
            env_fast = math.exp(-rel_t * 90.0)
            noise_click = (random.random() * 2 - 1) * env_fast * 0.45
            
            # Tần số cộng hưởng: 'Tick' cao hơn (1180Hz & 2400Hz), 'Tock' trầm hơn (820Hz & 1650Hz)
            base_f = 820.0 if is_tock else 1180.0
            harm_f = 1650.0 if is_tock else 2420.0
            
            # Hộp cộng hưởng gỗ ngân nhẹ
            env_res = math.exp(-rel_t * 35.0)
            body = (math.sin(2 * math.pi * base_f * rel_t) * 0.5 + 
                    math.sin(2 * math.pi * harm_f * rel_t) * 0.25) * env_res
            
            # Âm bánh răng hồi chuyển (gear spring release)
            spring = math.sin(2 * math.pi * 3200 * rel_t) * math.exp(-rel_t * 120.0) * 0.15
            
            val = (noise_click + body + spring) * 0.75
            
            # Pan nhẹ sang trái/phải xen kẽ như quả lắc đung đưa
            pan = -0.15 if not is_tock else 0.15
            sample_l = val * (0.5 - pan * 0.5)
            sample_r = val * (0.5 + pan * 0.5)
            
        # Thêm tiếng sột soạt bánh răng chạy nền siêu nhỏ
        gear_murmur = (random.random() * 2 - 1) * 0.003
        samples.append((sample_l + gear_murmur, sample_r + gear_murmur))
        
    save_wav("clock_tick.wav", samples)

def synth_water_lap(duration=8.0):
    """
    Tiếng nước sông êm dịu vỗ nhẹ vào mạn thuyền gỗ (River water lapping on wooden hull).
    Mô phỏng bọt nước, sóng vỗ tầng thấp và tiếng gõ lách tách của giọt nước.
    """
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    
    # Tạo chu kỳ sóng vỗ êm: khoảng 2.5s - 3s một đợt sóng dập dềnh
    wave_period = 2.8
    
    # State cho low-pass filter
    lp_l = 0.0
    lp_r = 0.0
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        
        # Nhịp sóng dâng
        wave_phase = (t % wave_period) / wave_period
        wave_swell = math.sin(wave_phase * math.pi) ** 3
        
        # Nhiễu trắng để lọc thành tiếng nước cuộn
        white_l = random.random() * 2 - 1
        white_r = random.random() * 2 - 1
        
        # Lowpass động: tần số mở rộng khi sóng dâng vỗ vào mạn thuyền
        alpha = 0.04 + wave_swell * 0.08
        lp_l += alpha * (white_l - lp_l)
        lp_r += alpha * (white_r - lp_r)
        
        # Âm vỗ mạn thuyền gỗ (thump trầm 90Hz) khi đỉnh sóng chạm mạn
        thump_env = max(0.0, math.sin(wave_phase * math.pi * 2 - 0.5)) ** 8
        hull_thump = math.sin(2 * math.pi * 92.0 * t) * thump_env * 0.22
        
        # Các giọt nước lách tách ngẫu nhiên (water droplets)
        drop = 0.0
        if random.random() < 0.003 * (0.5 + wave_swell):
            drop_f = random.uniform(1400, 2800)
            drop = math.sin(2 * math.pi * drop_f * t) * 0.15
            
        total_l = (lp_l * 0.45 * (0.6 + wave_swell * 0.8) + hull_thump * 0.8 + drop) * 0.65
        total_r = (lp_r * 0.45 * (0.6 + wave_swell * 0.8) + hull_thump * 0.6 + drop * 0.8) * 0.65
        
        samples.append((total_l, total_r))
        
    save_wav("water_lap.wav", samples)

def synth_wind_howl(duration=8.0):
    """
    Tiếng gió hú lạnh và rền rĩ trước cơn bão (Ominous storm wind howl & low rumble).
    """
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    
    bp_state1 = 0.0
    bp_state2 = 0.0
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        
        # Tần số hú của gió biến thiên từ từ (400Hz - 750Hz)
        howl_freq = 460.0 + math.sin(t * 0.8) * 160.0 + math.sin(t * 2.1) * 80.0
        howl_amp = (math.sin(t * 0.9) * 0.5 + 0.5) ** 2 * 0.28
        howl = math.sin(2 * math.pi * howl_freq * t) * howl_amp
        
        # Rền hạ âm mặt đất / bão lũ (55Hz - 85Hz)
        rumble = (math.sin(2 * math.pi * 58.0 * t) * 0.6 + 
                  math.sin(2 * math.pi * 74.0 * t) * 0.4) * (0.18 + math.sin(t * 1.5) * 0.1)
        
        # Tiếng gió rít xào xạc (bandpass noise)
        white = random.random() * 2 - 1
        bp_state1 += 0.05 * (white - bp_state1)
        bp_state2 += 0.08 * (bp_state1 - bp_state2)
        wind_breath = bp_state2 * 0.35 * (0.5 + howl_amp * 2.0)
        
        total = (howl + rumble + wind_breath) * 0.6
        # Stereo drift
        drift = math.sin(t * 0.5) * 0.2
        samples.append((total * (0.5 - drift), total * (0.5 + drift)))
        
    save_wav("wind_howl.wav", samples)

def synth_rain_roof(duration=8.0):
    """
    Tiếng mưa rào rơi trên mái ngói / mái hiên gỗ (Gentle rain patter on roof).
    """
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    
    smooth_l = 0.0
    smooth_r = 0.0
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        
        # Mưa rào có cấu trúc ngẫu nhiên dày đặc
        n_l = (random.random() * 2 - 1)
        n_r = (random.random() * 2 - 1)
        
        smooth_l += 0.12 * (n_l - smooth_l)
        smooth_r += 0.12 * (n_r - smooth_r)
        
        # Những hạt mưa đập tí tách vào mái ngói (droplets on tile)
        patter_l = 0.0
        patter_r = 0.0
        if random.random() < 0.018:
            drop_f = random.uniform(2200, 3800)
            patter_l = math.sin(2 * math.pi * drop_f * t) * 0.12
        if random.random() < 0.018:
            drop_f = random.uniform(2000, 3600)
            patter_r = math.sin(2 * math.pi * drop_f * t) * 0.12
            
        l = (smooth_l * 0.25 + patter_l) * 0.55
        r = (smooth_r * 0.25 + patter_r) * 0.55
        samples.append((l, r))
        
    save_wav("rain_roof.wav", samples)

def synth_page_turn():
    """
    Tiếng lật một trang sổ tay giấy thô (Crisp papercraft page rustle & turn).
    """
    duration = 1.2
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Envelope dạng chuông lệch (nhanh lúc nhấc trang, kéo nhẹ lúc đặt xuống)
        if t < 0.15:
            env = (t / 0.15) ** 2
        elif t < 0.45:
            env = 1.0 - (t - 0.15) / 0.3 * 0.4
        else:
            env = max(0.0, 0.6 * (1.0 - (t - 0.45) / 0.75) ** 3)
            
        noise = (random.random() * 2 - 1)
        # Bộ lọc sột soạt giấy xốp
        f_mid = math.sin(2 * math.pi * 3400 * t) * 0.3
        val = (noise * 0.6 + f_mid * 0.4) * env * 0.45
        samples.append((val * 0.9, val * 1.1))
        
    save_wav("page_turn.wav", samples)

def synth_gentle_sigh():
    """
    Tiếng thở dài / lấy hơi nhẹ thanh thản trước câu hát (Gentle atmospheric breath).
    """
    duration = 2.0
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    
    lp = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Khởi đầu chậm, đỉnh ở 0.8s, tan dần ở 2.0s
        env = math.sin((t / duration) * math.pi) ** 2
        noise = random.random() * 2 - 1
        lp += 0.03 * (noise - lp)
        val = lp * env * 0.28
        samples.append((val, val))
        
    save_wav("gentle_sigh.wav", samples)

if __name__ == "__main__":
    print("🎨 Senore Foley Synthesizer khởi động...")
    synth_clock_tick()
    synth_water_lap()
    synth_wind_howl()
    synth_rain_roof()
    synth_page_turn()
    synth_gentle_sigh()
    print("✨ Hoàn tất tạo toàn bộ thư viện âm thanh môi trường chuẩn Studio!")
