import { describe, expect, it, vi } from 'vitest';
import * as moduleExports from './../../src/slim.js';
import { init } from './../../src/slim.js';
import { modal } from './../../src/modal.js';

describe('slim module', () => {
    it('exports at least one symbol', () => {
        expect(moduleExports).toBeTypeOf('object');
        expect(Object.keys(moduleExports).length).toBeGreaterThan(0);
    });

    it('uses the configured CSRF field name for confirmed deletes', async () => {
        document.body.innerHTML = '<meta name="csrf-token" content="token-value"><a class="confirm-link delete-link" href="/item/1" confirm-token-name="csrf_token">Delete</a>';
        vi.spyOn(modal, 'confirm').mockImplementation((_message, onConfirm) => onConfirm());
        vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});

        init({ exclude: ['modal', 'validate'] });
        await new Promise(resolve => {
            window.addEventListener('load', () => setTimeout(resolve, 0), { once: true });
            window.dispatchEvent(new Event('load'));
        });
        document.querySelector('.confirm-link').click();

        const csrfInput = document.querySelector('form input[name="csrf_token"]');
        expect(csrfInput.value).toBe('token-value');
        vi.restoreAllMocks();
    });
});
