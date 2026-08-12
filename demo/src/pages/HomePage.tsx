import { DEMO_ROUTES } from '../examples/routes';

type HomePageProps = {
  onNavigate: (path: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <article>
      <header className="page-hero">
        <h1>@persian-web/core</h1>
        <p>
          زمین‌بازی تعاملی برای ابزارهای فارسی و RTL — ارقام، تاریخ جلالی،
          نرمال‌سازی، فرم‌های ایرانی و کمک‌های جهت متن. همه نمونه‌ها از سورس
          محلی کتابخانه تغذیه می‌شوند.
        </p>
      </header>

      <section className="install-box" aria-label="Installation">
        <h2>نصب</h2>
        <pre>{`npm install @persian-web/core

import { toPersianDigits, toJalali, isRTL } from '@persian-web/core';`}</pre>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>
          ماژول‌ها
        </h2>
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
              <h2>{route.titleFa}</h2>
              <p>{route.description}</p>
              <code>{route.importPath}</code>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
