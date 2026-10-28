import React, { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  src: string;
  className?: string;
  /** true — грузить сразу (для видео в первом экране). По умолчанию
   *  ролик докачивается только когда секция приближается к экрану. */
  eager?: boolean;
}

/**
 * Кинематографичная фоновая подложка для секции. Смонтирована только
 * на клиенте (в серверной разметке видео нет — оно декоративное и не
 * должно ни увеличивать вес HTML, ни задерживать LCP), не запускается
 * при системной настройке «уменьшить движение», и до полной загрузки
 * кадра остаётся прозрачной — секция всё это время держится на своём
 * обычном фоне, скачок не заметен.
 *
 * Файлы весят по несколько мегабайт, поэтому не-первоэкранные ролики
 * (например, в финальном CTA в конце страницы) начинают качаться только
 * когда секция подходит к границе экрана — человек, который не долистал
 * до конца, эти мегабайты не платит.
 */
export function BackgroundVideo({ src, className, eager = false }: BackgroundVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (eager) {
      // Небольшая задержка: не конкурируем с загрузкой основного бандла
      const timer = window.setTimeout(() => setMounted(true), 300);
      return () => window.clearTimeout(timer);
    }

    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;
    // Автовоспроизведение иногда блокируется браузером даже при muted —
    // если play() отклонён, видео просто остаётся прозрачным подложкой.
    video.play().catch(() => {});
  }, [mounted]);

  return (
    <div ref={wrapperRef} className={`video-bg ${className ?? ''}`} aria-hidden="true">
      {mounted && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          className={ready ? 'is-ready' : ''}
        />
      )}
    </div>
  );
}
