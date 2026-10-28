import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch, Globe2, LineChart } from 'lucide-react';
import { Reveal, Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';

// Пункт списка → его собственная посадочная страница. У пункта без
// записи здесь просто нет отдельной страницы — остаётся обычным текстом.
const ITEM_LINKS: Record<string, string> = {
  'srv.audit.1': '/uslugi/obyazatelnyy-audit',
  'srv.audit.2': '/uslugi/initsiativnyy-audit',
  'srv.audit.3': '/uslugi/nalogovyy-audit',
  'srv.msfo.1': '/uslugi/msfo-transformatsiya',
  'srv.msfo.2': '/uslugi/msfo-transformatsiya',
  'srv.fin.1': '/uslugi/buhgalterskie-uslugi',
  'srv.fin.2': '/uslugi/buhgalterskie-uslugi',
  'srv.fin.3': '/uslugi/buhgalterskie-uslugi',
  'srv.fin.4': '/uslugi/buhgalterskie-uslugi',
  'srv.fin.5': '/uslugi/nalogovyy-konsalting',
};

const services = [
  {
    titleKey: 'srv.audit',
    icon: FileSearch,
    itemKeys: ['srv.audit.1', 'srv.audit.2', 'srv.audit.3', 'srv.audit.4'],
    cardLink: '/audit-tashkent',
  },
  {
    titleKey: 'srv.msfo',
    icon: Globe2,
    itemKeys: ['srv.msfo.1', 'srv.msfo.2'],
    cardLink: '/uslugi/msfo-transformatsiya',
  },
  {
    titleKey: 'srv.fin',
    icon: LineChart,
    itemKeys: ['srv.fin.1', 'srv.fin.2', 'srv.fin.3', 'srv.fin.4', 'srv.fin.5'],
    cardLink: '/uslugi/buhgalterskie-uslugi',
  },
];

/**
 * Услуги развёрстаны не карточками, а разворотами журнала:
 * крупный номер и название слева, перечень — справа. Такая сетка
 * читается спокойнее и выглядит дороже, чем три плитки в ряд.
 *
 * Пункты, у которых есть отдельная страница, ведут прямо на неё —
 * это основной внутренний путь с главной на посадочные страницы услуг.
 */
export function Services() {
  const { t } = useLanguage();

  return (
    <Section id="services">
      <SectionHeading
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      <div className="border-t border-line">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Reveal
              key={service.titleKey}
              as="article"
              delay={index * 0.06}
              className="group grid gap-6 border-b border-line py-9 transition-colors duration-500 hover:bg-paper-2 sm:py-11 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16 lg:px-6"
            >
              <div className="flex items-start gap-5">
                <span className="display tabular text-4xl leading-none text-line-strong transition-colors duration-500 group-hover:text-gold sm:text-5xl">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="pt-1">
                  <div className="flex items-center gap-3">
                    <Icon size={20} strokeWidth={1.4} className="shrink-0 text-gold" />
                    <h3 className="display text-2xl text-ink sm:text-3xl">
                      {t(service.titleKey)}
                    </h3>
                  </div>
                  <div className="rule-gold mt-4" />

                  <Link
                    to={service.cardLink}
                    className="mt-5 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-gold transition-colors hover:text-ink"
                  >
                    Подробнее
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2 lg:pt-2">
                {service.itemKeys.map((itemKey) => {
                  const href = ITEM_LINKS[itemKey];
                  return (
                    <li
                      key={itemKey}
                      className="flex gap-3 text-[0.88rem] leading-relaxed text-ink-2 sm:text-[0.95rem]"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold" />
                      {href ? (
                        <Link to={href} className="transition-colors hover:text-gold">
                          {t(itemKey)}
                        </Link>
                      ) : (
                        t(itemKey)
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
