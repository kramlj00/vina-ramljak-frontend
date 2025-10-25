import { TFunction } from 'i18next';

export const getAboutUsDetails = (t: TFunction) => {
  return [
    {
      id: 'quality',
      title: t('about.quality'),
      description: t('about.qualityDescription'),
    },
    {
      id: 'tradition',
      title: t('about.tradition'),
      description: t('about.traditionDescription'),
    },
    {
      id: 'innovation',
      title: t('about.innovation'),
      description: t('about.innovationDescription'),
    },
    {
      id: 'terroir',
      title: t('about.terroir'),
      description: t('about.terroirDescription'),
    },
  ];
};
