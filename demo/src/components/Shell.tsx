import type { ReactNode } from 'react';

import { DOC_NAV, GUIDE_PATHS, HOME_PATH } from '../docs/nav';

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

  return (
    <div className="app-shell">
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
          type="button"
          className="icon-button"
          aria-expanded={navOpen}
          aria-controls="demo-nav"
          onClick={onToggleNav}
        >
          Menu
        </button>
      </header>

      <aside className="sidebar" id="demo-nav" hidden={!navOpen}>
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
            v0.1.3 · MIT · ESM
          </p>
        </div>

        <div className="sidebar__scroll">
          {DOC_NAV.map((section) => (
            <div key={section.id} className="nav-section">
              <p className="nav-section-label">{section.label}</p>
              <ul className="nav-list">
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
                        <span className="nav-link__en">{item.titleFa}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="sidebar__links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            npm
          </a>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-main__inner">
          {children}
          <footer className="footer">
            <span dir="ltr">MIT · TypeScript · ESM · tree-shakeable</span>
            <span>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub
              </a>
              {' · '}
              <a href={NPM_URL} target="_blank" rel="noreferrer">
                npm
              </a>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
