"use client";

import React from "react";

interface PlaceholderImageProps {
  type: string;
  number?: number;
  className?: string;
}

export default function PlaceholderImage({ type, number = 1, className = "" }: PlaceholderImageProps) {
  // Color schemes based on image type - using the ISYNCSO color scheme
  const colorSchemes = {
    workshop: ['bg-[#3CDFFF]', 'bg-[#4AFFD4]', 'bg-gradient-to-br from-[#3CDFFF] to-[#4AFFD4]'],
    consulting: ['bg-[#3CDFFF]', 'bg-[#4AFFD4]', 'bg-gradient-to-tr from-[#3CDFFF] to-[#4AFFD4]'],
    testimonial: ['bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]', 'bg-gradient-to-l from-[#3CDFFF] to-[#4AFFD4]', 'bg-[#3CDFFF]'],
    courses: ['bg-[#4AFFD4]', 'bg-gradient-to-b from-[#3CDFFF] to-[#4AFFD4]', 'bg-[#3CDFFF]'],
    events: ['bg-gradient-to-tl from-[#3CDFFF] to-[#4AFFD4]', 'bg-gradient-to-bl from-[#3CDFFF] to-[#4AFFD4]', 'bg-[#4AFFD4]'],
    "hands-on": ['bg-gradient-to-tr from-[#3CDFFF] to-[#4AFFD4]', 'bg-[#4AFFD4]', 'bg-[#3CDFFF]'],
    executive: ['bg-gradient-to-br from-[#3CDFFF] to-[#4AFFD4]', 'bg-[#3CDFFF]', 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]']
  };

  // If this is a consulting type, show a video instead
  if (type === 'consulting') {
    return (
      <div className={`relative ${className} overflow-hidden`}>
        <video 
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/aicademy/explaining-discussion.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Assign a color based on the type and number
  const colorIndex = (number - 1) % 3;
  const typeKey = type as keyof typeof colorSchemes;
  const bgColor = colorSchemes[typeKey]?.[colorIndex] || 'bg-slate-800';
  
  // Icons for different types
  const icons: Record<string, string> = {
    workshop: '👨‍💻',
    consulting: '📊',
    testimonial: '🗣️',
    courses: '📚',
    events: '🎉',
    "hands-on": '🛠️',
    executive: '👔'
  };

  const icon = icons[type] || '🖼️';

  return (
    <div className={`relative flex items-center justify-center ${bgColor} ${className} overflow-hidden`}>
      <span className="text-4xl drop-shadow-lg">{icon}</span>
      <div className="absolute top-2 right-2 text-xs text-black/70 bg-white/30 backdrop-blur-sm px-2 py-1 rounded">
        Placeholder Image
      </div>
      
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${20 + Math.random() * 40}%`,
              height: `${20 + Math.random() * 40}%`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.2,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
} 