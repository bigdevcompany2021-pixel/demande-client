'use client';

import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<T>;
        // Merge with initial so new fields added later are always present
        setValue({ ...initial, ...parsed } as T);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
