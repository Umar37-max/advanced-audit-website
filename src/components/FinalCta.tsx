import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { LogoMark } from './ui/Logo';
import { BackgroundVideo } from './ui/BackgroundVideo';
import { useReveal } from '../hooks/useReveal';

/**
 * Финальный экран: после него человек либо звонит, либо уходит.
 * Поэтому здесь только одна мысль и два способа связаться.
 *
 * Ролик с восходящим золотым светом — драматичный тёмный кадр, поэтому
 * он монтируется только в тёмной теме: в светлой он смотрелся бы как
 * случайный чёрный прямоугольник на кремовой странице. В светлой теме
 * секция остаётся на своём обычном фоне paper-2.
 */
export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden border-y border-line bg-paper-2 py-24 sm:py-32">
      {theme === 'dark' && <BackgroundVideo src="/video/cta-bg.mp4" className="video-bg--center" />}

      <LogoMark
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 z-[1] h-[30rem] w-[30rem] text-gold/[0.05]"
      />

      <div
        ref={ref}
        className="reveal relative z-[2] mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-10"
      >
        <p className="eyebrow eyebrow--center">{t('cta.eyebrow')}</p>

        <h2 className="display mx-auto mt-6 max-w-3xl text-4xl text-ink sm:text-6xl lg:text-7xl">
          {t('cta.title')}
        </h2>

        <p className="lead mx-auto mt-7 max-w-xl text-base sm:text-lg">{t('cta.text')}</p>

        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a href="#contact" className="btn btn-primary w-full sm:w-auto">
            <span>{t('contact.submit')}</span>
            <ArrowRight size={16} />
          </a>
          <a href="tel:+998912145335" className="btn btn-outline w-full sm:w-auto">
            <Phone size={15} />
            <span>+998 91 214 53 35</span>
          </a>
        </div>
      </div>
    </section>
  );
}
