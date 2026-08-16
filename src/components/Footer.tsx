import { ArrowUp, Terminal, Mail, Linkedin, Github } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/company';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'AI Automation', href: '#ai-automation' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Approach', href: '#approach' },
    { name: 'About', href: '#about' },
    { name: 'QA Assessment', href: '#assessment' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-[#07090D] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-mono text-lg font-bold tracking-tight">
              <div className="w-7 h-7 rounded-md bg-slate-800 text-sky-400 flex items-center justify-center border border-slate-700">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span>{COMPANY_CONFIG.name}</span>
            </div>

            <p className="text-xs text-sky-400 font-mono font-medium">
              Quality Engineering &bull; Software Testing &bull; AI Automation
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {COMPANY_CONFIG.positioning}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={COMPANY_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href={COMPANY_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${COMPANY_CONFIG.email}`}
                className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase font-bold text-white tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-sky-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Offerings Col */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase font-bold text-white tracking-wider">
              Core Disciplines
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#services" className="hover:text-sky-400 transition-colors">
                  Quality Strategy & Shift-Left QE
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-sky-400 transition-colors">
                  UI & API Test Automation Frameworks
                </a>
              </li>
              <li>
                <a href="#ai-automation" className="hover:text-sky-400 transition-colors">
                  AI-Powered Test Acceleration & Triage
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-sky-400 transition-colors">
                  CI/CD Pipeline Quality Gate Integration
                </a>
              </li>
              <li>
                <a href="#assessment" className="hover:text-sky-400 transition-colors">
                  Interactive QA Maturity Assessment
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-400">
            <span>&copy; 2026 {COMPANY_CONFIG.name}. All rights reserved.</span>
            <span className="hidden sm:inline-block">&bull;</span>
            <span className="text-slate-500 font-mono">Built for better software quality.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
