'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCart } from '@/context';
import { ArrowLeft, ShoppingCart, WineIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getWine } from '../home/utils';

const WineView = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const wine = useMemo(() => getWine(t, id ?? ''), [t, id]);

  const handleAddToCart = () => {
    if (wine) {
      addToCart(wine);
    }
  };

  if (!wine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <p className="text-center text-2xl font-bold">{t('wine.notFound')}</p>
        <Link href="/">
          <Button>{t('common.backToHome')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href={`/#${t('navigation.winesAnchor')}`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToHome')}
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden glass">
            <img
              src={wine.imageSrc}
              alt={wine.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-inter font-medium text-accent uppercase tracking-wider">
                {wine.type}
              </span>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mt-2 text-gradient-wine">
                {wine.name}
              </h1>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-playfair font-bold text-gradient-gold">
                €{wine.price}
              </span>
              <span className="text-muted-foreground">
                {t('wine.perBottle')}
              </span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {wine.fullDescription}
            </p>

            <div className="glass rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {t('wine.vintage')}
                  </span>
                  <p className="font-semibold">{wine.vintage}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {t('wine.alcohol')}
                  </span>
                  <p className="font-semibold">{wine.alcohol}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {t('wine.grapes')}
                </span>
                <p className="font-semibold">{wine.grapes.join(', ')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-xl font-semibold mb-3">
                {t('wine.tastingNotes')}
              </h3>
              <ul className="space-y-2">
                {wine.tastingNotes.map((note, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-muted-foreground">
                    <WineIcon className="h-4 w-4 text-accent" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-playfair text-xl font-semibold mb-3">
                {t('wine.foodPairing')}
              </h3>
              <ul className="space-y-2">
                {wine.foodPairing.map((food, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-muted-foreground">
                    <span className="text-accent">•</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t('common.addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WineView;
