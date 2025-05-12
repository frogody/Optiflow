'use client';

// Force dynamic rendering to avoid static generation issues with React version conflicts
export const dynamic = 'force-dynamic';

import { MotionWrapper } from '@/components/MotionWrapper';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineCube,
  HiOutlineLightningBolt,
  HiOutlinePresentationChartLine,
  HiOutlineTrendingUp
} from 'react-icons/hi';

import styles from './styles.module.css';

// Dynamic import replaced with MotionWrapper 