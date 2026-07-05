export type SearchResultType = "project" | "task" | "goal" | "note" | "earning";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}
