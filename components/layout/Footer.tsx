'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo?: ReactNode;
  sections?: FooterSection[];
  socialLinks?: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
  copyright?: string;
  className?: string;
}

const Footer = ({
  logo,
  sections = [],
  socialLinks = [],
  copyright = `© ${new Date().getFullYear()} Complyx. All rights reserved.`,
  className = '',
}: FooterProps) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white border-t border-gray-200 ${className}`}
    >
      <div className="container-wide">
        <div className="py-12 px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo Section */}
            <div className="space-y-4">
              {logo || (
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Complyx</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    IFRS S1 & S2 Readiness Assessment Assistant
                  </p>
                </div>
              )}
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer Sections */}
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                className="space-y-4"
              >
                <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          {/* Copyright */}
          {copyright && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500"
            >
              {copyright}
            </motion.div>
          )}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
