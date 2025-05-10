'use client';

import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-[#3CDFFF]/20 bg-slate-800/80 backdrop-blur-sm shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className = '', children }: CardTitleProps) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] ${className}`}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function CardDescription({
  className = '',
  children,
}: CardDescriptionProps) {
  return <p className={`text-sm text-slate-300 ${className}`}>{children}</p>;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className = '', children }: CardContentProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
