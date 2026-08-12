import { DEMO_ROUTES } from '../examples/routes';
import { GUIDE_PATHS, HOME_PATH } from './nav';

export type PageMeta = {
  title: string;
  description: string;
};

const SITE_NAME = '@persian-web/core';

const GUIDE_META: Record<string, PageMeta> = {
  [GUIDE_PATHS.introduction]: {
    title: 'Introduction',
    description:
      'Dependency-free TypeScript utilities for Persian digits, Jalali dates, RTL, typography, and Iranian form helpers.',
  },
  [GUIDE_PATHS.installation]: {
    title: 'Installation',
    description:
      'Install @persian-web/core from npm. ESM-only package with TypeScript declarations for every subpath.',
  },
  [GUIDE_PATHS.quickStart]: {
    title: 'Quick Start',
    description:
      'Import and run common @persian-web/core helpers: digits, Jalali dates, phone, search, and typography.',
  },
  [GUIDE_PATHS.api]: {
    title: 'API Reference',
    description:
      'Public API surface of @persian-web/core — modules, functions, types, and live examples.',
  },
  [GUIDE_PATHS.examples]: {
    title: 'Examples',
    description:
      'Executable examples for Iranian forms, catalog search, sorting, currency, and Jalali dates.',
  },
  [GUIDE_PATHS.browserSupport]: {
    title: 'Browser support',
    description:
      'Node.js, bundler, and browser compatibility for @persian-web/core and Intl dependencies.',
  },
  [GUIDE_PATHS.typescript]: {
    title: 'TypeScript usage',
    description:
      'TypeScript declarations, option types, and result unions shipped with @persian-web/core.',
  },
  [GUIDE_PATHS.useCases]: {
    title: 'Common use cases',
    description:
      'Practical recipes for form input, checkout, auth fields, search, slugs, and text direction.',
  },
  [GUIDE_PATHS.faq]: {
    title: 'FAQ',
    description:
      'Common questions about ESM, i18n scope, phone helpers, slugs, and the public API.',
  },
  [GUIDE_PATHS.playground]: {
    title: 'Playground',
    description:
      'Interactive playground that calls the real @persian-web/core API in the browser.',
  },
};

export function getPageMeta(path: string): PageMeta {
  if (path === HOME_PATH) {
    return GUIDE_META[GUIDE_PATHS.introduction]!;
  }

  const guide = GUIDE_META[path];
  if (guide) {
    return guide;
  }

  const route = DEMO_ROUTES.find((item) => item.path === path);
  if (route) {
    return {
      title: `${route.title} API`,
      description: route.descriptionEn,
    };
  }

  return {
    title: 'Page not found',
    description: 'The requested documentation page does not exist.',
  };
}

export function formatDocumentTitle(path: string): string {
  const meta = getPageMeta(path);
  return `${meta.title} · ${SITE_NAME}`;
}
