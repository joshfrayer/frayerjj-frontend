import * as bootstrap from 'bootstrap';
import { createPopper } from '@popperjs/core';
import { message } from './message';
import { modal } from './modal';
import { validate } from './validate';
import { loading } from './loading';
import { ajax } from './ajax';
import { session } from './session';
import { ckeupload } from './ckeupload';
import { ClassicEditor } from '@ckeditor/ckeditor5-build-classic';

export const init = () => {

    window.bootstrap = bootstrap;
    window.createPopper = createPopper;
    window.message = message;
    window.modal = modal;
    window.ajax = ajax;
    window.session = session;
    window.validate = validate;
    window.loading = loading;
    window.ClassicEditor = ClassicEditor;
    loading.init();
    
    window.addEventListener('load', () => {

        message.verbose('Page Loaded, Initializing');
        validate.init();
        modal.ajax.init();
        ckeupload.init();
        
        // Updates the id in the form action inside a modal. Used for delete confirm and edit modals.
        document.querySelectorAll('.modal-uuid-update').forEach(el => {
            message.verbose('Enabling Modal UUID Update');
            el.addEventListener('click', ev => {
                message.verbose('Updating Modal UUID');
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
                    message.warn('Unable to update modal UUID.');
                    modal.close();
                    modal.alert('Error', 'Unable to initialize form.');
                }
            });
        });

        // Automatically submits on change. Used in Page Nav Selects.
        document.querySelectorAll('.change-submit').forEach(el => {
            message.verbose('Enabling Change Submit');
            el.addEventListener('change', () => {
                message.verbose('Change Submit Triggered');
                el.closest('form').submit();
            });
        });

        // Confirm/Delete Modals
        document.querySelectorAll('.confirm-link').forEach(el => {
            message.verbose('Enabling Confirm Link');
            el.addEventListener('click', ev => {
                message.verbose('Confirm Link Triggered');
                ev.preventDefault();
                modal.confirm(
                    el.getAttribute('confirm-msg') || 'Are you sure?',
                    () => {
                        location.href = el.getAttribute('href');
                    },
                    () => {},
                    el.getAttribute('confirm-title') || 'Confirm',
                    el.getAttribute('confirm-yes') || 'Yes',
                    el.getAttribute('confirm-no') || 'No');
            });
        });

        // Scroll to top button
        let toTop = document.getElementById('toTopBtn');
        toTop.style.visibility = "hidden";
        toTop.addEventListener('click', () => {
            message.verbose('Scrolling to Top');
            scrollTo(0, 0);
        });
        window.addEventListener('scroll', () => {
            if (scrollY > 1500) {
                message.verbose('Scrolling to Top Button Visible');
                toTop.style.visibility = "visible";
            } else {
                message.verbose('Scrolling to Top Button Hidden');
                toTop.style.visibility = "hidden";
            }
        });

    });

}