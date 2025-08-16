import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function HopeBotLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'rgb(0, 255, 255)' }} />
        </linearGradient>
      </defs>
      <path d="M12 8V4H8" stroke="url(#blue-gradient)" />
      <rect width="16" height="12" x="4" y="8" rx="2" stroke="url(#blue-gradient)" />
      <path d="M2 14h2" stroke="url(#blue-gradient)" />
      <path d="M20 14h2" stroke="url(#blue-gradient)" />
      <path d="M15 13v2" stroke="url(#blue-gradient)" />
      <path d="M9 13v2" stroke="url(#blue-gradient)" />
    </svg>
  );
}
