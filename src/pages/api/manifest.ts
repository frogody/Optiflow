import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic manifest data
  const manifest = {
    name: 'Optiflow',
    short_name: 'Optiflow',
    description: 'AI workflow orchestration platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3CDFFF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };

  // Set cache headers
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Content-Type', 'application/json');
  
  // Return the manifest
  res.status(200).json(manifest);
} 