"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getBlogPost } from "../home/utils";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const BlogPostView = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const post = useMemo(() => getBlogPost(t, id ?? ""), [t, id]);

  if (!post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <p className="text-center text-2xl font-bold">{t("blog.notFound")}</p>
        <Link href="/">
          <Button>{t("common.backToHome")}</Button>
        </Link>
      </div>
    );

  return (
    <article className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.backToHome")}
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="glass px-4 py-2 rounded-full text-sm font-medium text-accent inline-block mb-4">
              {post?.category}
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gradient-wine md:h-[50px]">
              {post?.title}
            </h1>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <time>
                  {new Date(post?.date ?? "").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post?.author}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-12">
            <img
              src={post?.image}
              alt={post?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-muted-foreground leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post?.content ?? "" }}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <Link href="/">
                <Button variant="outline" className="border-border/50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("common.backToHome")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostView;
