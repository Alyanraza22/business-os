import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  author: string;
  tags: string[];
  readingMinutes: number;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function listFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

function parseFile(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      author: String(data.author ?? "Business OS"),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingMinutes: readingMinutes(content),
    },
    content,
  };
}

/** All published posts, newest first. Metadata only. */
export function getAllPosts(): PostMeta[] {
  return listFiles()
    .map((file) => parseFile(file).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  return listFiles().map((file) => file.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): Post | null {
  const file = `${slug}.mdx`;
  if (!listFiles().includes(file)) return null;
  return parseFile(file);
}
