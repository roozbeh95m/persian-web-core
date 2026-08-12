import type { ReactNode } from 'react';

import { DEMO_ROUTES, HOME_PATH } from '../examples/routes';

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
  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href={`#${HOME_PATH}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(HOME_PATH);
          }}
        >
          <span className="brand__mark" aria-hidden="true">
            pw
          </span>
          <span className="brand__text">
            <span className="brand__name">@persian-web/core</span>
            <span className="brand__tag">Docs & playground</span>
          </span>
        </a>
        <button
          type="button"
          className="icon-button"
          aria-expanded={navOpen}
          aria-controls="demo-nav"
          onClick={onToggleNav}
        >
          فهرست
        </button>
      </header>

      <aside className="sidebar" id="demo-nav" hidden={!navOpen}>
        <div className="sidebar__brand">
          <a
            className="brand"
            href={`#${HOME_PATH}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(HOME_PATH);
            }}
          >
            <span className="brand__mark" aria-hidden="true">
              pw
            </span>
            <span className="brand__text">
              <span className="brand__name">@persian-web/core</span>
              <span className="brand__tag">Docs & playground</span>
            </span>
          </a>
        </div>

        <p className="nav-section-label">Overview</p>
        <ul className="nav-list">
          <li>
            <a
              className={`nav-link${path === HOME_PATH ? ' is-active' : ''}`}
              href={`#${HOME_PATH}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(HOME_PATH);
              }}
            >
              خانه
              <span className="nav-link__en">Home</span>
            </a>
          </li>
        </ul>

        <p className="nav-section-label">Playgrounds</p>
        <ul className="nav-list">
          {DEMO_ROUTES.map((route) => {
            const active = path === route.path;
            return (
              <li key={route.path}>
                <a
                  className={`nav-link${active ? ' is-active' : ''}`}
                  href={`#${route.path}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(route.path);
                  }}
                >
                  {route.titleFa}
                  <span className="nav-link__en">{route.title}</span>
                </a>
              </li>
            );
          })}
        </ul>

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
            <span>MIT · TypeScript · ESM · tree-shakeable</span>
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
