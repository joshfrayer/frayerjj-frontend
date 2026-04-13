import * as bootstrap from 'bootstrap';
import { createPopper } from '@popperjs/core';
import { avatarCropper } from './avatarCropper';
import { quillUpload } from './quillupload';
import { fileUpload } from './fileUpload';
import { hasMany } from './hasMany';
import { loading } from './loading';
import { msg } from './msg';
import { modal } from './modal';
import { wizard } from './wizard';
import { phoneInput } from './phoneInput';
import { session } from './session';
import { validate } from './validate';
import { autocomplete } from './autocomplete';

export const init = (args) => {

    window.bootstrap = bootstrap;
    window.createPopper = createPopper;
    window.msg = msg;
    window.modal = modal;
    window.session = session;
    window.validate = validate;
    window.loading = loading;
    window.wizard = wizard;
    window.autocomplete = autocomplete;
    loading.init(args?.loadingAnimationStyle ?? 'default');

    window.addEventListener('load', () => {

        msg.verbose('Page Loaded, Initializing');
        avatarCropper.init();
        quillUpload.init();
        fileUpload.init();
        hasMany.init();
        modal.ajax.init();
        phoneInput.init();
        validate.init();
        wizard.init();
        autocomplete.init();
        
        //Dynamic height for container-fixed
        let container = document.querySelectorAll('.container-fixed');
        if (container.length) {
            let setHeigth = () => {
                    let sub = document.querySelectorAll('.navbar,header,footer')
                if (container) {
                    let height = window.innerHeight;
                    sub.forEach((el) => {
                        height -= el.offsetHeight;
                    });
                    container.forEach((el) => {
                        el.style.height = height + 'px';
                    });
                }
            }
            setHeigth();
            window.addEventListener('resize', setHeigth);
        }

        // Update date/time values to browser settings.
        document.querySelectorAll('.dt-localize').forEach(el => {
            msg.verbose('Localizing Date/Time');
            const date = new Date(el.dataset.utc);
            el.innerText = date.toLocaleString();
        });
            
        // Updates the id in the form action inside a modal. Used for delete confirm and edit modals.
        document.querySelectorAll('.modal-uuid-update').forEach(el => {
            msg.verbose('Enabling Modal UUID Update');
            el.addEventListener('click', ev => {
                msg.verbose('Updating Modal UUID');
                ev.preventDefault();
                let uuid = el.getAttribute('inst-uuid'),
                    modalSelector = el.getAttribute('data-bs-target'),
                    form = document.querySelector(`${modalSelector} form`);
                if (uuid.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i) && form) {
                    let action = form.getAttribute('action');
                    if (action.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i))
                        action = action.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, uuid);
                    form.setAttribute('action', action);
                }
                else {
                    msg.warn('Unable to update modal UUID.');
                    modal.close();
                    modal.alert('Error', 'Unable to initialize form.');
                }
            });
        });

        // Automatically submits on change. Used in Page Nav Selects.
        document.querySelectorAll('.change-submit').forEach(el => {
            msg.verbose('Enabling Change Submit');
            el.addEventListener('change', () => {
                msg.verbose('Change Submit Triggered');
                el.closest('form').submit();
            });
        });

        // Confirm/Delete Modals
        document.querySelectorAll('.confirm-link').forEach(el => {
            msg.verbose('Enabling Confirm Link');
            el.addEventListener('click', ev => {
                msg.verbose('Confirm Link Triggered');
                ev.preventDefault();
                modal.confirm(
                    el.getAttribute('confirm-msg') || 'Are you sure?',
                    () => {
                        const href = el.getAttribute('href');
                        if (el.classList.contains('delete-link')) {
                            const form = document.createElement('form');
                            form.method = 'POST';
                            form.action = href;
                            const methodInput = document.createElement('input');
                            methodInput.type = 'hidden';
                            methodInput.name = '_method';
                            methodInput.value = 'DELETE';
                            form.appendChild(methodInput);
                            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                            if (csrfToken) {
                                const csrfInput = document.createElement('input');
                                csrfInput.type = 'hidden';
                                csrfInput.name = '_token';
                                csrfInput.value = csrfToken;
                                form.appendChild(csrfInput);
                            }
                            document.body.appendChild(form);
                            form.submit();
                        } else 
                            location.href = href;
                    },
                    () => {},
                    el.getAttribute('confirm-title') || 'Confirm',
                    el.getAttribute('confirm-yes') || 'Yes',
                    el.getAttribute('confirm-no') || 'No');
            });
        });

        // Filter Selects
        let filterSelects = document.querySelectorAll('.filter-select');
        if (filterSelects.length) filterSelects.forEach(select => {
            msg.verbose('Enabling Filter Select');
            select.addEventListener('change', ev => {
                msg.verbose('Filter Select Triggered');
                document.querySelectorAll('.filter-item').forEach(el => {
                    el.style.display = '';
                    filterSelects.forEach(filter => {
                        if (filter.value) {
                            let attr = filter.getAttribute('filter-attr');
                            if (el.getAttribute(attr) != filter.value)
                                el.style.display = 'none';
                        }
                    });
                });
            });
        });

        // Scroll to top button
        let toTop = document.getElementById('toTopBtn');
        if (toTop) {
            toTop.style.visibility = "hidden";
            toTop.addEventListener('click', () => {
                msg.verbose('Scrolling to Top');
                scrollTo(0, 0);
            });
            window.addEventListener('scroll', () => {
                if (scrollY > 1500) {
                    msg.verbose('Scrolling to Top Button Visible');
                    toTop.style.visibility = "visible";
                } else {
                    msg.verbose('Scrolling to Top Button Hidden');
                    toTop.style.visibility = "hidden";
                }
            });
        }

        // Tab Session Persistence
        const PERSIST_CLASS = 'tab-session-persist';
        document.querySelectorAll(`.${PERSIST_CLASS}`).forEach(container => {
            const storageKey = `activeTab_${window.location.pathname}_${container.id}`;
            const savedTarget = session.getStrVar(storageKey);
            msg.verbose(`Restoring tab for container #${container.id} with key ${storageKey}:`, savedTarget);
            if (savedTarget) {
                const tabEl = container.querySelector(`[data-bs-target="${savedTarget}"], [href="${savedTarget}"]`);
                if (tabEl) {
                    const tab = new bootstrap.Tab(tabEl);
                    tab.show();
                }
            }
        });
        document.addEventListener('shown.bs.tab', event => {
            const tabButton = event.target;
            const container = tabButton.closest(`.${PERSIST_CLASS}`);
            if (container) {
                const storageKey = `activeTab_${window.location.pathname}_${container.id}`;
                const target = tabButton.getAttribute('data-bs-target') || tabButton.getAttribute('href');
                session.set(storageKey, target);
                msg.verbose(`Saved active tab for container #${container.id} with key ${storageKey}:`, target);
            }
        });

    });

}