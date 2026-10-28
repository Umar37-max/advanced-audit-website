export type Locale = 'ru' | 'uz';

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentSection {
  h2: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LocalizedPage {
  /** <title>. Ключевой запрос — в начале, длина до ~60 символов. */
  metaTitle: string;
  /** <meta name="description">, ~150–160 символов. */
  metaDescription: string;
  h1: string;
  /** Вводный абзац под H1. */
  lead: string;
  sections: ContentSection[];
  faq: FaqItem[];
  /** Подпись в хлебных крошках и в меню. */
  navLabel: string;
}

export interface LandingPage {
  /** Путь без ведущего слэша: 'audit-tashkent', 'uslugi/nalogovyy-audit'. */
  slug: string;
  ru: LocalizedPage;
}
