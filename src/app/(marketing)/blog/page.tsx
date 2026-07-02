import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product notes, workflow ideas and design thinking from the team building Business OS.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog · ${siteConfig.name}`,
    description:
      "Product notes, workflow ideas and design thinking from Business OS.",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section className="min-h-[70vh] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Blog"
          title="Notes from building Business OS"
          description="Occasional writing on product, workflow and design. No noise."
        />

        <div className="mt-14">
          {posts.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No posts yet"
              description="We're just getting started. Check back soon for product notes and workflow ideas."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="border-border bg-card hover:border-primary/40 focus-visible:border-primary/40 focus-visible:ring-ring/25 group rounded-xl border p-6 transition-colors outline-none focus-visible:ring-[3px]"
                >
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                  <h2 className="text-foreground group-hover:text-primary mt-2 text-xl font-semibold tracking-tight transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
