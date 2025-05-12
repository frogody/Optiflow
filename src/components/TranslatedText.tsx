'use client';

import { useEffect, useState } from 'react';

// Removed commented-out imports for useLanguage and translations

interface TranslatedTextProps { 
  textKey: string;
  fallback?: string;
  className?: string;
}

export default function TranslatedText({ textKey, fallback, className }: TranslatedTextProps): JSX.Element {
  return <span className={className}>{fallback || textKey}</span>;
} 