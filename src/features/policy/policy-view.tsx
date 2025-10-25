'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ArrowLeft } from 'lucide-react';

import CustomMarkdown from '@/components/custom-markdown';
import { Button } from '@/components/ui/button';

import policyEn from './policy-en';
import policyHr from './policy-hr';

const PolicyView = () => {
  const { t, i18n } = useTranslation();

  const policyContent = useMemo(() => {
    switch (i18n.language.split('-')[0]) {
      case 'en':
        return policyEn;
      default:
        return policyHr;
    }
  }, [i18n.language]);

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToHome')}
          </Button>
        </Link>
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <h1 className="text-4xl md:text-5xl md:h-[50px] font-bold text-gradient-wine">
            {t('privacy.title')}
          </h1>
          <CustomMarkdown content={policyContent} />
        </div>
      </div>
    </div>
  );
};

export default PolicyView;
