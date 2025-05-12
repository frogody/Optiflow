'use client';

// Force dynamic rendering to avoid static generation issues with React version conflicts
export const dynamic = 'force-dynamic';

import { MotionWrapper } from '@/components/MotionWrapper';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  HiOutlineClipboardCheck,
  HiOutlineDatabase,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineScale,
  HiOutlineShieldCheck
} from 'react-icons/hi';

// Dynamic import replaced with MotionWrapper 