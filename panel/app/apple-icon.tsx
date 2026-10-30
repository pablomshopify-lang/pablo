import { ImageResponse } from 'next/og';

// Ícono para «Agregar a inicio» en iPhone (iOS no usa el SVG).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
      }}
    >
      <svg width="120" height="120" viewBox="112 128 288 256">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e50041" />
            <stop offset="1" stopColor="#62308c" />
          </linearGradient>
        </defs>
        <path
          d="M112 384V128h64l80 120 80-120h64v256h-64V232l-80 116-80-116v152z"
          fill="url(#g)"
        />
      </svg>
    </div>,
    size,
  );
}
