import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useReveal } from '../../hooks/useReveal';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function Section({ children, className, id, delay = 0 }: SectionProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id={id} className={cn('relative py-20 md:py-28', className)}>
      <div
        ref={ref}
        className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-10"
        style={delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}
      >
        {children}
      </div>
    </section>
  );
}

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Задержка появления в секундах — для лесенки в сетках. */
  delay?: number;
  as?: 'div' | 'article' | 'li';
}

/** Обёртка для отдельных карточек внутри секции. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
  style,
  ...rest
}: RevealProps) {
  const ref = useReveal<HTMLElement>();

  // createElement, а не JSX: тег приходит строкой из объединения типов,
  // и через JSX TypeScript пытается совместить ref сразу для всех вариантов.
  return React.createElement(
    as,
    {
      ref,
      className: cn('reveal', className),
      style: {
        ...style,
        ...(delay ? { '--reveal-delay': `${delay}s` } : {}),
      } as React.CSSProperties,
      ...rest,
    },
    children,
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Единый блок заголовка секции, чтобы ритм страницы был одинаковым везде. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center', className)}>
      <p className={cn('eyebrow', centered && 'eyebrow--center')}>{eyebrow}</p>
      <h2 className="display mt-5 text-4xl text-ink sm:text-5xl">{title}</h2>
      {subtitle && (
        <p className={cn('lead mt-5 max-w-2xl text-base sm:text-lg', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
