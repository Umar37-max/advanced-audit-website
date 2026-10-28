import React from 'react';
import { Reveal, Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';

const industriesKeys = [
  'ind.oil',
  'ind.metal',
  'ind.light',
  'ind.chem',
  'ind.agro',
  'ind.fin',
  'ind.lease',
  'ind.insure',
  'ind.telecom',
  'ind.transport',
  'ind.intl',
];

export function Industries() {
  const { t } = useLanguage();

  return (
    <Section id="industries">
      <SectionHeading
        eyebrow={t('industries.eyebrow')}
        title={t('industries.title')}
        subtitle={t('industries.subtitle')}
        align="center"
      />

      {/* Сетка на общих линиях: аккуратнее, чем набор отдельных карточек */}
      <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {industriesKeys.map((key, index) => (
          <Reveal
            key={key}
            delay={Math.min(index * 0.03, 0.25)}
            className="group relative bg-paper p-6 transition-colors duration-300 hover:bg-paper-2 sm:p-8"
          >
            <span className="text-[0.7rem] font-medium tracking-[0.18em] text-gold">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-[0.95rem] font-medium leading-snug text-ink sm:text-base">
              {t(key)}
            </h3>
            <span className="mt-5 block h-px w-8 bg-line-strong transition-all duration-300 group-hover:w-16 group-hover:bg-gold" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
