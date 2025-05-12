'use client';

import { MotionWrapper } from '@/components/MotionWrapper';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiOutlineUserGroup
} from 'react-icons/hi';

// Dynamic import replaced with MotionWrapper 