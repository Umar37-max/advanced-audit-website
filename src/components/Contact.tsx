import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Section, SectionHeading } from './ui/Section';
import { useLanguage } from '../LanguageContext';

const PHONES = ['+998 91 214 53 35', '+998 93 747 34 34', '+998 97 766 96 83', '+998 97 749 12 79'];
const EMAIL = 'best_audit_services@bk.ru';

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', comment: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', company: '', comment: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Section id="contact">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={t('contact.eyebrow')}
            title={t('contact.title')}
            subtitle={t('contact.subtitle')}
            className="mb-10"
          />

          <div className="space-y-8">
            <div className="flex gap-5">
              <Phone size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" />
              <div>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {t('contact.phones')}
                </h3>
                <div className="mt-3 space-y-1.5">
                  {PHONES.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="block text-[1.05rem] text-ink transition-colors hover:text-gold"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <hr className="hairline" />

            <div className="flex gap-5">
              <Mail size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" />
              <div>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Email
                </h3>
                <a
                  href={`mailto:${EMAIL}`}
                  className="mt-3 block break-all text-[1.05rem] text-ink transition-colors hover:text-gold"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            <hr className="hairline" />

            <div className="flex gap-5">
              <MapPin size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" />
              <div>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {t('contact.address')}
                </h3>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink">
                  {t('contact.address_val')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="surface self-start p-6 sm:p-9">
          <h3 className="display text-2xl text-ink sm:text-3xl">{t('contact.form_title')}</h3>
          <div className="rule-gold mt-5" />

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="field-label">
                {t('contact.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="field"
                placeholder={t('contact.name')}
              />
            </div>

            <div>
              <label htmlFor="phone" className="field-label">
                {t('contact.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="field"
                placeholder="+998"
              />
            </div>

            <div>
              <label htmlFor="company" className="field-label">
                {t('contact.company')}
              </label>
              <input
                type="text"
                id="company"
                name="company"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="field"
                placeholder={t('contact.company')}
              />
            </div>

            <div>
              <label htmlFor="comment" className="field-label">
                {t('contact.comment')}
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={formData.comment}
                onChange={handleChange}
                className="field resize-none"
                placeholder={t('contact.comment')}
              />
            </div>

            <button type="submit" disabled={status === 'submitting'} className="btn btn-primary w-full">
              <span>{status === 'submitting' ? t('contact.submitting') : t('contact.submit')}</span>
              {status !== 'submitting' && <ArrowRight size={16} />}
            </button>

            {status === 'success' && (
              <p className="flex items-start gap-2.5 border border-gold bg-gold-pale p-3.5 text-sm text-ink">
                <CheckCircle2 size={17} className="mt-px shrink-0 text-gold" />
                {t('contact.success')}
              </p>
            )}
            {status === 'error' && (
              <p className="flex items-start gap-2.5 border border-line-strong p-3.5 text-sm text-ink-2">
                <AlertCircle size={17} className="mt-px shrink-0" />
                {t('contact.error')}
              </p>
            )}
          </form>
        </div>
      </div>
    </Section>
  );
}
