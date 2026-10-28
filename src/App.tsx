import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Cursor } from './components/ui/Cursor';
import { ScrollProgress } from './components/ui/Chrome';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServicePage } from './components/ServicePage';
import { PAGES } from './content/pages';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="relative min-h-screen bg-paper text-ink">
          {/* Фон — чистый CSS, без WebGL: быстрее и не мешает чтению */}
          <div className="bg-decor" aria-hidden="true" />

          <ScrollProgress />
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            {PAGES.map((page) => (
              <Route key={page.slug} path={`/${page.slug}`} element={<ServicePage page={page} />} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Footer />

          <Cursor />

          {/* Зерно поверх всего — из-за него заливки читаются как бумага */}
          <div className="grain" aria-hidden="true" />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
