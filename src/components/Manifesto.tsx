import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { LogoMark } from './ui/Logo';

const BLOCKS = [1, 2, 3] as const;

/**
 * Раздел, который читают, а не пролистывают: слева закреплён заголовок
 * и счётчик, справа один за другим проезжают тезисы. Активный тезис
 * подсвечивается, остальные приглушены — взгляд идёт туда, куда нужно.
 *
 * Высота каждого блока — ровно один экран (не больше): текста в тезисе
 * достаточно, чтобы заполнить его, а гигантская полупрозрачная цифра
 * за текстом держит взгляд, пока идёт прокрутка, вместо пустой бумаги.
 *
 * На узких экранах закрепление отключается и блоки просто идут подряд.
 */
export function Manifesto() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemsRef.current.filter((n): n is HTMLDivElement => Boolean(n));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = nodes.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActive(index);
          }
        });
      },
      // Узкая полоса по центру экрана: активным считается тезис, который
      // сейчас напротив глаз, а не тот, что едва показался снизу.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="manifesto" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Закреплённая половина */}
          <div className="lg:sticky lg:top-32 lg:h-fit lg:self-start">
            <p className="eyebrow">{t('manifesto.eyebrow')}</p>
            <h2 className="display mt-5 text-4xl text-ink sm:text-5xl lg:text-6xl">
              {t('manifesto.title')}
            </h2>
            <p className="lead mt-6 max-w-lg text-base sm:text-lg">{t('manifesto.lead')}</p>

            {/* Счётчик тезисов */}
            <div className="mt-10 hidden items-center gap-5 lg:flex">
              <span className="display tabular text-5xl text-gold">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="h-px flex-1 bg-line" />
              <span className="tabular text-sm text-muted">
                {String(BLOCKS.length).padStart(2, '0')}
              </span>
            </div>

            <LogoMark
              className="mt-10 hidden h-40 w-40 text-gold/[0.09] lg:block"
              aria-hidden="true"
            />
          </div>

          {/* Проезжающие тезисы */}
          <div className="flex flex-col gap-14 lg:gap-0">
            {BLOCKS.map((n, index) => (
              <div
                key={n}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                className="relative lg:flex lg:min-h-[54vh] lg:flex-col lg:justify-center"
              >
                {/* Гигантская цифра-водяной знак держит взгляд на пустом месте
                    вместо голой бумаги — читается как обложка главы. Видна
                    всегда (в цвет линий разметки), а не только у активного
                    блока: иначе на середине прокрутки, между двумя блоками,
                    на экране нет вообще ничего — IntersectionObserver ещё
                    не решил, какой тезис считать активным. */}
                <span
                  aria-hidden="true"
                  className="display tabular pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[15rem] leading-none transition-colors duration-700 lg:block xl:text-[18rem]"
                  style={{ color: active === index ? 'var(--c-gold-pale)' : 'var(--c-line)' }}
                >
                  {String(n).padStart(2, '0')}
                </span>

                <article
                  className="relative border-l-2 pl-6 transition-all duration-500 sm:pl-8"
                  style={{
                    borderColor: active === index ? 'var(--c-gold)' : 'var(--c-line)',
                    opacity: active === index ? 1 : 0.45,
                  }}
                >
                  <span className="tabular text-[0.7rem] font-semibold tracking-[0.2em] text-gold">
                    {String(n).padStart(2, '0')}
                  </span>
                  <h3 className="display mt-4 text-2xl text-ink sm:text-3xl lg:text-4xl">
                    {t(`manifesto.${n}.title`)}
                  </h3>
                  <p className="lead mt-4 max-w-xl text-base sm:text-lg">
                    {t(`manifesto.${n}.text`)}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
