import { msg } from './msg.js';
import { validate } from './validate.js';

export const wizard = {
    init: () => {
        msg.verbose('Initializing Wizard');
        document.querySelectorAll('.wizard').forEach(el => {
            const animated = el.getAttribute('wizard-animated') !== 'false';
            const animationSpeed = parseInt(el.getAttribute('wizard-animation-speed')) || 300;
            const steps = el.querySelectorAll('.wizard-step');
            let currentStep = 0;
            
            steps[currentStep].classList.add('active');
            steps[currentStep].style.opacity = 1;

            el.querySelectorAll('.wizard-next').forEach(button => {
                button.addEventListener('click', () => {
                    if (!validate.check(steps[currentStep])) {
                        msg.warn('Form failed validation. Please fix the errors before proceeding.');
                        return;
                    }
                    wizard.transition(steps[currentStep], steps[currentStep + 1], 'next', animated, animationSpeed);
                    currentStep++;
                });
            });
            el.querySelectorAll('.wizard-back').forEach(button => {
                button.addEventListener('click', () => {
                    wizard.transition(steps[currentStep], steps[currentStep - 1], 'back', animated, animationSpeed);
                    currentStep--;
                });
            });
        });
    },
    transition: (from, to, direction, animated, speed) => {
        if (!animated) {
            from.classList.remove('active');
            to.classList.add('active');
            return;
        }

        const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
        const inClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

        to.style.transition = 'none';
        to.classList.add('active', inClass);
        to.offsetHeight; // Trigger reflow
        from.style.transition = `transform ${speed}ms, opacity ${speed}ms`;
        to.style.transition = `transform ${speed}ms, opacity ${speed}ms`;
        from.classList.add(outClass);
        to.classList.remove(inClass);
        to.classList.add('slide-center');

        setTimeout(() => {
            from.classList.remove('active', outClass);
            to.classList.remove(inClass, 'slide-center');
            from.style.transition = '';
            to.style.transition = '';
        }, speed);
    }
};