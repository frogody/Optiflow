'use client';

import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-black/80 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-white/60 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-white/60 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/integrations" className="text-white/60 hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/enterprise" className="text-white/60 hover:text-white transition-colors">Enterprise</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/60 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-white/60 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/documentation" className="text-white/60 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="text-white/60 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/status" className="text-white/60 hover:text-white transition-colors">Status</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="text-white/60 hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/compliance" className="text-white/60 hover:text-white transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ISYNCSO. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com/isyncso" className="text-white/60 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="https://twitter.com/isyncso" className="text-white/60 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com/company/isyncso" className="text-white/60 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://discord.gg/isyncso" className="text-white/60 hover:text-white transition-colors">
                <FaDiscord size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 