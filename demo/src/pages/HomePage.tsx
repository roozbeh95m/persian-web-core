import { CodeBlock } from '../components/CodeBlock';
import { HomePlayground } from '../components/HomePlayground';
import { DEMO_ROUTES, HOME_PATH } from '../examples/routes';

const GITHUB_URL = 'https://github.com/roozbeh95m/persian-web-core';
const NPM_URL = 'https://www.npmjs.com/package/@persian-web/core';

const INSTALL = `npm install @persian-web/core`;

const IMPORT_EXAMPLES = `// Root entry — tree-shakeable
import {
  toPersianDigits,
  normalizePersian,
  toJalali,
  isRTL,
} from '@persian-web/core';

// Or import from a focused subpath
import { formatToman } from '@persian-web/core/currency';
import { isValidNationalId } from '@persian-web/core/national-id';`;

const BASIC_USAGE = `import {
  toPersianDigits,
  normalizePersian,
  toJalali,
  formatJalali,
} from '@persian-web/core';

toPersianDigits('Order #42');
// "Order #۴۲"

normalizePersian('كيلكسيون كلاسيك');
// "کیلکسیون کلاسیک"

const jalali = toJalali(2024, 3, 20);
formatJalali(jalali, { digits: 'persian', pattern: 'YYYY/MM/DD' });
// "۱۴۰۳/۰۱/۰۱"`;

const ADVANCED_USAGE = `import {
  includesPersian,
  sortPersian,
  formatIranianPhone,
  validateNationalId,
  getTextDirection,
} from '@persian-web/core';

includesPersian('گوشی سامسونگ كلاسیک', 'کلاس');
// true — Arabic kaf / Yeh differences are folded

sortPersian(['یوسف', 'آرش', 'كيان', '۱۲', '2']);
// ["2", "۱۲", "آرش", "كيان", "یوسف"]

formatIranianPhone('09121234567', {
  format: 'international',
  digits: 'persian',
});
// "+۹۸ ۹۱۲ ۱۲۳ ۴۵۶۷"

validateNationalId('0013542419');
// { valid: true }

getTextDirection('Android گوشی ۱۲۳');
// "mixed"`;

type HomePageProps = {
  onNavigate: (path: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <article className="home">
      <header className="hero">
        <p className="hero__eyebrow">Persian utilities for the modern web</p>
        <h1>@persian-web/core</h1>
        <p className="hero__lead">
          کتابخانه TypeScript برای ارقام فارسی، تاریخ جلالی، RTL، تایپوگرافی و
          فرم‌های ایرانی — بدون وابستگی سنگین.
        </p>
        <p className="hero__desc">
          ابزارهای خالص و tree-shakeable برای نرمال‌سازی متن، قالب‌بندی عدد و
          پول، اعتبارسنجی موبایل و کد ملی، جستجو و مرتب‌سازی فارسی. همه
          نمونه‌های این سایت خروجی واقعی همان API را نشان می‌دهند.
        </p>
        <div className="btn-row">
          <a
            className="btn btn--primary"
            href={`#${HOME_PATH}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(HOME_PATH);
              window.requestAnimationFrame(() => {
                document
                  .getElementById('playground')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
            }}
          >
            امتحان زنده
          </a>
          <a
            className="btn btn--secondary"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="btn btn--ghost"
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
        </div>
      </header>

      <section className="section" aria-labelledby="features-heading">
        <div className="section__header">
          <h2 id="features-heading">قابلیت‌ها</h2>
          <p>
            هر ماژول یک playground تعاملی دارد. روی کارت کلیک کنید تا ورودی را
            تغییر دهید و خروجی زنده کتابخانه را ببینید.
          </p>
        </div>
        <div className="feature-grid">
          {DEMO_ROUTES.map((route) => (
            <a
              key={route.path}
              className="feature-card"
              href={`#${route.path}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(route.path);
              }}
            >
              <div className="feature-card__meta">
                <h3>{route.titleFa}</h3>
                <code dir="ltr">{route.title}</code>
              </div>
              <p>{route.description}</p>
              <code dir="ltr">{route.importPath}</code>
            </a>
          ))}
        </div>
      </section>

      <section
        className="section"
        id="playground"
        aria-labelledby="playground-heading"
      >
        <div className="section__header">
          <h2 id="playground-heading">Playground تعاملی</h2>
          <p>
            مقدار را عوض کنید؛ خروجی و نمونه کد بلافاصله از توابع واقعی
            `@persian-web/core` ساخته می‌شوند.
          </p>
        </div>
        <HomePlayground />
      </section>

      <section className="section" aria-labelledby="api-heading">
        <div className="section__header">
          <h2 id="api-heading">شروع سریع API</h2>
          <p>
            نصب، import، استفاده پایه و چند سناریوی پیشرفته‌تر برای محصول واقعی.
          </p>
        </div>
        <div className="api-grid">
          <div className="api-card">
            <h3>Installation</h3>
            <p>بسته روی npm با پشتیبانی کامل TypeScript و ESM منتشر می‌شود.</p>
            <CodeBlock code={INSTALL} label="bash" />
          </div>
          <div className="api-card">
            <h3>Import</h3>
            <p>
              از entry اصلی یا subpathهای جدا مثل `digits` و `date` ایمپورت
              کنید.
            </p>
            <CodeBlock code={IMPORT_EXAMPLES} label="typescript" />
          </div>
          <div className="api-card">
            <h3>Basic usage</h3>
            <p>رایج‌ترین کارها: ارقام، نرمال‌سازی متن، تبدیل تاریخ جلالی.</p>
            <CodeBlock code={BASIC_USAGE} label="typescript" />
          </div>
          <div className="api-card">
            <h3>Advanced usage</h3>
            <p>
              جستجوی مقاوم به املا، مرتب‌سازی فارسی، تلفن، کد ملی و تشخیص جهت.
            </p>
            <CodeBlock code={ADVANCED_USAGE} label="typescript" />
          </div>
        </div>
      </section>
    </article>
  );
}
