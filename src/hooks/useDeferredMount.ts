import { useEffect, useState } from 'react';

/**
 * Возвращает true только после того, как страница отрисовалась в браузере.
 * При пререндере (в Node) всегда false, поэтому тяжёлые WebGL-компоненты
 * не попадают ни в серверный HTML, ни в критический путь загрузки.
 */
export function useDeferredMount(delayMs = 0): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (delayMs <= 0) {
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return mounted;
}
