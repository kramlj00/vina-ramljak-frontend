'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { config } from '@/config';
import { Wine, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 mt-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm">{t('footer.backToTop')}</span>
            <span className="w-8 h-8 rounded-full animate-arrow-bounce shrink-0 bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowUp className="w-4 h-4" />
            </span>
          </button>
        </div>

        <div className="py-12 border-t border-white/10 gap-8 flex md:flex-row flex-col md:items-center justify-between">
          <div className="md:space-y-4 space-y-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2"
            >
              <Wine className="h-6 w-6 text-primary" />
              <h3 className="font-playfair text-2xl font-bold text-gradient-wine">
                {config.metadata.name}
              </h3>
            </button>
            <p className="text-sm text-muted-foreground">{t('footer.title')}</p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{t('footer.quickLinks.contactInfo.country')}</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
            </li>
            <li className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} {config.metadata.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href={`/#${t('navigation.privacyPolicyAnchor')}`}
              className="text-muted-foreground hover:text-gradient-wine text-sm transition-all duration-300"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <Link
              href={`/#${t('navigation.termsOfServiceAnchor')}`}
              className="text-muted-foreground hover:text-gradient-wine text-sm transition-all duration-300"
            >
              {t('footer.termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
