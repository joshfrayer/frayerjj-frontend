import React from 'react';

export function WorkflowDiagram({
    steps = []
}) {
    if (steps.length === 0) {
        return null;
    }

    return (
        <ol style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((step, index) => {
                const date = step.date ? new Date(step.date) : null;
                const hasValidDate = date && !Number.isNaN(date.getTime());
                const className = [
                    step.complete && 'is-complete',
                    step.current && 'is-current',
                    step.outcome && `is-${step.outcome}`
                ].filter(Boolean).join(' ');

                return (
                    <li
                        key={step.id ?? index}
                        className={className}
                        aria-current={step.current ? 'step' : undefined}
                    >
                        <span className="marker" aria-hidden="true">
                            {step.complete ? '✓' : index + 1}
                        </span>
                        <span className="label">{step.label}</span>
                        <span className="visually-hidden">
                            {step.complete ? 'Completed' : step.current ? 'Current step' : 'Not reached'}
                        </span>
                        {hasValidDate && (
                            <time className="date" dateTime={date.toISOString()}>
                                <span>{date.toLocaleDateString('en-US', { timeZone: 'America/Chicago' })}</span>
                                <span>{date.toLocaleTimeString('en-US', { timeZone: 'America/Chicago' })}</span>
                            </time>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
