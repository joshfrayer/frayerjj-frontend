import React from 'react';
import { createRoot } from 'react-dom/client';
import { msg } from './msg.js';
import { WorkflowDiagram } from './react/WorkflowDiagram.jsx';

const roots = new WeakMap();

export const workflow = {
    init: () => {
        msg.verbose('Initializing Workflow Diagram');
        document.querySelectorAll('.workflow-diagram').forEach(element => {
            const serializedSteps = element.dataset.workflowSteps ?? element.getAttribute('workflow-steps');

            if (serializedSteps === null || serializedSteps === undefined) {
                throw new Error('Workflow diagram is missing data-workflow-steps');
            }

            let steps;
            try {
                steps = JSON.parse(serializedSteps);
            } catch (error) {
                throw new Error('Workflow diagram data-workflow-steps must contain valid JSON', { cause: error });
            }

            if (!Array.isArray(steps)) {
                throw new TypeError('Workflow diagram data-workflow-steps must contain an array');
            }

            const root = roots.get(element) ?? createRoot(element);
            roots.set(element, root);
            root.render(React.createElement(WorkflowDiagram, { steps }));
        });
    }
};