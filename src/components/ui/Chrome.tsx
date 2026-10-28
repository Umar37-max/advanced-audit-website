import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../LanguageContext';

/** Тонкая золотая полоса сверху — показывает прогресс чтения страницы. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      node.style.setProperty('--progress', String(Math.min(1, Math.max(0, progress))));
    };

    // Пересчёт привязан к кадру отрисовки, иначе прокрутка начинает «залипать»
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

// Порядок и состав совпадают с фактическим порядком секций в App.tsx.
// Манифест и «Как мы работаем» у навигации в шапке нет — там свои
// короткие подписи из eyebrow этих же разделов.
const SECTIONS = [
  { id: 'manifesto', labelKey: 'manifesto.eyebrow' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'services', labelKey: 'nav.services' },
  { id: 'process', labelKey: 'process.eyebrow' },
  { id: 'industries', labelKey: 'nav.industries' },
  { id: 'clients', labelKey: 'nav.clients' },
  { id: 'team', labelKey: 'nav.team' },
  { id: 'contact', labelKey: 'nav.contact' },
];

/**
 * Риски у правого края: показывают, где ты находишься на странице,
 * и позволяют перейти к любой секции. Только для широких экранов.
 */
export function DotNav() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Активной считаем секцию, занявшую больше всего видимой области
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="dot-nav" aria-label="Навигация по разделам">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => goTo(section.id)}
          aria-current={active === section.id}
          aria-label={t(section.labelKey)}
        >
          <span>{t(section.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
