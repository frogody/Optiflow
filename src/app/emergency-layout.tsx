'use client';

import { Inter } from 'next/font/google';
import Head from 'next/head';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function EmergencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Optiflow - Emergency Mode</title>
        <meta name="description" content="Optiflow - Emergency Recovery Mode" />
      </Head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 px-4 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Optiflow</div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/" className="hover:text-blue-400">Home</a></li>
                <li><a href="/features" className="hover:text-blue-400">Features</a></li>
                <li><a href="/pricing" className="hover:text-blue-400">Pricing</a></li>
                <li><a href="/login" className="hover:text-blue-400">Login</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="pt-20 pb-10">
          {children}
        </div>
        <footer className="bg-gray-800 border-t border-gray-700 p-6">
          <div className="max-w-7xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Optiflow. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 