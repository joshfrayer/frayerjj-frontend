import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { workflow } from './../../src/workflow.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('workflow module', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('mounts a workflow diagram from a data attribute', async () => {
        document.body.innerHTML = `
            <div
                class="workflow-diagram"
                data-workflow-steps='[{"id":"review","label":"Under Review","current":true}]'
            ></div>
        `;

        await act(async () => {
            workflow.init();
        });

        const currentStep = document.querySelector('[aria-current="step"]');
        expect(currentStep?.textContent).toContain('Under Review');
        expect(currentStep?.textContent).toContain('Current step');
    });

    it('reports malformed workflow data', () => {
        document.body.innerHTML = '<div class="workflow-diagram" data-workflow-steps="invalid"></div>';

        expect(() => workflow.init()).toThrow(
            'Workflow diagram data-workflow-steps must contain valid JSON'
        );
    });
});
