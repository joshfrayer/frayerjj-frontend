import React, { useMemo, useState } from 'react';

export function Wizard({
    steps = [],
    initialStep = 0,
    onStepChange,
    onComplete,
    validateStep
}) {
    const [stepIndex, setStepIndex] = useState(initialStep);
    const boundedStep = Math.max(0, Math.min(stepIndex, steps.length - 1));
    const step = steps[boundedStep];

    const canMoveNext = useMemo(() => {
        if (!validateStep) {
            return true;
        }
        return validateStep(boundedStep, step);
    }, [boundedStep, step, validateStep]);

    const goTo = next => {
        setStepIndex(next);
        onStepChange?.(next);
    };

    const next = () => {
        if (!canMoveNext) {
            return;
        }
        const nextStep = boundedStep + 1;
        if (nextStep >= steps.length) {
            onComplete?.();
            return;
        }
        goTo(nextStep);
    };

    const back = () => goTo(Math.max(0, boundedStep - 1));

    return (
        <div className="wizard">
            <div className="wizard-step active" data-step-index={boundedStep}>
                {step?.content}
            </div>
            <div className="d-flex gap-2 mt-3">
                <button
                    type="button"
                    className="btn btn-outline-secondary wizard-back"
                    onClick={back}
                    disabled={boundedStep === 0}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary wizard-next"
                    onClick={next}
                    disabled={!canMoveNext}
                >
                    {boundedStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
}
