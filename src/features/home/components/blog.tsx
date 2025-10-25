'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { ArrowRight } from 'lucide-react';

import SectionTitle from '@/components/section-title';
import { Button } from '@/components/ui/button';

import { blogPosts } from '../utils';

const Blog = () => {
  const { t } = useTranslation();

  const posts = blogPosts(t);

  return (
    <section id={t('navigation.blogAnchor')} className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t('blog.title')}
          description={t('blog.description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="glass rounded-lg overflow-hidden hover-lift group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="glass px-3 py-1 rounded-full text-xs font-medium text-accent">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-playfair text-2xl font-bold mb-3 text-gradient-wine">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-4">{post.excerpt}</p>

                <Link href={`/blog/${post.id}`}>
                  <Button variant="ghost" className="px-0 hover:px-2 h-auto">
                    {t('blog.readMore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
