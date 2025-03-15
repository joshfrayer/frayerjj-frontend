import { message } from './message.js';

export const validate = {
    methods: {
        required: input => {
            return input.value.length > 0;
        },
        identifier: input => {
            return /^[a-z0-9_-]*$/i.test(input.value) && input.value.length > 0 && input.value.length <= 50;
        },
        email: input => {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value);
        },
        uri: input => {
            return /^\/[0-9a-z?=&#~:@!$+,;%()*\/\-[\]\.]*$/i.test(input.value);
        },
        url: input => {
            return /^((http|https):\/\/[a-z0-9_]+([\-\.]{1}[a-z_0-9]+)*\.[_a-z]{2,5}(:[0-9]{1,5})?)?\/[0-9a-z?=&#~:@!$+,;%()*\/\-[\]\.]*$/i.test(input.value);
        },
        zip: input => {
            return /^[0-9]{5}(-)?([0-9]{4})?$/.test(input.value);
        },
        regexp: input => {
            return new RegExp(input.getAttribute('pattern')).test(input.value);
        }
    },
    check: form => {
        let blurEvent = new Event('blur');
        form.querySelectorAll('input,select,textarea').forEach(input => {
            input.dispatchEvent(blurEvent);
        });
        return form.querySelectorAll('input.is-invalid,select.is-invalid,textarea.is-invalid').length == 0;
    },
    init: () => {
        message.verbose('Initializing Validation');
        Object.entries(validate.methods).forEach(([ className, validationMethod ]) => {
            document.querySelectorAll('input.' + className + ',select.' + className + ',textarea.' + className).forEach(input => {
                input.addEventListener('blur', () => {
                    if (validationMethod(input)) {
                        input.classList.add('is-valid');
                        input.classList.remove('is-invalid');
                    } else {
                        input.classList.add('is-invalid');
                        input.classList.remove('is-valid');
                    }
                });
            });
        });
        document.querySelectorAll('form:not(.skip-validation)').forEach(form => {
            form.addEventListener('submit', ev => {
                message.verbose('Form Submitted, Validating');
                if (!validate.check(form)) {
                    message.warn('Form failed validation. Submited cancelled.');
                    ev.preventDefault();
                    form.querySelector('input.is-invalid,select.is-invalid,textarea.is-invalid').focus();
                    message.warn('Form failed validation. Submited cancelled.');
                } 
            });
        });
    }
};