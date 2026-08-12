import { useEffect } from 'react';

import { formatDocumentTitle, getPageMeta } from '../docs/page-meta';

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
): void {
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/** Keep <title> and primary description meta tags in sync with the hash route. */
export function useDocumentMeta(path: string): void {
  useEffect(() => {
    const meta = getPageMeta(path);
    document.title = formatDocumentTitle(path);
    upsertMeta('name', 'description', meta.description);
    upsertMeta('property', 'og:title', formatDocumentTitle(path));
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('name', 'twitter:title', formatDocumentTitle(path));
    upsertMeta('name', 'twitter:description', meta.description);
  }, [path]);
}
