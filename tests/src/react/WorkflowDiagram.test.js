import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WorkflowDiagram } from './../../../src/react/WorkflowDiagram.jsx';

describe('WorkflowDiagram', () => {
    it('renders workflow status and ISO dates from serialized step data', () => {
        const markup = renderToStaticMarkup(
            React.createElement(WorkflowDiagram, {
                steps: [
                    {
                        id: 'submitted',
                        label: 'Submitted',
                        complete: true,
                        date: '2026-10-14T13:00:00Z'
                    },
                    {
                        id: 'review',
                        label: 'Under Review',
                        current: true
                    }
                ]
            })
        );

        expect(markup).toContain('is-complete');
        expect(markup).toContain('aria-current="step"');
        expect(markup).toContain('Current step');
        expect(markup).toContain('dateTime="2026-10-14T13:00:00.000Z"');
    });

    it('does not render an empty workflow', () => {
        const markup = renderToStaticMarkup(
            React.createElement(WorkflowDiagram, { steps: [] })
        );

        expect(markup).toBe('');
    });
});
