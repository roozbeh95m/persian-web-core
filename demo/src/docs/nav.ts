import { API_MODULES } from './api-catalog';
import type { DocNavSection } from './types';

export const HOME_PATH = '/';

export const GUIDE_PATHS = {
  introduction: '/introduction',
  installation: '/installation',
  quickStart: '/quick-start',
  api: '/api',
  examples: '/examples',
  browserSupport: '/browser-support',
  typescript: '/typescript',
  useCases: '/use-cases',
  faq: '/faq',
  playground: '/playground',
} as const;

export const DOC_NAV: readonly DocNavSection[] = [
  {
    id: 'guides',
    label: 'Guides',
    items: [
      {
        path: GUIDE_PATHS.introduction,
        title: 'Introduction',
        titleFa: 'مقدمه',
      },
      {
        path: GUIDE_PATHS.installation,
        title: 'Installation',
        titleFa: 'نصب',
      },
      {
        path: GUIDE_PATHS.quickStart,
        title: 'Quick Start',
        titleFa: 'شروع سریع',
      },
      {
        path: GUIDE_PATHS.typescript,
        title: 'TypeScript',
        titleFa: 'تایپ‌اسکریپت',
      },
      {
        path: GUIDE_PATHS.browserSupport,
        title: 'Browser support',
        titleFa: 'پشتیبانی مرورگر',
      },
      {
        path: GUIDE_PATHS.useCases,
        title: 'Common use cases',
        titleFa: 'موارد رایج',
      },
      { path: GUIDE_PATHS.faq, title: 'FAQ', titleFa: 'پرسش‌ها' },
    ],
  },
  {
    id: 'api',
    label: 'API Reference',
    items: [
      { path: GUIDE_PATHS.api, title: 'Overview', titleFa: 'نمای کلی' },
      ...API_MODULES.map((module) => ({
        path: module.path,
        title: module.title,
        titleFa: module.titleFa,
      })),
    ],
  },
  {
    id: 'try',
    label: 'Try it',
    items: [
      {
        path: GUIDE_PATHS.examples,
        title: 'Examples',
        titleFa: 'نمونه‌ها',
      },
      {
        path: GUIDE_PATHS.playground,
        title: 'Playground',
        titleFa: 'زمین بازی',
      },
    ],
  },
] as const;

export function isGuidePath(path: string): boolean {
  return Object.values(GUIDE_PATHS).includes(
    path as (typeof GUIDE_PATHS)[keyof typeof GUIDE_PATHS],
  );
}
