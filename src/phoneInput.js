import { parsePhoneNumber } from 'libphonenumber-js/min';

export const phoneInput = {
    init: () => {
        document.querySelectorAll('.phone-input').forEach(el => {
            let group = document.createElement('div');
            group.className = 'input-group';
            let span = document.createElement('span');
            span.className = 'input-group-text';
            span.textContent = '+';
            group.appendChild(span);
            el.parentNode.insertBefore(group, el);
            group.appendChild(el);
            el.addEventListener('blur', ev => {
                let digits = el.value.replace(/\D/g, '');
                let phone = parsePhoneNumber('+1' + digits);
                if (phone.country != 'US')
                    phone = parsePhoneNumber('+' + digits);
                if (phone.country) {
                    el.value = phone.formatInternational();
                    el.classList.remove('is-invalid');
                    let flag = document.createElement('span');
                    flag.classList.add('fi', 'fi-' + phone.country.toLowerCase());
                    el.parentNode.querySelector('.input-group-text').innerHTML = flag.outerHTML;
                } else {
                    el.classList.add('is-invalid');
                    el.parentNode.querySelector('.input-group-text').innerHTML = '+';
                }
            });
            if (el.value)
                el.dispatchEvent(new Event('blur'));
        });
    }
};