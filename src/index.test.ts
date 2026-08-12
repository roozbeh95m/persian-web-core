import { describe, expect, it } from 'vitest';

import * as core from './index.js';

describe('@persian-web/core', () => {
  it('loads as a module', () => {
    expect(core).toBeTypeOf('object');
  });
});
