import express from 'express';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeTelegramHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // gzip/brotli для HTML, CSS и JS. Без этого бандл уходит клиенту целиком.
  app.use(compression());
  app.use(express.json());

  // API routes
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, phone, company, comment } = req.body;
      
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      // Несколько получателей через запятую: TELEGRAM_CHAT_ID=111,222,333.
      // Каждый ID должен хотя бы раз написать боту /start — иначе Telegram
      // отклонит отправку именно ему (закрыть это программно нельзя, так
      // устроен сам Telegram API).
      const chatIds = (process.env.TELEGRAM_CHAT_ID || '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      if (!botToken || chatIds.length === 0) {
        console.warn('Telegram credentials not configured');
        return res.status(500).json({ error: 'Telegram credentials not configured' });
      }

      const message = `
<b>НОВАЯ ЗАЯВКА С САЙТА</b>

    <b>Имя:</b> ${escapeTelegramHtml(name)}
    <b>Телефон:</b> ${escapeTelegramHtml(phone)}
    <b>Компания:</b> ${escapeTelegramHtml(company)}
    <b>Комментарий:</b> ${escapeTelegramHtml(comment)}
      `;

      // Рассылаем всем получателям независимо: если один ID ещё не нажал
      // /start боту, остальные всё равно должны получить заявку.
      const results = await Promise.allSettled(
        chatIds.map(async (chatId) => {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML',
            }),
          });

          if (!response.ok) {
            const telegramError = await response.text();
            throw new Error(`chat_id ${chatId}: ${response.status} ${telegramError}`);
          }
        }),
      );

      const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
      failures.forEach((f) => console.error('Telegram API error:', f.reason));

      if (failures.length === results.length) {
        // Не доставлено вообще никому — это настоящая ошибка для клиента.
        return res.status(502).json({ error: 'Telegram rejected the message' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distDir = path.resolve(__dirname, 'dist');

    // Файлы в /assets собираются с хешем в имени — их можно кэшировать навсегда.
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        immutable: true,
        maxAge: '1y',
        fallthrough: false,
      }),
    );

    app.use(
      express.static(distDir, {
        maxAge: '7d',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          }
        },
      }),
    );

    // Каждый настоящий маршрут (главная и все страницы услуг) уже лежит
    // на диске своим собственным index.html — express.static() выше сам
    // их находит и обслуживает. Сюда, в catch-all, запрос попадает только
    // если такого файла не нашлось: значит адрес либо с опечаткой, либо
    // вообще не существует. Google должен увидеть честный 404, а не копию
    // главной страницы — иначе он решит, что на сайте бесконечно много
    // одинаковых страниц-дублей.
    app.get('*', (req, res) => {
      res.status(404).sendFile(path.join(distDir, '404.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
