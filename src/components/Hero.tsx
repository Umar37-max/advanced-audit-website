import React from 'react';
import { ArrowRight, BadgeCheck, ShieldCheck, Scale } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { LogoMark } from './ui/Logo';
import { BackgroundVideo } from './ui/BackgroundVideo';

/** Задержки появления блоков первого экрана задаются CSS-переменными. */
const heroDelay = (seconds: number) => ({ '--hero-delay': `${seconds}s` }) as React.CSSProperties;
const maskDelay = (seconds: number) => ({ '--mask-delay': `${seconds}s` }) as React.CSSProperties;

export function Hero() {
  const { t } = useLanguage();

  const trust = [
    { icon: BadgeCheck, label: t('hero.trust.license') },
    { icon: ShieldCheck, label: t('hero.trust.insurance') },
    { icon: Scale, label: t('hero.trust.standards') },
  ];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24 sm:pt-32">
      {/* Кинематографичный фон: золотые чернила расходятся в воде.
          Затемнение сильнее слева, где лежит текст, и слабее справа —
          там, где раньше было просто кольцо-водяной знак. */}
      <BackgroundVideo src="/video/hero-bg.mp4" eager />

      {/* Кольцо и знак поверх видео — тонкий геометрический акцент,
          золото на золоте, не спорит с движением под ним */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 z-[1] hidden -translate-y-1/2 lg:block"
      >
        <div className="hero-ring relative h-[38rem] w-[38rem]">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.25"
              className="text-gold/25"
              strokeDasharray="0.6 3"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-gold/15"
            />
          </svg>
          <LogoMark className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 text-gold/[0.09]" />
        </div>
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Вертикальная метка раздела у левого края */}
        {/*
          Только с 1536px: на промежуточных ширинах (1280–1535px) поле
          вокруг max-w-7xl-контейнера слишком узкое, и метка залезала
          на подзаголовок. Якорим у верхнего края, а не по центру блока,
          чтобы гарантированно остаться рядом с eyebrow, а не поперёк текста.
        */}
        <span
          aria-hidden="true"
          className="hero-in absolute -left-16 top-1 hidden -rotate-90 text-[0.6rem] font-semibold tracking-[0.3em] text-muted 2xl:block"
          style={heroDelay(0.5)}
        >
          01 / ADVANCED AUDIT
        </span>

        <div className="max-w-4xl">
          <p className="eyebrow hero-in">{t('hero.eyebrow')}</p>

          {/*
            Заголовок целиком лежит в разметке — маска только сдвигает его,
            не скрывая от поисковика. Появление быстрое, чтобы не портить LCP.
          */}
          <h1 className="display mt-6 text-[2.6rem] leading-[1.06] text-ink sm:text-6xl lg:text-7xl">
            <span className="mask-line">
              <span style={maskDelay(0.05)}>{t('hero.title.l1')}</span>
            </span>
            <span className="mask-line">
              <span style={maskDelay(0.17)}>{t('hero.title.l2')}</span>
            </span>
          </h1>

          <p className="lead hero-in mt-8 max-w-2xl text-base sm:text-lg" style={heroDelay(0.32)}>
            {t('hero.subtitle')}
          </p>

          <div
            className="hero-in mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            style={heroDelay(0.42)}
          >
            <a href="#contact" className="btn btn-primary">
              <span>{t('contact.submit')}</span>
              <ArrowRight size={16} />
            </a>
            <a href="#services" className="btn btn-outline">
              <span>{t('nav.services')}</span>
            </a>
          </div>

          {/* Сигналы доверия — то, что клиент проверяет перед звонком */}
          <ul
            className="hero-in mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3"
            style={heroDelay(0.52)}
          >
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 bg-paper/70 px-5 py-4 backdrop-blur-sm">
                <Icon size={18} strokeWidth={1.5} className="shrink-0 text-gold" />
                <span className="text-sm leading-snug text-ink-2">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Подсказка прокрутки */}
      <div
        aria-hidden="true"
        className="scroll-cue hero-in absolute bottom-8 left-1/2 z-[2] hidden -translate-x-1/2 sm:block"
        style={heroDelay(0.9)}
      >
        <span />
      </div>
    </section>
  );
}
