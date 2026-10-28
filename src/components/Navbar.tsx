import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Moon, Sun, Phone } from 'lucide-react';
import { cn } from './ui/Section';
import { Logo } from './ui/Logo';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  // Разделы (#about, #services…) физически существуют только на главной.
  // С других страниц ссылка должна сначала увести на "/", а браузер сам
  // прыгнет к якорю после загрузки — обычная ссылка справляется с этим
  // надёжнее, чем клиентский роутинг с хэшем.
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  const navLinks = [
    { name: t('nav.about'), href: sectionHref('#about') },
    { name: t('nav.industries'), href: sectionHref('#industries') },
    { name: t('nav.services'), href: sectionHref('#services') },
    { name: t('nav.clients'), href: sectionHref('#clients') },
    { name: t('nav.team'), href: sectionHref('#team') },
    { name: t('nav.contact'), href: sectionHref('#contact') },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Пока открыто мобильное меню, страница под ним не должна прокручиваться
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => setLang(lang === 'ru' ? 'uz' : 'ru');

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-line bg-paper/85 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link to="/" aria-label="Advanced Audit — на главную">
            <Logo />
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden items-center gap-9 xl:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[0.8rem] font-medium uppercase tracking-[0.13em] text-ink-2 transition-colors hover:text-ink"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center text-ink-2 transition-colors hover:text-gold"
              aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={toggleLanguage}
              className="flex h-11 items-center gap-1.5 px-2 text-[0.8rem] font-semibold uppercase tracking-[0.13em] text-ink-2 transition-colors hover:text-gold"
              aria-label="Сменить язык"
            >
              <Globe size={15} />
              {lang === 'ru' ? 'UZ' : 'RU'}
            </button>

            <a href={sectionHref('#contact')} className="btn btn-primary ml-2 hidden xl:inline-flex">
              <span>{t('nav.btn')}</span>
            </a>

            <button
              className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-gold xl:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню — на весь экран, с крупными зонами нажатия */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper xl:hidden"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-5 sm:px-6">
              <Logo />
              <button
                className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-gold"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Закрыть меню"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-2 sm:px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.035, duration: 0.25 }}
                  className="flex items-baseline gap-4 border-b border-line py-5 text-ink transition-colors hover:text-gold"
                >
                  <span className="w-6 text-[0.7rem] font-medium tracking-widest text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="display text-3xl">{link.name}</span>
                </motion.a>
              ))}
            </nav>

            <div className="space-y-3 border-t border-line px-4 py-5 sm:px-6">
              <a
                href="tel:+998912145335"
                className="flex items-center justify-center gap-2 text-sm font-medium text-ink-2"
              >
                <Phone size={15} className="text-gold" />
                +998 91 214 53 35
              </a>
              <a
                href={sectionHref('#contact')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-primary w-full"
              >
                <span>{t('nav.btn')}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
