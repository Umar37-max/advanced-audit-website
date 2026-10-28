import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone } from 'lucide-react';
import type { LandingPage } from '../content/types';
import { PAGES } from '../content/pages';
import { Section, SectionHeading, Reveal } from './ui/Section';
import { usePageMeta } from '../hooks/usePageMeta';

const SITE_URL = 'https://advanced-audit.uz';

interface ServicePageProps {
  page: LandingPage;
}

/**
 * Общий шаблон посадочной страницы под конкретный коммерческий запрос.
 * Данные приходят из src/content/pages.ts — сама страница только вёрстка.
 *
 * FAQ отдаётся ещё и в разметке FAQPage (JSON-LD): при точном совпадении
 * с запросом пользователя Google может показать ответы прямо в выдаче —
 * это увеличивает CTR даже без первой позиции.
 */
export function ServicePage({ page }: ServicePageProps) {
  const { ru } = page;
  const canonical = `${SITE_URL}/${page.slug}`;

  usePageMeta({ title: ru.metaTitle, description: ru.metaDescription, canonical });

  const related = PAGES.filter((p) => p.slug !== page.slug).slice(0, 3);

  const faqSchema =
    ru.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ru.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null;

  return (
    <main>
      {/* JSON-LD с вопросами — данные не видны на странице, но их читает Google */}
      {faqSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Хлебные крошки: и для человека, и как сигнал структуры сайта для Google */}
          <nav aria-label="Хлебные крошки" className="flex items-center gap-1.5 text-xs text-muted">
            <Link to="/" className="transition-colors hover:text-gold">
              Главная
            </Link>
            <ChevronRight size={13} className="shrink-0" />
            <span className="text-ink-2">{ru.navLabel}</span>
          </nav>

          <p className="eyebrow mt-8">Услуга</p>
          <h1 className="display mt-5 max-w-3xl text-4xl text-ink sm:text-5xl lg:text-6xl">
            {ru.h1}
          </h1>
          <p className="lead mt-6 max-w-2xl text-base sm:text-lg">{ru.lead}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="/#contact" className="btn btn-primary">
              <span>Получить консультацию</span>
              <ArrowRight size={16} />
            </a>
            <a href="tel:+998912145335" className="btn btn-outline">
              <Phone size={15} />
              <span>+998 91 214 53 35</span>
            </a>
          </div>
        </div>
      </section>

      {ru.sections.map((section, index) => (
        <Section key={section.h2} className={index === 0 ? 'pt-0' : undefined}>
          <Reveal as="div">
            <h2 className="display text-3xl text-ink sm:text-4xl">{section.h2}</h2>
            <div className="rule-gold mt-5" />

            {section.paragraphs && (
              <div className="lead mt-7 max-w-3xl space-y-4 text-base sm:text-lg">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            {section.list && (
              <ul className="mt-7 grid max-w-3xl gap-3.5 sm:grid-cols-2">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </Section>
      ))}

      {ru.faq.length > 0 && (
        <Section id="faq" className="border-t border-line">
          <SectionHeading eyebrow="Вопросы" title="Частые вопросы" />
          <div className="divide-y divide-line border-y border-line">
            {ru.faq.map((item) => (
              <Reveal key={item.q} as="div" className="py-7">
                <h3 className="text-lg font-semibold text-ink sm:text-xl">{item.q}</h3>
                <p className="lead mt-3 max-w-2xl text-[0.95rem] sm:text-base">{item.a}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section className="border-t border-line bg-paper-2">
        <SectionHeading eyebrow="Другие услуги" title="Может быть также интересно" />
        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              to={`/${item.slug}`}
              className="group flex items-center justify-between gap-3 bg-paper p-6 transition-colors hover:bg-paper-2"
            >
              <span className="text-[0.95rem] font-medium text-ink">{item.ru.navLabel}</span>
              <ArrowRight
                size={16}
                className="shrink-0 text-gold transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <p className="eyebrow eyebrow--center">Следующий шаг</p>
        <h2 className="display mx-auto mt-5 max-w-2xl text-3xl text-ink sm:text-5xl">
          Обсудим вашу задачу?
        </h2>
        <p className="lead mx-auto mt-5 max-w-xl text-base sm:text-lg">
          Расскажите о компании — оценим объём работ и стоимость. Первая консультация бесплатная.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a href="/#contact" className="btn btn-primary w-full sm:w-auto">
            <span>Получить консультацию</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </Section>
    </main>
  );
}
