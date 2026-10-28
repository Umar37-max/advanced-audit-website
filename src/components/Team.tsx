import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ZoomIn } from 'lucide-react';
import { Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';

// Фотографии лежат в папке public и подставляются по имени файла.
// Чтобы заменить фото сотрудника, положите новый файл в public и укажите его здесь.
// В публичном репозитории реальные фото и имена сотрудников не хранятся:
// используется нейтральная заглушка (public/team/placeholder.svg), имена и описания - в LanguageContext.
const TEAM_PHOTO_PLACEHOLDER = '/team/placeholder.svg';
interface Member {
  id: number;
  nameKey: string;
  positionKey: string;
  bioKey: string;
  photo: string;
  certificates: string[];
}

const teamKeys: Member[] = [
  { id: 1, nameKey: 'team.name.1', positionKey: 'team.pos.1', bioKey: 'team.bio.1', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 2, nameKey: 'team.name.2', positionKey: 'team.pos.2', bioKey: 'team.bio.2', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 3, nameKey: 'team.name.3', positionKey: 'team.pos.3', bioKey: 'team.bio.3', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 4, nameKey: 'team.name.4', positionKey: 'team.pos.4', bioKey: 'team.bio.4', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 5, nameKey: 'team.name.5', positionKey: 'team.pos.5', bioKey: 'team.bio.5', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 6, nameKey: 'team.name.6', positionKey: 'team.pos.6', bioKey: 'team.bio.6', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 7, nameKey: 'team.name.7', positionKey: 'team.pos.7', bioKey: 'team.bio.7', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 8, nameKey: 'team.name.8', positionKey: 'team.pos.8', bioKey: 'team.bio.8', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 9, nameKey: 'team.name.9', positionKey: 'team.pos.9', bioKey: 'team.bio.9', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 10, nameKey: 'team.name.10', positionKey: 'team.pos.10', bioKey: 'team.bio.10', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
  { id: 11, nameKey: 'team.name.11', positionKey: 'team.pos.11', bioKey: 'team.bio.11', photo: TEAM_PHOTO_PLACEHOLDER, certificates: [] },
];

export function Team() {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = selectedMember ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  return (
    <Section id="team">
      <SectionHeading
        eyebrow={t('team.eyebrow')}
        title={t('team.title')}
        subtitle={t('team.subtitle')}
        align="center"
      />

      <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
        {teamKeys.map((member, index) => {
          const name = t(member.nameKey);
          const hasBio = t(member.bioKey).trim().length > 1;

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => hasBio && setSelectedMember(member)}
              className={`card group overflow-hidden text-left ${hasBio ? '' : 'cursor-default'}`}
              style={{ '--photo-delay': `${Math.min(index * 0.06, 0.5)}s` } as React.CSSProperties}
              aria-label={hasBio ? `${name} — ${t('team.more_info')}` : name}
            >
              <div className="photo-frame aspect-[3/4] bg-paper-3">
                <img
                  src={member.photo}
                  alt={`${name} — ${t(member.positionKey)}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70" />
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="display text-lg leading-tight text-ink sm:text-xl">{name}</h3>
                <p className="mt-1.5 text-[0.7rem] font-medium uppercase tracking-[0.13em] text-gold sm:text-xs">
                  {t(member.positionKey)}
                </p>
                {hasBio && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-muted transition-colors group-hover:text-gold">
                    {t('team.more_info')} <ArrowRight size={12} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Карточка сотрудника */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={() => setSelectedMember(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex max-h-[86vh] w-full max-w-4xl flex-col border border-line bg-paper"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center bg-paper/85 text-ink backdrop-blur transition-colors hover:text-gold"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>

              <div className="custom-scrollbar grid overflow-y-auto sm:grid-cols-[minmax(0,15rem)_1fr]">
                <div className="hidden bg-paper-3 sm:block">
                  <img
                    src={selectedMember.photo}
                    alt={t(selectedMember.nameKey)}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="p-6 sm:p-9">
                  <h3 className="display text-3xl text-ink">{t(selectedMember.nameKey)}</h3>
                  <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-gold">
                    {t(selectedMember.positionKey)}
                  </p>
                  <div className="rule-gold mt-5" />

                  <p className="mt-6 whitespace-pre-line text-[0.94rem] leading-relaxed text-ink-2">
                    {t(selectedMember.bioKey)}
                  </p>

                  {selectedMember.certificates.length > 0 && (
                    <div className="mt-9">
                      <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {t('team.certificates')}
                      </h4>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {selectedMember.certificates.map((cert) => (
                          <button
                            key={cert}
                            onClick={() => setSelectedCertificate(cert)}
                            className="group relative aspect-[4/3] overflow-hidden border border-line"
                          >
                            <img src={cert} alt="" loading="lazy" className="h-full w-full object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-paper opacity-0 transition-opacity group-hover:opacity-100">
                              <ZoomIn size={18} />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Просмотр сертификата */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <button
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-paper transition-colors hover:text-gold"
              aria-label="Закрыть"
            >
              <X size={24} />
            </button>
            <img
              src={selectedCertificate}
              alt=""
              className="max-h-[88vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
