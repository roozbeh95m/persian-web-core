export type DocNavItem = {
  path: string;
  title: string;
  titleFa: string;
};

export type DocNavSection = {
  id: string;
  label: string;
  items: readonly DocNavItem[];
};

export type ApiExample = {
  /** Source shown in the docs (must match what `run` executes). */
  code: string;
  /** Executes the real library API for verified output. */
  run: () => unknown;
};

export type ApiOptionRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

export type ApiSymbol = {
  name: string;
  kind: 'function' | 'type';
  signature: string;
  description: string;
  options?: readonly ApiOptionRow[];
  examples?: readonly ApiExample[];
};

export type ApiModuleDoc = {
  id: string;
  /** Hash route for the module playground + reference page. */
  path: string;
  title: string;
  titleFa: string;
  importPath: string;
  description: string;
  symbols: readonly ApiSymbol[];
};
