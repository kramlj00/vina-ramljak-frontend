'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { config } from '@/config';
import { useCart } from '@/context';
import { ShoppingCart, Menu, Globe } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navigation = () => {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('');

  const { t, i18n } = useTranslation();

  const navLinks = useMemo(
    () => [
      { path: t('navigation.winesAnchor'), label: t('navigation.wines') },
      { path: t('navigation.aboutAnchor'), label: t('navigation.about') },
      { path: t('navigation.galleryAnchor'), label: t('navigation.gallery') },
      { path: t('navigation.blogAnchor'), label: t('navigation.blog') },
      { path: t('navigation.contactAnchor'), label: t('navigation.contact') },
    ],
    [t],
  );

  const toggleLanguage = () => {
    const newLang = i18n.language === 'hr' ? 'en' : 'hr';
    i18n.changeLanguage(newLang);
  };

  // Handle initial scroll to hash on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && pathname === '/') {
      // Wait for DOM to be ready
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [pathname]);

  useEffect(() => {
    setActive(window.location.hash.slice(1) || pathname);

    const isHomePage = pathname === '/';
    if (isHomePage) {
      const observer = new IntersectionObserver(
        (entries) => {
          const intersectingSection = entries.find(
            (entry) => entry.isIntersecting,
          );
          if (intersectingSection) {
            const id = intersectingSection.target.id;
            setActive(id);
            window.history.replaceState(null, '', `#${id}`);
          } else {
            setActive('');
          }
        },
        {
          rootMargin: '-50% 0px -50% 0px',
        },
      );

      navLinks.forEach(({ path }) => {
        const element = document.getElementById(path);
        if (element) observer.observe(element);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [pathname, navLinks]);

  const handleLinkClick = (href: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${href}`;
      return;
    }

    setActive(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass w-full !border-none">
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 no-underline">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-gradient-wine">
            {config.metadata.name}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="list-none hidden md:flex gap-10 h-full">
          {navLinks.map((link) => (
            <li
              key={link.path}
              className={cn(
                'hover:text-white label-large font-semibold cursor-pointer relative h-full flex items-center group transition-all duration-300',
                active === link.path ? 'text-white' : 'text-white/80',
              )}
              onClick={() => handleLinkClick(link.path)}>
              <a href={`#${link.path}`}>{link.label}</a>

              <div
                className={cn(
                  'absolute bottom-0 left-0 h-1 rounded-full bg-accent mb-[-1px] w-0 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-700',
                  active === link.path && 'w-full opacity-100',
                )}
              />
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="hover:bg-white/10 hover:text-white py-1 px-2"
            aria-label={t('common.toggleLanguage')}>
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-xs">
              {i18n.language.split('-')[0].toUpperCase()}
            </span>
          </Button>

          <Link href="/cart" className="no-underline">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/10 hover:text-white py-1 px-2">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/10 hover:text-white py-1 px-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetTitle className="hidden"></SheetTitle>
            <SheetContent side="right" className="glass-strong w-[300px]">
              <ul className="list-none flex mt-8 space-y-6 flex-col">
                {navLinks.map((link) => (
                  <li
                    key={link.path}
                    className={cn(
                      'relative cursor-pointer font-semibold group',
                      active === link.path
                        ? 'text-white font-bold'
                        : 'text-white/80',
                    )}
                    onClick={() => handleLinkClick(link.path)}>
                    <a href={`#${link.path}`}>{link.label}</a>
                    <div
                      className={cn(
                        'absolute bottom-[-8px] left-0 h-1 w-0 rounded-full bg-accent opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-700',
                        active === link.path && 'w-full opacity-100',
                      )}
                    />
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
