import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { mdxComponents } from "@/features/marketing/components/mdx";
import { getPost, getPostSlugs } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${siteConfig.url}/blog/${meta.slug}`,
      type: "article",
      publishedTime: meta.date || undefined,
      authors: [meta.author],
    },
  };
}

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All posts
        </Link>

        <header className="border-border border-b pb-8">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span aria-hidden>·</span>
            <span>{meta.readingMinutes} min read</span>
            <span aria-hidden>·</span>
            <span>{meta.author}</span>
          </div>
          <h1 className="text-foreground mt-3 text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
            {meta.title}
          </h1>
          {meta.description ? (
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed text-pretty">
              {meta.description}
            </p>
          ) : null}
          {meta.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {meta.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </header>

        <div className="mt-8">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </div>
    </article>
  );
}
