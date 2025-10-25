import { TFunction } from 'i18next';

export interface GalleryCategory {
  id: string;
  title: string;
  coverImage: string;
  images: {
    src: string;
    alt: string;
  }[];
}

export const getGalleryCategories = (t: TFunction): GalleryCategory[] => {
  return [
    {
      id: 'vineyards',
      title: t('gallery.ourVineyard'),
      coverImage: '/images/gallery/hero-vineyard.jpg',
      images: [
        {
          src: '/images/gallery/hero-vineyard.jpg',
          alt: 'Vineyard at sunset',
        },
        {
          src: '/images/gallery/hero-vineyard.jpg',
          alt: 'Grape clusters',
        },
        {
          src: '/images/gallery/hero-vineyard.jpg',
          alt: 'Vineyard landscape',
        },
      ],
    },
  ];
};
