import React from 'react'
import Image from 'next/image'

interface CruzLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string
  className?: string
  priority?: boolean
}

export default function CruzLogo({ 
  className = "w-7 h-7 sm:w-8 sm:h-8",
  priority = false,
  ...props 
}: CruzLogoProps) {
  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
      aria-label="Cruz Logo"
      {...props}
    >
      <Image
        src="/logo.png"
        alt="Cruz"
        width={268}
        height={185}
        priority={priority}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  )
}
