import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('init module', () => {
    it('source file exists', () => {
        expect(existsSync(path.resolve(__dirname, './../../src/init.js'))).toBe(true);
    });
});
