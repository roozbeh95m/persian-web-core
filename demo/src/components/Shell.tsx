import type { ReactNode } from 'react';

import { DEMO_ROUTES, HOME_PATH } from '../examples/routes';

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
            P
          </span>
          <span className="brand__text">
            <span className="brand__name">@persian-web/core</span>
            <span className="brand__tag">Demo playground</span>
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
              P
            </span>
            <span className="brand__text">
              <span className="brand__name">@persian-web/core</span>
              <span className="brand__tag">Interactive demo</span>
            </span>
          </a>
        </div>
        <p className="nav-section-label">شروع</p>
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
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      opacity: 0.75,
                    }}
                  >
                    {route.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="app-main">
        <div className="app-main__inner">
          {children}
          <footer className="footer">
            <span>منبع: کتابخانه محلی `src/` از طریق Vite alias</span>
            <span>
              <a
                href="https://github.com/roozbeh95m/persian-web-core"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              {' · '}
              <a
                href="https://www.npmjs.com/package/@persian-web/core"
                target="_blank"
                rel="noreferrer"
              >
                npm
              </a>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
