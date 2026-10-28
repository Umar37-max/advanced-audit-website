import React, { useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';

const clients = [
  'DAVLAT GEOLOGIYA AXBOROT MARKAZI',
  '406-SON IXTISOSLASHTIRILGAN QURILISH-MONTAJ POEZDI',
  'REGIONALGEOLOGIYA',
  'TUPROQ TARKIBI VA REPOZITORIYSI SIFATI TAHLIL MARKAZI',
  'GAZAVTOMATIKA',
  'CHUANSIAN',
  'UZ-PRISTA RECYCLING',
  'UZ-PRISTA',
  "O'ZOG'IRSANOATLOYIHA",
  'CHORVOQ TURISTIK REKREATSION ZONA DIREKSIYASI',
  'ZEROPLUS',
  'SPECIAL REAL CONSTRUCTION',
  'XUSAN KON MUXANDISI',
  "TOSHAVTOTA'MIRXIZMAT",
  'UZAVTOMOTOBELGI',
  'LUXURY APARTMENTS',
  'ALI-BAZAR',
  'EUROPOL-EXCLUSIVE',
  'UZAUTOTRANS SERVICE',
  'NURAFSHON AVTOCENTR',
  'URGANCHKORMMASH',
  'XORAZM AVTOTRANSPORT SAVDO BOZORI',
  'NAVOIYURAN',
  'UZAUTO MOTORS',
  'RAINBOW AGRISCIENCE',
  'AGRO FINANS LIZING',
  'CHINA CONSTRUCTION SAUSUM',
  'MADANIY HAYOT MEDIA MARKETING MARKAZI',
  'DELTA CITY INNOVATION CENTER',
  'DATAPRIZMA',
  'SOFT NEWS',
];

export function Clients() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const stats = [
    { end: 1000, suffix: '+', labelKey: 'clients.stat1', clickable: true },
    { end: 1000, suffix: '+', labelKey: 'clients.stat2', clickable: false },
    { end: 20, suffix: '+', labelKey: 'clients.stat3', clickable: false },
  ];

  return (
    <Section id="clients" className="overflow-hidden">
      <SectionHeading
        eyebrow={t('clients.eyebrow')}
        title={t('clients.title')}
        subtitle={t('clients.subtitle')}
        align="center"
      />

      {/* Показатели */}
      <div
        ref={ref}
        className="mx-auto grid max-w-4xl gap-px overflow-hidden border border-line bg-line sm:grid-cols-3"
      >
        {stats.map((stat) => {
          const body = (
            <>
              <div className="display tabular text-4xl text-gold sm:text-5xl">
                {inView ? <CountUp end={stat.end} duration={2.2} /> : '0'}
                {stat.suffix}
              </div>
              <div className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted sm:text-[0.7rem]">
                {t(stat.labelKey)}
              </div>
            </>
          );

          return stat.clickable ? (
            <button
              key={stat.labelKey}
              onClick={() => setIsModalOpen(true)}
              className="group bg-paper px-4 py-9 text-center transition-colors hover:bg-paper-2"
            >
              {body}
              <span className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                {t('clients.all')} <ArrowRight size={12} />
              </span>
            </button>
          ) : (
            <div key={stat.labelKey} className="bg-paper px-4 py-9 text-center">
              {body}
            </div>
          );
        })}
      </div>

      {/* Бегущая строка с названиями клиентов */}
      <div className="group relative mt-16 flex w-full max-w-full overflow-hidden py-8">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-paper to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-paper to-transparent sm:w-32" />

        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="animate-marquee flex shrink-0 items-center whitespace-nowrap"
            aria-hidden={copy === 1}
          >
            {clients.map((client, index) => (
              <span
                key={`${copy}-${index}`}
                className="mx-7 text-sm font-medium uppercase tracking-[0.1em] text-ink-2"
              >
                {client}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Полный список клиентов */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex max-h-[82vh] w-full max-w-3xl flex-col border border-line bg-paper"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
                <h3 className="display text-2xl text-ink">{t('clients.all')}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-11 w-11 items-center justify-center text-ink-2 transition-colors hover:text-gold"
                  aria-label="Закрыть"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="custom-scrollbar overflow-y-auto px-5 py-5 sm:px-7">
                <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                  {clients.map((client, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 border-b border-line py-3 text-sm text-ink-2"
                    >
                      <span className="mt-2 h-px w-3 shrink-0 bg-gold" />
                      {client}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
