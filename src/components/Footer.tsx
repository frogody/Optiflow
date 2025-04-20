'use client';

import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Integrations', href: '/integrations' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Enterprise', href: '/enterprise' },
      ]
    },
    {
      title: 'Learn',
      links: [
        { name: 'AIcademy', href: '/aicademy' },
        { name: 'AI Factory', href: '/ai-factory' },
        { name: 'Documentation', href: '/docs' },
        { name: 'FAQ', href: '/faq' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Security', href: '/security' },
        { name: 'Compliance', href: '/compliance' },
      ]
    }
  ];

  return (
    <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="text-white text-xl font-medium">
              ISYNCSO
            </Link>
            <p className="mt-4 text-white/60 max-w-xs">
              Connecting your workflow with intelligence and automation. Build seamless integrations and powerful automations.
            </p>
          </div>
          
          {footerLinks.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                {category.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white/60 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-white/60 text-sm">
            © {currentYear} ISYNCSO. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/isyncso" className="text-white/60 hover:text-white transition-colors" aria-label="GitHub">
              <FaGithub size={20} />
            </a>
            <a href="https://twitter.com/isyncso" className="text-white/60 hover:text-white transition-colors" aria-label="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="https://linkedin.com/company/isyncso" className="text-white/60 hover:text-white transition-colors" aria-label="LinkedIn">
              <FaLinkedin size={20} />
            </a>
            <a href="https://discord.gg/isyncso" className="text-white/60 hover:text-white transition-colors" aria-label="Discord">
              <FaDiscord size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 