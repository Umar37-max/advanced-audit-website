import { useEffect, useRef, useState } from 'react';

/**
 * Прогресс прохождения элемента через экран: 0 — верх блока только коснулся
 * низа окна, 1 — низ блока ушёл за верх окна.
 *
 * Пересчёт привязан к кадру отрисовки, а не к каждому событию прокрутки,
 * иначе на длинных страницах начинаются рывки.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let visible = true;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      if (total <= 0) return;
      const passed = window.innerHeight - rect.top;
      setProgress(Math.min(1, Math.max(0, passed / total)));
    };

    const onScroll = () => {
      if (!frame && visible) frame = requestAnimationFrame(measure);
    };

    // Пока блок далеко от экрана, слушать прокрутку смысла нет
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) measure();
      },
      { rootMargin: '100px 0px' },
    );

    observer.observe(node);
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress };
}
