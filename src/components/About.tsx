import React from 'react';
import { CheckCircle2, Award, ShieldCheck } from 'lucide-react';
import { Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';

const QUALIFICATIONS = ['ACCA', 'DipIFR (rus)', 'DipAFR', 'CIPA', 'CAP'];

export function About() {
  const { t } = useLanguage();

  const standards = [
    { icon: CheckCircle2, code: 'НСБУ / BHMS', textKey: 'about.nsbu' },
    { icon: Award, code: 'МСФО / MHXS', textKey: 'about.msfo' },
    { icon: ShieldCheck, code: 'МСА / XAS', textKey: 'about.msa' },
  ];

  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} className="mb-10" />

          <div className="space-y-5 text-base leading-relaxed text-ink-2 sm:text-[1.0625rem]">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
            <p>{t('about.p4')}</p>
          </div>

          <div className="mt-12">
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
              {t('about.quals')}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {QUALIFICATIONS.map((qual) => (
                <li
                  key={qual}
                  className="border border-line px-4 py-2 text-sm font-medium tracking-wide text-ink-2"
                >
                  {qual}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="surface self-start p-7 sm:p-10">
          <h3 className="display text-2xl text-ink sm:text-3xl">{t('about.work')}</h3>
          <div className="rule-gold mt-5" />

          <ul className="mt-9 space-y-8">
            {standards.map(({ icon: Icon, code, textKey }) => (
              <li key={code} className="flex gap-5">
                <Icon size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h4 className="text-[0.95rem] font-semibold tracking-wide text-ink">{code}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(textKey)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
