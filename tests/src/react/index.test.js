import { describe, expect, it } from 'vitest';
import * as moduleExports from './../../../src/react/index.js';

describe('index module', () => {
    it('exports at least one symbol', () => {
        expect(moduleExports).toBeTypeOf('object');
        expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
    });
});
