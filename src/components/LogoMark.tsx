import React from 'react';

interface LogoMarkProps {
  size?: number;
  bg?: string;
  fg?: string;
  dot?: string;
  radius?: number;
}

export function LogoMark({ size = 96, bg = '#00A651', fg = '#0a0e1a', dot = '#FFD700', radius = 0.24 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: 'block' }}>
      <rect x="0" y="0" width="96" height="96" rx={96 * radius} fill={bg} />
      <g fill={fg}>
        <rect x="24" y="20" width="16" height="56" />
        <path d="M24 20 H72 L66 36 H24 Z" />
        <path d="M24 42 H58 L53 56 H24 Z" />
      </g>
      <g transform="translate(64 60)">
        <polygon points="10,0 20,7.5 16,19 4,19 0,7.5" fill={dot} />
      </g>
    </svg>
  );
}
