import React from 'react';
import { Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';
import { useScrollProgress } from '../hooks/useScrollProgress';

const STEPS = [1, 2, 3, 4] as const;

/**
 * Этапы работы. Вдоль шагов идёт золотая линия, которая заполняется
 * по мере прокрутки — видно, сколько пути пройдено и сколько осталось.
 */
export function Process() {
  const { t } = useLanguage();
  const { ref, progress } = useScrollProgress<HTMLOListElement>();

  return (
    <Section id="process">
      <SectionHeading
        eyebrow={t('process.eyebrow')}
        title={t('process.title')}
        subtitle={t('process.lead')}
      />

      <ol
        ref={ref}
        className="timeline relative ml-3 sm:ml-5"
        style={{ '--fill': progress } as React.CSSProperties}
      >
        {STEPS.map((n) => (
          <li key={n} className="relative pb-12 pl-10 last:pb-0 sm:pl-16">
            {/* Точка на линии */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-paper ring-1 ring-line-strong"
            />

            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="display tabular text-3xl text-gold sm:text-4xl">
                {String(n).padStart(2, '0')}
              </span>
              <h3 className="display text-2xl text-ink sm:text-3xl">{t(`process.${n}.title`)}</h3>
            </div>

            <p className="lead mt-4 max-w-2xl text-[0.95rem] sm:text-base">
              {t(`process.${n}.text`)}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
