import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'amz-toolkit-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  // 保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(bookmarks)));
    } catch {
      console.error('Failed to save bookmarks to localStorage');
    }
  }, [bookmarks]);

  const toggleBookmark = (toolId: string) => {
    setBookmarks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const isBookmarked = (toolId: string) => bookmarks.has(toolId);

  return { bookmarks, toggleBookmark, isBookmarked };
}
