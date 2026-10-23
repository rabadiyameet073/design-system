import React, { useRef, useEffect, useState, useCallback } from 'react';
import { hexToHsl, hslToHex } from '../../utils/colorMath';
import { Sparkles, RefreshCw, Check } from 'lucide-react';

interface ColorWheelPickerProps {
  initialHex: string;
  onColorChange: (hex: string) => void;
  recommendedColors?: { name: string; hex: string }[];
}

export const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({
  initialHex,
  onColorChange,
  recommendedColors = [
    { name: 'Terracotta', hex: '#C85A32' },
    { name: 'Tangerine', hex: '#EA580C' },
    { name: 'Warm Amber', hex: '#D97706' },
    { name: 'Burnt Rust', hex: '#B44C28' },
    { name: 'Modern Indigo', hex: '#4F46E5' },
    { name: 'Deep Oxford', hex: '#1E3A8A' },
    { name: 'Electric Teal', hex: '#0D9488' },
    { name: 'Forest Green', hex: '#15803D' },
    { name: 'Sage Mint', hex: '#2D6A4F' },
    { name: 'Champagne Gold', hex: '#9A7B38' },
    { name: 'Graphite Slate', hex: '#334155' },
    { name: 'Deep Crimson', hex: '#991B1B' }
  ]
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hsl, setHsl] = useState(() => hexToHsl(initialHex));
  const [isDragging, setIsDragging] = useState(false);
  const [hexInput, setHexInput] = useState(initialHex);

  const wheelSize = 220;
  const radius = wheelSize / 2;

  // Sync internal state if initialHex changes externally
  useEffect(() => {
    const nextHsl = hexToHsl(initialHex);
    setHsl(nextHsl);
    setHexInput(initialHex);
  }, [initialHex]);

  // Draw the chromatic color wheel canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(wheelSize, wheelSize);
    const data = imgData.data;

    for (let y = 0; y < wheelSize; y++) {
      for (let x = 0; x < wheelSize; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const index = (y * wheelSize + x) * 4;

        if (dist <= radius) {
          // Angle in degrees (0 to 360)
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          // Saturation (0 at center, 100 at circumference)
          const sat = (dist / radius) * 100;

          // Compute RGB using current Lightness
          const { r, g, b } = hslToRgbValues(angle, sat, hsl.l);

          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = 255;
        } else {
          // Transparent outside circle
          data[index + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw circular border
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
    ctx.stroke();

    // Draw selection marker indicator
    const markerAngle = (hsl.h * Math.PI) / 180;
    const markerDist = (hsl.s / 100) * (radius - 2);
    const markerX = radius + markerDist * Math.cos(markerAngle);
    const markerY = radius + markerDist * Math.sin(markerAngle);

    ctx.beginPath();
    ctx.arc(markerX, markerY, 7, 0, Math.PI * 2);
    ctx.fillStyle = hslToHex(hsl.h, hsl.s, hsl.l);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(markerX, markerY, 8.5, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }, [hsl.l, hsl.h, hsl.s]);

  // Handle wheel drag and click
  const handleWheelInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left - radius;
      const y = clientY - rect.top - radius;

      const dist = Math.min(radius, Math.sqrt(x * x + y * y));
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      const sat = Math.round((dist / radius) * 100);
      const newHsl = { ...hsl, h: Math.round(angle), s: sat };

      setHsl(newHsl);
      const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
      setHexInput(newHex);
      onColorChange(newHex);
    },
    [hsl, onColorChange, radius]
  );

  const handleLightnessChange = (newLightness: number) => {
    const nextHsl = { ...hsl, l: newLightness };
    setHsl(nextHsl);
    const nextHex = hslToHex(nextHsl.h, nextHsl.s, nextHsl.l);
    setHexInput(nextHex);
    onColorChange(nextHex);
  };

  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const nextHsl = hexToHsl(val);
      setHsl(nextHsl);
      onColorChange(val);
    }
  };

  const handleSelectPreset = (hex: string) => {
    const nextHsl = hexToHsl(hex);
    setHsl(nextHsl);
    setHexInput(hex);
    onColorChange(hex);
  };

  const currentHex = hslToHex(hsl.h, hsl.s, hsl.l);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
              Interactive Color Wheel & Spectrum
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
              360° Chromatic Wheel
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Click or drag across the wheel to choose your exact brand color, or pick a recommended hue below.
          </p>
        </div>

        {/* Selected Swatch & HEX pill */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border border-black/10 shadow-xs shrink-0 transition-transform active:scale-95"
            style={{ backgroundColor: currentHex }}
          />
          <div>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Active Color
            </span>
            <input
              type="text"
              value={hexInput}
              onChange={e => handleHexInputChange(e.target.value)}
              className="w-24 px-2 py-0.5 text-xs font-mono font-bold text-neutral-900 bg-neutral-50 border border-neutral-200 rounded uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: The Circular Chromatic Color Wheel */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative p-2 bg-neutral-50 rounded-full border border-neutral-200 shadow-inner">
            <canvas
              ref={canvasRef}
              width={wheelSize}
              height={wheelSize}
              className="rounded-full cursor-crosshair touch-none"
              onMouseDown={e => {
                setIsDragging(true);
                handleWheelInteraction(e);
              }}
              onMouseMove={e => {
                if (isDragging) handleWheelInteraction(e);
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={e => {
                setIsDragging(true);
                handleWheelInteraction(e);
              }}
              onTouchMove={e => {
                if (isDragging) handleWheelInteraction(e);
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
          </div>
          <span className="text-[11px] text-neutral-400 mt-2">
            Hue: {hsl.h}° · Saturation: {hsl.s}%
          </span>
        </div>

        {/* Right: Sliders & Color Metrics & Presets */}
        <div className="md:col-span-7 space-y-5">
          {/* Lightness Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1.5">
              <span>Lightness / Brightness</span>
              <span className="font-mono tabular-nums">{hsl.l}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="85"
              value={hsl.l}
              onChange={e => handleLightnessChange(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>Darker shade</span>
              <span>Balanced</span>
              <span>Pastel tint</span>
            </div>
          </div>

          {/* Color Coordinates (HSL, RGB) */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 border border-neutral-100 rounded-lg text-xs font-mono text-center">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-sans">Hue</span>
              <strong className="text-neutral-900">{hsl.h}°</strong>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-sans">Saturation</span>
              <strong className="text-neutral-900">{hsl.s}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-sans">Lightness</span>
              <strong className="text-neutral-900">{hsl.l}%</strong>
            </div>
          </div>

          {/* Recommended Colors row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Recommended Brand Colors
              </span>
              <span className="text-[11px] text-neutral-500">
                Click any to sync wheel
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
              {recommendedColors.map(preset => {
                const isSelected = currentHex.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.hex)}
                    className={`h-9 rounded-lg border relative transition-all flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105 shadow-sm'
                        : 'border-black/10 hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`${preset.name} (${preset.hex})`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function hslToRgbValues(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}
