import { describe, expect, it } from 'vitest';
import * as moduleExports from './../../src/modal.js';

describe('modal module', () => {
    it('exports at least one symbol', () => {
        expect(moduleExports).toBeTypeOf('object');
        expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
    });
});
