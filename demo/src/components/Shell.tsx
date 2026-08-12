import { useEffect, useRef, type ReactNode } from 'react';

import { DOC_NAV, GUIDE_PATHS, HOME_PATH } from '../docs/nav';

declare const __LIB_VERSION__: string;

const GITHUB_URL = 'https://github.com/roozbeh95m/persian-web-core';
const NPM_URL = 'https://www.npmjs.com/package/@persian-web/core';

type ShellProps = {
  path: string;
  navOpen: boolean;
  onToggleNav: () => void;
  onNavigate: (path: string) => void;
  children: ReactNode;
};

export function Shell({
  path,
  navOpen,
  onToggleNav,
  onNavigate,
  children,
}: ShellProps) {
  const activePath = path === HOME_PATH ? GUIDE_PATHS.introduction : path;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const onToggleNavRef = useRef(onToggleNav);
  onToggleNavRef.current = onToggleNav;

  useEffect(() => {
    if (!navOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onToggleNavRef.current();
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const firstLink =
      sidebarRef.current?.querySelector<HTMLElement>('a.nav-link');
    firstLink?.focus();

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navOpen]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="topbar">
        <a
          className="brand"
          href={`#${GUIDE_PATHS.introduction}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(GUIDE_PATHS.introduction);
          }}
        >
          <span className="brand__mark" aria-hidden="true">
            pw
          </span>
          <span className="brand__text">
            <span className="brand__name">@persian-web/core</span>
            <span className="brand__tag">Documentation</span>
          </span>
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          className={`icon-button${navOpen ? ' is-active' : ''}`}
          aria-expanded={navOpen}
          aria-controls="demo-nav"
          aria-label={
            navOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          onClick={onToggleNav}
        >
          {navOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      <aside
        ref={sidebarRef}
        className={`sidebar${navOpen ? ' is-open' : ''}`}
        id="demo-nav"
        aria-label="Documentation"
      >
        <div className="sidebar__brand">
          <a
            className="brand"
            href={`#${GUIDE_PATHS.introduction}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.introduction);
            }}
          >
            <span className="brand__mark" aria-hidden="true">
              pw
            </span>
            <span className="brand__text">
              <span className="brand__name">@persian-web/core</span>
              <span className="brand__tag">Documentation</span>
            </span>
          </a>
          <p className="sidebar__version" dir="ltr">
            v{__LIB_VERSION__} · MIT · ESM
          </p>
        </div>

        <nav className="sidebar__scroll" aria-label="Primary">
          {DOC_NAV.map((section) => (
            <div key={section.id} className="nav-section">
              <p className="nav-section-label" id={`nav-${section.id}`}>
                {section.label}
              </p>
              <ul className="nav-list" aria-labelledby={`nav-${section.id}`}>
                {section.items.map((item) => {
                  const active = activePath === item.path;
                  return (
                    <li key={item.path}>
                      <a
                        className={`nav-link${active ? ' is-active' : ''}`}
                        href={`#${item.path}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          onNavigate(item.path);
                        }}
                      >
                        {item.title}
                        <span className="nav-link__en" lang="fa" dir="rtl">
                          {item.titleFa}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar__links">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
            npm
          </a>
        </div>
      </aside>

      <main className="app-main" id="main-content" tabIndex={-1}>
        <div className="app-main__inner">
          {children}
          <footer className="footer">
            <span dir="ltr">MIT · TypeScript · ESM · tree-shakeable</span>
            <span>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              {' · '}
              <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
                npm
              </a>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
