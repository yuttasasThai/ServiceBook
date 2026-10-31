import React from 'react';
import { GlobalThemeSettings } from '../types';

interface CircuitWatermarkProps {
  theme: GlobalThemeSettings;
}

/**
 * ลายน้ำพื้นหลังสัญลักษณ์ทางไฟฟ้าและอิเล็กทรอนิกส์ (Schematic Watermark)
 * คมชัด ถูกต้องตามหลักวิศวกรรมไฟฟ้า ปรากฏทุกหน้าแบบบางเบา (ไม่เข้ม ไม่บดบังข้อความ)
 */
export const CircuitWatermark: React.FC<CircuitWatermarkProps> = ({ theme }) => {
  if (!theme.showCircuitWatermark) return null;

  const opacity = Math.min(Math.max(theme.watermarkOpacity ?? 0.05, 0.02), 0.15);
  const isLightTone = theme.bgTone === 'clean-light';
  const strokeColor = isLightTone ? '#0f172a' : '#38bdf8'; // Blue/Cyan neon on dark, Dark slate on light
  const goldStroke = isLightTone ? '#b45309' : '#fbbf24';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="electronic-schematic-watermark"
            width={theme.watermarkDensity === 'dense' ? '300' : theme.watermarkDensity === 'subtle' ? '500' : '380'}
            height={theme.watermarkDensity === 'dense' ? '300' : theme.watermarkDensity === 'subtle' ? '500' : '380'}
            patternUnits="userSpaceOnUse"
          >
            {/* 1. ตัวต้านทาน (Resistor /\/\/\) */}
            <g transform="translate(20, 30)">
              <line x1="0" y1="15" x2="15" y2="15" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
              <polyline
                points="15,15 19,5 27,25 35,5 43,25 51,5 59,25 63,15"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <line x1="63" y1="15" x2="78" y2="15" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
              <text x="32" y="38" fill={strokeColor} fontSize="8" fontFamily="monospace" textAnchor="middle">
                R 10kΩ
              </text>
            </g>

            {/* 2. คาปาซิเตอร์ / ตัวเก็บประจุ (Capacitor --||--) & Polarized (+ |(--) */}
            <g transform="translate(140, 25)">
              <line x1="0" y1="20" x2="18" y2="20" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="18" y1="8" x2="18" y2="32" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="24" y1="8" x2="24" y2="32" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="24" y1="20" x2="42" y2="20" stroke={strokeColor} strokeWidth="1.2" />
              <text x="21" y="42" fill={strokeColor} fontSize="8" fontFamily="monospace" textAnchor="middle">
                C 100μF
              </text>
            </g>

            {/* 3. กราวด์ไฟฟ้า (Earth Ground ⏚ & Chassis Ground) */}
            <g transform="translate(240, 30)">
              <line x1="20" y1="0" x2="20" y2="16" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="8" y1="16" x2="32" y2="16" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="21" x2="28" y2="21" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
              <line x1="16" y1="26" x2="24" y2="26" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" />
              <text x="20" y="36" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                GND
              </text>
            </g>

            {/* 4. ไดโอด (Diode -|>|-) และ แอลอีดี (LED) */}
            <g transform="translate(310, 25)">
              <line x1="0" y1="18" x2="16" y2="18" stroke={goldStroke} strokeWidth="1.2" />
              <polygon points="16,8 30,18 16,28" fill="none" stroke={goldStroke} strokeWidth="1.2" strokeLinejoin="round" />
              <line x1="30" y1="8" x2="30" y2="28" stroke={goldStroke} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="30" y1="18" x2="46" y2="18" stroke={goldStroke} strokeWidth="1.2" />
              {/* ลูกศรแสง LED */}
              <line x1="26" y1="7" x2="32" y2="1" stroke={goldStroke} strokeWidth="1" />
              <polyline points="29,1 32,1 32,4" fill="none" stroke={goldStroke} strokeWidth="1" />
              <line x1="30" y1="11" x2="36" y2="5" stroke={goldStroke} strokeWidth="1" />
              <polyline points="33,5 36,5 36,8" fill="none" stroke={goldStroke} strokeWidth="1" />
              <text x="23" y="38" fill={goldStroke} fontSize="7" fontFamily="monospace" textAnchor="middle">
                LED
              </text>
            </g>

            {/* 5. ทรานซิสเตอร์ BJT (NPN Transistor พร้อมลูกศร Emitter) */}
            <g transform="translate(40, 120)">
              {/* Base */}
              <line x1="0" y1="20" x2="16" y2="20" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="16" y1="8" x2="16" y2="32" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
              {/* Collector */}
              <line x1="16" y1="12" x2="32" y2="4" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="32" y1="4" x2="32" y2="0" stroke={strokeColor} strokeWidth="1.2" />
              {/* Emitter with Arrow */}
              <line x1="16" y1="28" x2="32" y2="36" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="32" y1="36" x2="32" y2="42" stroke={strokeColor} strokeWidth="1.2" />
              <polyline points="26,30 32,36 29,32" fill={strokeColor} stroke={strokeColor} strokeWidth="1.2" />
              <circle cx="22" cy="20" r="18" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
              <text x="22" y="49" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                NPN Q1
              </text>
            </g>

            {/* 6. ขดลวดเหนี่ยวนำ / มอเตอร์ (Inductor / Coils) */}
            <g transform="translate(160, 120)">
              <line x1="0" y1="15" x2="10" y2="15" stroke={goldStroke} strokeWidth="1.2" />
              <path
                d="M 10 15 A 6 6 0 0 1 22 15 A 6 6 0 0 1 34 15 A 6 6 0 0 1 46 15 A 6 6 0 0 1 58 15"
                fill="none"
                stroke={goldStroke}
                strokeWidth="1.2"
              />
              <line x1="58" y1="15" x2="68" y2="15" stroke={goldStroke} strokeWidth="1.2" />
              <text x="34" y="27" fill={goldStroke} fontSize="7" fontFamily="monospace" textAnchor="middle">
                L 220μH
              </text>
            </g>

            {/* 7. แหล่งจ่ายไฟกระแสสลับ (AC Sine Source ~) & สัญลักษณ์โอห์ม (Ω) */}
            <g transform="translate(280, 115)">
              <circle cx="20" cy="20" r="14" fill="none" stroke={strokeColor} strokeWidth="1.2" />
              <path
                d="M 13 20 Q 16.5 13 20 20 T 27 20"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <line x1="20" y1="6" x2="20" y2="0" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="20" y1="34" x2="20" y2="40" stroke={strokeColor} strokeWidth="1.2" />
              <text x="20" y="49" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                220VAC ~
              </text>
            </g>

            {/* 8. ไอซีชิป / ไมโครคอนโทรลเลอร์ (IC MCU DIP-8) พร้อมลายปริ้นท์ */}
            <g transform="translate(30, 215)">
              <rect x="15" y="8" width="40" height="26" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.2" />
              {/* Notch */}
              <path d="M 15 17 A 4 4 0 0 1 15 25" fill="none" stroke={strokeColor} strokeWidth="1.2" />
              {/* ขา IC 8 ขา */}
              <line x1="5" y1="12" x2="15" y2="12" stroke={strokeColor} strokeWidth="1" />
              <line x1="5" y1="17" x2="15" y2="17" stroke={strokeColor} strokeWidth="1" />
              <line x1="5" y1="22" x2="15" y2="22" stroke={strokeColor} strokeWidth="1" />
              <line x1="5" y1="27" x2="15" y2="27" stroke={strokeColor} strokeWidth="1" />

              <line x1="55" y1="12" x2="65" y2="12" stroke={strokeColor} strokeWidth="1" />
              <line x1="55" y1="17" x2="65" y2="17" stroke={strokeColor} strokeWidth="1" />
              <line x1="55" y1="22" x2="65" y2="22" stroke={strokeColor} strokeWidth="1" />
              <line x1="55" y1="27" x2="65" y2="27" stroke={strokeColor} strokeWidth="1" />

              <text x="35" y="24" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                MCU-8
              </text>
            </g>

            {/* 9. ออปแอมป์ (Op-Amp Amplifier Triangle) */}
            <g transform="translate(150, 215)">
              <polygon points="10,4 40,20 10,36" fill="none" stroke={goldStroke} strokeWidth="1.2" strokeLinejoin="round" />
              {/* Inverting (-) and Non-inverting (+) */}
              <line x1="0" y1="12" x2="10" y2="12" stroke={goldStroke} strokeWidth="1.2" />
              <text x="14" y="15" fill={goldStroke} fontSize="8" fontFamily="monospace">-</text>

              <line x1="0" y1="28" x2="10" y2="28" stroke={goldStroke} strokeWidth="1.2" />
              <text x="14" y="31" fill={goldStroke} fontSize="8" fontFamily="monospace">+</text>

              {/* Output */}
              <line x1="40" y1="20" x2="52" y2="20" stroke={goldStroke} strokeWidth="1.2" />
              <text x="25" y="44" fill={goldStroke} fontSize="7" fontFamily="monospace" textAnchor="middle">
                LM358
              </text>
            </g>

            {/* 10. ลายวงจรพิมพ์ PCB Traces & Vias (45° Route Tracks) */}
            <g transform="translate(260, 215)">
              <path
                d="M 10 35 L 35 35 L 55 15 L 85 15"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <circle cx="10" cy="35" r="3" fill="none" stroke={strokeColor} strokeWidth="1" />
              <circle cx="10" cy="35" r="1.2" fill={strokeColor} />
              <circle cx="85" cy="15" r="3" fill="none" stroke={strokeColor} strokeWidth="1" />
              <circle cx="85" cy="15" r="1.2" fill={strokeColor} />

              <path
                d="M 20 48 L 48 48 L 68 28 L 95 28"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              <circle cx="95" cy="28" r="2.5" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            </g>

            {/* 11. สัญลักษณ์หน่วยช่าง: โอห์ม (Ω), เฮิรตซ์ (Hz), โวลต์ (V) */}
            <g transform="translate(100, 310)">
              <text x="10" y="20" fill={strokeColor} fontSize="14" fontFamily="serif" fontWeight="bold">
                Ω
              </text>
              <text x="45" y="20" fill={strokeColor} fontSize="11" fontFamily="monospace">
                PWM 20kHz
              </text>
              <text x="140" y="20" fill={goldStroke} fontSize="11" fontFamily="monospace">
                +15Vcc / +5Vdd
              </text>
            </g>

            {/* 12. ลอจิกเกต (AND Gate) */}
            <g transform="translate(260, 305)">
              <path
                d="M 10 8 L 22 8 A 12 12 0 0 1 22 32 L 10 32 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.1"
              />
              <line x1="0" y1="14" x2="10" y2="14" stroke={strokeColor} strokeWidth="1" />
              <line x1="0" y1="26" x2="10" y2="26" stroke={strokeColor} strokeWidth="1" />
              <line x1="34" y1="20" x2="44" y2="20" stroke={strokeColor} strokeWidth="1" />
              <text x="22" y="42" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                AND GATE
              </text>
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#electronic-schematic-watermark)" />
      </svg>
    </div>
  );
};
