import React, { useId } from 'react';

interface LogoMarkProps {
  className?: string;
  title?: string;
  /**
   * mono — весь знак наследует цвет текста (нужно для водяного знака и иконок).
   * brand — кольцо и столбцы заливаются золотым градиентом, литера берёт цвет текста.
   */
  variant?: 'mono' | 'brand';
}

/**
 * Знак «A» с кольцом-лентой и столбцами диаграммы внутри.
 * Вектор — остаётся чётким на любом экране и подстраивается под тему.
 */
export function LogoMark({ className = '', title, variant = 'mono' }: LogoMarkProps) {
  // Свой id градиента на каждый экземпляр, иначе несколько логотипов на странице
  // начнут ссылаться на одно и то же определение.
  const gradientId = `logo-gold-${useId().replace(/:/g, '')}`;
  const gold = variant === 'brand' ? `url(#${gradientId})` : 'currentColor';

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === 'brand' && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ecd79f" />
            <stop offset="34%" stopColor="#b0872a" />
            <stop offset="62%" stopColor="#8b6a1d" />
            <stop offset="100%" stopColor="#e4c67c" />
          </linearGradient>
        </defs>
      )}

      {/* Разомкнутое кольцо — «лента» фирменного знака */}
      <path
        d="M36.4 8.6a19 19 0 1 1-26.6 3.3"
        stroke={gold}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M11.6 39.4A19 19 0 0 0 40 24"
        stroke={gold}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Литера A */}
      <path
        d="M14 36 24 12l10 24"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Столбцы диаграммы вместо перекладины */}
      <rect x="18.6" y="29.4" width="2.4" height="4.2" fill={gold} opacity="0.75" />
      <rect x="22.8" y="26.6" width="2.4" height="7" fill={gold} opacity="0.9" />
      <rect x="27" y="23.4" width="2.4" height="10.2" fill={gold} />
    </svg>
  );
}

interface LogoProps {
  /** Компактный вариант — без подписи AUDIT под словом. */
  compact?: boolean;
  className?: string;
}

/**
 * Полный логотип: знак + словесная часть ADVANCED / AUDIT.
 * Текст живой, а не картинка — его читают и поисковики, и скринридеры.
 */
export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark variant="brand" className="h-9 w-9 shrink-0 text-ink sm:h-10 sm:w-10" />
      <span className="flex flex-col leading-none">
        <span className="display text-lg font-semibold tracking-[0.14em] text-ink sm:text-xl">
          ADVANCED
        </span>
        {!compact && (
          <span className="mt-1 text-[0.6rem] font-medium tracking-[0.42em] text-gold sm:text-[0.66rem]">
            AUDIT
          </span>
        )}
      </span>
    </span>
  );
}
