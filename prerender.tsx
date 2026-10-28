/**
 * Пререндер сайта — главная страница плюс отдельная посадочная страница
 * под каждую услугу из src/content/pages.ts, плюс страница 404.
 *
 * Запускается после `vite build`. Vite строит один HTML-шаблон и один
 * JS-бандл (это SPA с клиентским роутингом) — для каждого маршрута этот
 * скрипт берёт тот же шаблон, рендерит для него разметку через
 * react-dom/server с StaticRouter на нужном пути, подменяет <title>,
 * meta description, canonical и og/twitter-теги под конкретную страницу
 * и сохраняет в dist/<путь>/index.html. Так поисковый робот получает
 * готовый текст и верные метатеги сразу, без выполнения JavaScript,
 * а разные страницы не спорят друг с другом за одну и ту же выдачу.
 *
 * Заодно пересобирает sitemap.xml со всеми маршрутами.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './src/App';
import { PAGES } from './src/content/pages';

// Домен можно переопределить переменной окружения SITE_URL при сборке.
// Это пригодится на время переезда, пока работают оба адреса.
const DEFAULT_SITE_URL = 'https://advanced-audit.uz';
const SITE_URL = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

const ROOT_MARKER = '<div id="root"></div>';

const baseTemplate = fs.readFileSync(templatePath, 'utf8');
if (!baseTemplate.includes(ROOT_MARKER)) {
  throw new Error(`prerender: в ${templatePath} не найден ${ROOT_MARKER}`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Заменяет content="..." / href="..." у тега, найденного по соседнему маркеру. */
function replaceAttrNear(html: string, marker: string, attr: string, value: string): string {
  const re = new RegExp(`(${marker}[\\s\\S]*?${attr}=")[^"]*(")`);
  if (!re.test(html)) {
    throw new Error(`prerender: не найден тег рядом с ${marker}`);
  }
  return html.replace(re, (_match, pre: string, post: string) => `${pre}${escapeHtml(value)}${post}`);
}

interface RenderOptions {
  routePath: string;
  title?: string;
  description?: string;
  noindex?: boolean;
}

function renderRoute({ routePath, title, description, noindex }: RenderOptions): string {
  const appHtml = renderToString(
    React.createElement(StaticRouter, { location: `/${routePath}` }, React.createElement(App)),
  );

  let html = baseTemplate.replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`);

  if (title && description) {
    const canonical = routePath ? `${SITE_URL}/${routePath}` : `${SITE_URL}/`;
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
    html = replaceAttrNear(html, 'name="title"', 'content', title);
    html = replaceAttrNear(html, 'name="description"', 'content', description);
    html = replaceAttrNear(html, 'property="og:title"', 'content', title);
    html = replaceAttrNear(html, 'property="og:description"', 'content', description);
    html = replaceAttrNear(html, 'property="og:url"', 'content', canonical);
    html = replaceAttrNear(html, 'name="twitter:title"', 'content', title);
    html = replaceAttrNear(html, 'name="twitter:description"', 'content', description);
    html = replaceAttrNear(html, 'rel="canonical"', 'href', canonical);
  }

  if (noindex) {
    html = replaceAttrNear(html, 'name="robots"', 'content', 'noindex, follow');
  }

  if (SITE_URL !== DEFAULT_SITE_URL) {
    html = html.split(DEFAULT_SITE_URL).join(SITE_URL);
  }

  return html;
}

let totalTextChars = 0;
const routes = [{ routePath: '' }, ...PAGES.map((p) => ({ routePath: p.slug, title: p.ru.metaTitle, description: p.ru.metaDescription }))];

for (const route of routes) {
  const html = renderRoute(route);
  const outDir = route.routePath ? path.join(distDir, route.routePath) : distDir;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  totalTextChars += text.length;
  console.log(`prerender: /${route.routePath} — ${text.length} символов текста`);
}

// Отдельная 404-страница: сервер отдаёт её с настоящим HTTP 404,
// а внутри — оформленная страница, а не голый текст ошибки.
const notFoundHtml = renderRoute({
  routePath: 'a-page-that-does-not-exist',
  title: 'Страница не найдена | ADVANCED AUDIT',
  description: 'Такой страницы не существует. Возможно, ссылка устарела или содержит опечатку.',
  noindex: true,
});
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

console.log(
  `prerender: готово, маршрутов ${routes.length} + 404, суммарно ~${totalTextChars} символов текста`,
);

// sitemap.xml — по одному <url> на каждый маршрут (404 в sitemap не входит).
// Дата обновляется автоматически при каждой сборке.
const lastmod = new Date().toISOString().slice(0, 10);
const urlEntries = routes
  .map((route) => {
    const loc = route.routePath ? `${SITE_URL}/${route.routePath}` : `${SITE_URL}/`;
    const priority = route.routePath ? '0.8' : '1.0';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap: обновлён, ${routes.length} URL, lastmod=${lastmod}`);
