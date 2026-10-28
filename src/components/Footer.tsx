import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { LogoMark } from './ui/Logo';
import { useLanguage } from '../LanguageContext';
import { PAGES } from '../content/pages';

const PHONES = ['+998 91 214 53 35', '+998 93 747 34 34', '+998 97 766 96 83', '+998 97 749 12 79'];
const EMAIL = 'best_audit_services@bk.ru';
const INSTAGRAM = 'https://www.instagram.com/best_audit_services';

export function Footer() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  const navLinks = [
    { name: t('nav.about'), href: sectionHref('#about') },
    { name: t('nav.industries'), href: sectionHref('#industries') },
    { name: t('nav.services'), href: sectionHref('#services') },
    { name: t('nav.clients'), href: sectionHref('#clients') },
    { name: t('nav.team'), href: sectionHref('#team') },
    { name: t('nav.contact'), href: sectionHref('#contact') },
  ];

  return (
    <footer className="relative z-10 border-t border-line bg-paper-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr_1fr_1.1fr]">
          {/* Бренд */}
          <div>
            <span className="inline-flex items-center gap-3">
              <LogoMark variant="brand" className="h-10 w-10 text-ink" />
              <span className="flex flex-col leading-none">
                <span className="display text-xl font-semibold tracking-[0.14em] text-ink">
                  ADVANCED
                </span>
                <span className="mt-1 text-[0.66rem] font-medium tracking-[0.42em] text-gold">
                  AUDIT
                </span>
              </span>
            </span>

            <p className="lead mt-7 max-w-sm text-sm">{t('footer.desc')}</p>

            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-11 w-11 items-center justify-center border border-line text-ink-2 transition-colors hover:border-gold hover:text-gold"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          {/* Навигация */}
          <nav>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
              {t('footer.nav')}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-2 transition-colors hover:text-gold"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Услуги — ссылки на каждую посадочную страницу есть на любой
              странице сайта, а не только на главной. Это и удобно для
              посетителя, и главный внутренний сигнал для Google о том,
              что эти страницы вообще существуют. */}
          <nav>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Услуги
            </h3>
            <ul className="mt-6 space-y-3.5">
              {PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    to={`/${page.slug}`}
                    className="text-sm text-ink-2 transition-colors hover:text-gold"
                  >
                    {page.ru.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Контакты */}
          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
              {t('footer.contact')}
            </h3>

            <ul className="mt-6 space-y-3.5 text-sm">
              {PHONES.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <Phone size={14} className="shrink-0 text-gold" />
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-ink-2 transition-colors hover:text-gold"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail size={14} className="shrink-0 text-gold" />
                <a href={`mailto:${EMAIL}`} className="text-ink-2 transition-colors hover:text-gold">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-1 shrink-0 text-gold" />
                <span className="leading-relaxed text-ink-2">{t('contact.address_val')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-7 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} ADVANCED AUDIT. {t('footer.rights')}
          </p>
          <p className="text-xs tracking-wide text-muted">{t('hero.trust.standards')}</p>
        </div>
      </div>
    </footer>
  );
}
