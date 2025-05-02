import React from 'react';

interface PlaceholderLogoProps {
  companyName: string;
  className?: string;
}

export default function PlaceholderLogo({ companyName, className = "" }: PlaceholderLogoProps) {
  return (
    <div className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#3CDFFF]/5 to-[#4AFFD4]/5 rounded-lg border border-[#3CDFFF]/10 ${className}`}>
      <span className="text-lg font-medium text-white/90">{companyName}</span>
    </div>
  );
} 