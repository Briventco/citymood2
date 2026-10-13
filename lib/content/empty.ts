import { defaultCategories } from "./categories";
import type { ContentSource } from "./types";

// Production placeholder until a CMS is connected: the shell renders, the homepage shows its empty state.
export const emptySource: ContentSource = {
  categories: async () => defaultCategories,
  articles: async () => [],
};
