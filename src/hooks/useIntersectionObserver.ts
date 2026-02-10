import { useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Custom hook for detecting when an element enters the viewport
 * Used for infinite scroll implementation
 */
export const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  rootMargin = '100px',
  threshold = 0.1,
}: UseIntersectionObserverProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [enabled, onIntersect, rootMargin, threshold]);

  return observerRef;
};
