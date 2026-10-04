import React from 'react'

interface CruzLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
}

export default function CruzLogo({ 
  className = "w-7 h-7 sm:w-8 sm:h-8", 
  ...props 
}: CruzLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Cruz Logo"
      {...props}
    >
      {/* 1. Dynamic Speed Arc (Forms letter 'C' around the bike) */}
      <path
        d="M 25 5.5 C 14 2.5 3.5 10 3.5 17 C 3.5 24 13 30 24 28"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 23 7 C 14 4.5 5.5 11 5.5 17 C 5.5 22.5 13 27.5 22 26"
        stroke="#FFE500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 2. Sport Motorcycle Wheels */}
      {/* Rear Wheel */}
      <circle 
        cx="10" 
        cy="20.5" 
        r="3.5" 
        fill="#FFE500" 
        stroke="#000000" 
        strokeWidth="2" 
      />
      <circle cx="10" cy="20.5" r="1.2" fill="#000000" />

      {/* Front Wheel */}
      <circle 
        cx="23.5" 
        cy="20.5" 
        r="3.5" 
        fill="#FFE500" 
        stroke="#000000" 
        strokeWidth="2" 
      />
      <circle cx="23.5" cy="20.5" r="1.2" fill="#000000" />

      {/* 3. Aerodynamic Sportbike Body / Fairing */}
      <path
        d="M 10 20.5 L 14.5 14.5 L 19.5 12.5 L 23.5 20.5 Z"
        fill="#FFE500"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Windshield & Handlebar */}
      <path
        d="M 19.5 12.5 L 18 9.5 L 21 9.5"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sport Tail Cowl */}
      <path
        d="M 13.5 14.5 L 8 13.5"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Front Fork */}
      <line
        x1="19.5"
        y1="12.5"
        x2="23.5"
        y2="20.5"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
