import * as bootstrap from 'bootstrap';
import { ClassicEditor } from '@ckeditor/ckeditor5-build-classic';
import { createPopper } from '@popperjs/core';
import { avatarCropper } from './avatarCropper';
import { ckeupload } from './ckeupload';
import { fileUpload } from './fileUpload';
import { hasMany } from './hasMany';
import { loading } from './loading';
import { msg } from './msg';
import { modal } from './modal';
import { phoneInput } from './phoneInput';
import { session } from './session';
import { validate } from './validate';

export const init = () => {

    window.bootstrap = bootstrap;
    window.createPopper = createPopper;
    window.msg = msg;
    window.modal = modal;
    window.session = session;
    window.validate = validate;
    window.loading = loading;
    window.ClassicEditor = ClassicEditor;
    loading.init();
    
    window.addEventListener('load', () => {

        msg.verbose('Page Loaded, Initializing');
        avatarCropper.init();
        ckeupload.init();
        fileUpload.init();
        hasMany.init();
        modal.ajax.init();
        phoneInput.init();
        validate.init();

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
                        location.href = el.getAttribute('href');
                    },
                    () => {},
                    el.getAttribute('confirm-title') || 'Confirm',
                    el.getAttribute('confirm-yes') || 'Yes',
                    el.getAttribute('confirm-no') || 'No');
            });
        });

        // Filter Selects
        document.querySelectorAll('.filter-select').forEach(select => {
            msg.verbose('Enabling Filter Select');
            select.addEventListener('change', ev => {
                msg.verbose('Filter Select Triggered');
                if (el.value)
                    document.querySelectorAll('.filter-' + select.getAttribute('name')).forEach(el => {
                        if (el.classList.contains('filter-' + select.getAttribute('name') + '-' + select.value))
                            el.style.display = '';
                        else
                            el.style.display = 'none';
                    });
                else
                    document.querySelectorAll('.filter-' + select.getAttribute('name')).forEach(el => {
                        el.style.display = '';
                    });
            });
        });

        // Scroll to top button
        let toTop = document.getElementById('toTopBtn');
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

    });

}