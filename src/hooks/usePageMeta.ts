import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  /** Абсолютный URL страницы, без завершающего слэша. */
  canonical: string;
}

const SITE_NAME = 'ADVANCED AUDIT';

/**
 * Обновляет <title>, meta description и canonical при переходе между
 * страницами внутри приложения (без полной перезагрузки).
 *
 * На самом первом заходе эти теги уже верные — их проставляет prerender
 * при сборке конкретно под этот URL. Хук нужен только для последующей
 * клиентской навигации: без него при переходе по ссылке между разделами
 * заголовок вкладки и meta-теги остались бы от предыдущей страницы.
 */
export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="title"]', 'content', title);
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonical);
  }, [title, description, canonical]);
}

export { SITE_NAME };
