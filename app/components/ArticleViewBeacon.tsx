"use client";

import { useEffect } from "react";

export function ArticleViewBeacon({ articleId }: { articleId: string }) {
  useEffect(() => {
    void fetch(`/api/articles/${articleId}/view`, { method: "POST", keepalive: true });
  }, [articleId]);
  return null;
}
