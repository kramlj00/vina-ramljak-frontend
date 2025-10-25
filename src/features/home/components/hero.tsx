'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { config } from '@/config';
import { Wine, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/images/hero-vineyard.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-3xl mx-auto animate-fade-in">
          <Wine className="w-12 h-12 mx-auto mb-6 text-accent" />
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-gradient-wine">
            {config.metadata.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/90 font-inter">
            {t('hero.title')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`#${t('navigation.winesAnchor')}`}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg"
              >
                {t('hero.buttonExplore')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={`#${t('navigation.aboutAnchor')}`}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-border/50"
              >
                {t('hero.buttonOurStory')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
