import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Показывается на клиенте при переходе по несуществующему пути.
 * На сервере такие пути honestly отдают HTTP 404 (см. server.ts) —
 * этот компонент их содержимого не определяет, только оформление.
 */
export function NotFoundPage() {
  usePageMeta({
    title: 'Страница не найдена | ADVANCED AUDIT',
    description: 'Такой страницы не существует.',
    canonical: 'https://advanced-audit.uz/',
  });

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow eyebrow--center">404</p>
      <h1 className="display mt-5 text-4xl text-ink sm:text-5xl">Страница не найдена</h1>
      <p className="lead mt-5 max-w-md text-base sm:text-lg">
        Возможно, ссылка устарела или содержит опечатку.
      </p>
      <Link to="/" className="btn btn-primary mt-9">
        <span>На главную</span>
        <ArrowRight size={16} />
      </Link>
    </main>
  );
}
