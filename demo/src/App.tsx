import { useEffect, useState, type ReactNode } from 'react';

import { Shell } from './components/Shell';
import { GUIDE_PATHS, HOME_PATH } from './docs/nav';
import { findRoute, pathFromHash } from './examples/routes';
import { CurrencyPage } from './pages/CurrencyPage';
import { DatePage } from './pages/DatePage';
import { DigitsPage } from './pages/DigitsPage';
import { DirectionPage } from './pages/DirectionPage';
import { NationalIdPage } from './pages/NationalIdPage';
import { NormalizePage } from './pages/NormalizePage';
import { NumbersPage } from './pages/NumbersPage';
import { PhonePage } from './pages/PhonePage';
import { SearchPage } from './pages/SearchPage';
import { SlugPage } from './pages/SlugPage';
import { SortPage } from './pages/SortPage';
import { TypographyPage } from './pages/TypographyPage';
import { ApiReferencePage } from './pages/guides/ApiReferencePage';
import { BrowserSupportPage } from './pages/guides/BrowserSupportPage';
import { ExamplesPage } from './pages/guides/ExamplesPage';
import { FaqPage } from './pages/guides/FaqPage';
import { InstallationPage } from './pages/guides/InstallationPage';
import { IntroductionPage } from './pages/guides/IntroductionPage';
import { PlaygroundPage } from './pages/guides/PlaygroundPage';
import { QuickStartPage } from './pages/guides/QuickStartPage';
import { TypeScriptPage } from './pages/guides/TypeScriptPage';
import { UseCasesPage } from './pages/guides/UseCasesPage';

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
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!window.location.hash || window.location.hash === `#${HOME_PATH}`) {
      window.location.replace(`#${GUIDE_PATHS.introduction}`);
    }
  }, []);

  const navigate = (next: string) => {
    const normalized = next === HOME_PATH ? GUIDE_PATHS.introduction : next;
    if (window.location.hash !== `#${normalized}`) {
      window.location.hash = normalized;
    } else {
      setPath(normalized);
      setNavOpen(false);
    }
  };

  const route = findRoute(path);

  let page: ReactNode;

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
        page = <IntroductionPage onNavigate={navigate} />;
    }
  } else {
    switch (path) {
      case HOME_PATH:
      case GUIDE_PATHS.introduction:
        page = <IntroductionPage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.installation:
        page = <InstallationPage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.quickStart:
        page = <QuickStartPage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.api:
        page = <ApiReferencePage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.examples:
        page = <ExamplesPage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.browserSupport:
        page = <BrowserSupportPage />;
        break;
      case GUIDE_PATHS.typescript:
        page = <TypeScriptPage />;
        break;
      case GUIDE_PATHS.useCases:
        page = <UseCasesPage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.faq:
        page = <FaqPage onNavigate={navigate} />;
        break;
      case GUIDE_PATHS.playground:
        page = <PlaygroundPage onNavigate={navigate} />;
        break;
      default:
        page = (
          <article className="page-hero">
            <h1>Page not found</h1>
            <p>
              No documentation page for <code className="mono">{path}</code>.
            </p>
            <div className="btn-row">
              <a
                className="btn btn--secondary"
                href={`#${GUIDE_PATHS.introduction}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(GUIDE_PATHS.introduction);
                }}
              >
                Back to Introduction
              </a>
            </div>
          </article>
        );
    }
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
