import { useEffect, useState } from 'react';

import { Shell } from './components/Shell';
import { HOME_PATH, findRoute, pathFromHash } from './examples/routes';
import { CurrencyPage } from './pages/CurrencyPage';
import { DatePage } from './pages/DatePage';
import { DigitsPage } from './pages/DigitsPage';
import { DirectionPage } from './pages/DirectionPage';
import { HomePage } from './pages/HomePage';
import { NationalIdPage } from './pages/NationalIdPage';
import { NormalizePage } from './pages/NormalizePage';
import { NumbersPage } from './pages/NumbersPage';
import { PhonePage } from './pages/PhonePage';
import { SearchPage } from './pages/SearchPage';
import { SlugPage } from './pages/SlugPage';
import { SortPage } from './pages/SortPage';
import { TypographyPage } from './pages/TypographyPage';

function readPath(): string {
  return pathFromHash(window.location.hash);
}

export default function App() {
  const [path, setPath] = useState(readPath);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setPath(readPath());
      setNavOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = HOME_PATH;
    }
  }, []);

  const navigate = (next: string) => {
    const normalized = next === HOME_PATH ? HOME_PATH : next;
    if (window.location.hash !== `#${normalized}`) {
      window.location.hash = normalized;
    } else {
      setPath(normalized);
      setNavOpen(false);
    }
  };

  const route = findRoute(path);

  let page = <HomePage onNavigate={navigate} />;
  if (route) {
    switch (route.path) {
      case '/digits':
        page = <DigitsPage />;
        break;
      case '/normalize':
        page = <NormalizePage />;
        break;
      case '/numbers':
        page = <NumbersPage />;
        break;
      case '/currency':
        page = <CurrencyPage />;
        break;
      case '/date':
        page = <DatePage />;
        break;
      case '/direction':
        page = <DirectionPage />;
        break;
      case '/typography':
        page = <TypographyPage />;
        break;
      case '/search':
        page = <SearchPage />;
        break;
      case '/sort':
        page = <SortPage />;
        break;
      case '/slug':
        page = <SlugPage />;
        break;
      case '/phone':
        page = <PhonePage />;
        break;
      case '/national-id':
        page = <NationalIdPage />;
        break;
      default:
        page = <HomePage onNavigate={navigate} />;
    }
  } else if (path !== HOME_PATH) {
    page = (
      <article className="page-hero">
        <h1>صفحه پیدا نشد</h1>
        <p>
          مسیر <code className="mono">{path}</code> تعریف نشده است.
        </p>
        <div className="btn-row">
          <a
            className="btn btn--secondary"
            href={`#${HOME_PATH}`}
            onClick={(event) => {
              event.preventDefault();
              navigate(HOME_PATH);
            }}
          >
            بازگشت به خانه
          </a>
        </div>
      </article>
    );
  }

  return (
    <Shell
      path={path}
      navOpen={navOpen}
      onToggleNav={() => setNavOpen((open) => !open)}
      onNavigate={navigate}
    >
      {page}
    </Shell>
  );
}
