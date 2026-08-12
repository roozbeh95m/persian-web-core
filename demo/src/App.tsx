import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';

import { Shell } from './components/Shell';
import { GUIDE_PATHS, HOME_PATH } from './docs/nav';
import { findRoute, pathFromHash } from './examples/routes';
import { useDocumentMeta } from './hooks/useDocumentMeta';
import { NotFoundPage } from './pages/NotFoundPage';

const DigitsPage = lazy(async () => ({
  default: (await import('./pages/DigitsPage')).DigitsPage,
}));
const NormalizePage = lazy(async () => ({
  default: (await import('./pages/NormalizePage')).NormalizePage,
}));
const NumbersPage = lazy(async () => ({
  default: (await import('./pages/NumbersPage')).NumbersPage,
}));
const CurrencyPage = lazy(async () => ({
  default: (await import('./pages/CurrencyPage')).CurrencyPage,
}));
const DatePage = lazy(async () => ({
  default: (await import('./pages/DatePage')).DatePage,
}));
const DirectionPage = lazy(async () => ({
  default: (await import('./pages/DirectionPage')).DirectionPage,
}));
const TypographyPage = lazy(async () => ({
  default: (await import('./pages/TypographyPage')).TypographyPage,
}));
const SearchPage = lazy(async () => ({
  default: (await import('./pages/SearchPage')).SearchPage,
}));
const SortPage = lazy(async () => ({
  default: (await import('./pages/SortPage')).SortPage,
}));
const SlugPage = lazy(async () => ({
  default: (await import('./pages/SlugPage')).SlugPage,
}));
const PhonePage = lazy(async () => ({
  default: (await import('./pages/PhonePage')).PhonePage,
}));
const NationalIdPage = lazy(async () => ({
  default: (await import('./pages/NationalIdPage')).NationalIdPage,
}));
const IntroductionPage = lazy(async () => ({
  default: (await import('./pages/guides/IntroductionPage')).IntroductionPage,
}));
const InstallationPage = lazy(async () => ({
  default: (await import('./pages/guides/InstallationPage')).InstallationPage,
}));
const QuickStartPage = lazy(async () => ({
  default: (await import('./pages/guides/QuickStartPage')).QuickStartPage,
}));
const ApiReferencePage = lazy(async () => ({
  default: (await import('./pages/guides/ApiReferencePage')).ApiReferencePage,
}));
const ExamplesPage = lazy(async () => ({
  default: (await import('./pages/guides/ExamplesPage')).ExamplesPage,
}));
const BrowserSupportPage = lazy(async () => ({
  default: (await import('./pages/guides/BrowserSupportPage'))
    .BrowserSupportPage,
}));
const TypeScriptPage = lazy(async () => ({
  default: (await import('./pages/guides/TypeScriptPage')).TypeScriptPage,
}));
const UseCasesPage = lazy(async () => ({
  default: (await import('./pages/guides/UseCasesPage')).UseCasesPage,
}));
const FaqPage = lazy(async () => ({
  default: (await import('./pages/guides/FaqPage')).FaqPage,
}));
const PlaygroundPage = lazy(async () => ({
  default: (await import('./pages/guides/PlaygroundPage')).PlaygroundPage,
}));

function readPath(): string {
  return pathFromHash(window.location.hash);
}

function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-live="polite">
      Loading…
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(readPath);
  const [navOpen, setNavOpen] = useState(false);

  useDocumentMeta(path);

  useEffect(() => {
    const onHashChange = () => {
      setPath(readPath());
      setNavOpen(false);
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => {
        document.getElementById('main-content')?.focus({ preventScroll: true });
      });
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
        page = <NotFoundPage path={path} onNavigate={navigate} />;
    }
  }

  return (
    <Shell
      path={path}
      navOpen={navOpen}
      onToggleNav={() => setNavOpen((open) => !open)}
      onNavigate={navigate}
    >
      <Suspense fallback={<PageFallback />}>{page}</Suspense>
    </Shell>
  );
}
