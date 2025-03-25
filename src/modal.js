import { Modal } from 'bootstrap';
import { msg } from './msg.js';

export const modal = {
    
    ajax: {
    
        error: {
            load: { title: 'Unable to Load Data', msg: 'There was a problem trying to load data. Please try again.' },
            save: { title: 'Unable to Save Data', msg: 'There was a problem trying to save data. Please try again' }
        },
    
        init: () => {
            // Cycle through all AJAX Modals in DOM
            document.querySelectorAll('.ajax-modal').forEach(el => {
                msg.verbose('Enabling AJAX Modal');
                el.addEventListener('click', ev => {
                    ev.preventDefault();
                    msg.verbose('Building AJAX Modal');
                    let buttons;
                    if (el.getAttribute('modal-info'))
                        buttons = [{ text: 'OK' }];
                    else
                        buttons = [{ text: 'Save', class: 'btn-save' }, { text: 'Cancel' }];
                    let randomId = modal.randomId('ajax');
                    document.querySelector('body').insertAdjacentHTML('beforeend', modal.build.modal({
                        id: randomId,
                        title: el.getAttribute('modal-title'),
                        body: '',
                        class: (el.getAttribute('modal-class') ?? ''),
                        buttons: buttons
                    }));
                    let ajaxModal = document.getElementById(randomId),
                        ajaxModalBody = ajaxModal.querySelector('.modal-body');
                    ajaxModal.addEventListener('hidden.bs.modal', ev => {
                        ev.target.remove();
                    });
                    let bsAjaxModal = Modal.getOrCreateInstance(ajaxModal);
                    bsAjaxModal.show();
                    loading.start(0, ajaxModalBody);
                    msg.verbose('Loading AJAX Modal');
                    fetch(el.getAttribute('modal-load-uri'), { method: 'GET' }).then(response => {
                        ajaxModalBody.insertAdjacentHTML('afterbegin', response);
                        let images = ajaxModalBody.querySelectorAll('img')
                        if (images.length) {
                            let counter = images.length;
                            images.forEach(image => {
                                if (image.complete && --counter == 0) loading.stop();
                                else image.addEventListener('load', () => {
                                    if (--counter == 0) loading.stop();
                                });
                            });
                        } else loading.stop();
                        msg.verbose('AJAX Modal Loaded');
                        if (!el.getAttribute('modal-info')) {
                            msg.verbose('Adding submit handler to AJAX Modal');
                            ajaxModal.querySelector('.btn-save').addEventListener('click', () => {
                                msg.verbose('Submitting AJAX Modal');
                                loading.start(0, ajaxModalBody);
                                let form = ajaxModal.querySelector('form');
                                fetch(form.getAttribute('action'), {
                                    method: 'POST',
                                    body: new FormData(form)
                                }).then(response => {
                                    msg.verbose('AJAX Modal Saved');
                                    loading.stop();
                                    bsAjaxModal.hide();
                                    ajaxModal.remove();
                                }).catch(() => {
                                    msg.warn('AJAX Modal Save Failed');
                                    loading.stop();
                                    modal.alert(modal.ajax.error.save.msg, modal.ajax.error.save.title);
                                });
                            });
                        }
                    }).catch(() => {
                        msg.warn('AJAX Modal Load Failed');
                        loading.stop();
                        bsAjaxModal.hide();
                        ajaxModal.remove();
                        modal.alert(modal.ajax.error.load.msg, modal.ajax.error.load.title);
                    });
                });
            });
        }
    },

    alert: (msg, title = "Alert", button = "OK") => {
        msg.verbose('Building Alert Modal');
        let randomId = modal.randomId('confirm');
        document.querySelector('body').insertAdjacentHTML('beforeend', modal.build.modal({
            id: randomId,
            title: title,
            body: '<p>' + msg + '</p>',
            buttons: [ { text: button } ]
        }));
        let alertModal = document.getElementById(randomId),
            bsAlertModal = Modal.getOrCreateInstance(alertModal);
        alertModal.addEventListener('hidden.bs.modal', ev => {
            ev.target.remove();
        });
        modal.close();
        bsAlertModal.show();
    },

    build: {

        input: args => {
            let input;
            if (args.type == 'select') {
                input = document.createElement('select');
                input.className = 'form-select';
                if (args.opts)
                    for (let [key, val] of  Object.entries(args.opts)) {
                        let option = document.createElement('option');
                        option.value = key;
                        option.textContent = val;
                        if (key == args.value)
                            option.setAttribute('selected', 'selected');
                        input.appendChild(option);
                    }
            } else {
                if (args.type == 'textarea')
                    input = document.createElement('textarea');
                else {
                    input = document.createElement('input');
                    input.setAttribute('type', args.type);
                    input.value = args.value;
                }
                input.className = 'form-control';
                if (args.placeholder)
                    input.setAttribute('placeholder', args.placeholder);
            }
            input.id = args.id;
            input.setAttribute('aria-label', args.placeholder ?? args.label);
            if (args.checked)
                input.setAttribute('checked', 'checked');
            if (args.inputClass)
                input.classList.add(args.inputClass);
            return input.outerHTML;
        },
    
        inputLine: args => {
            let row = document.createElement('div');
            row.className = 'row';
            if (args.rowClass)
                row.classList.add(args.rowClass);
            row.insertAdjacentHTML('beforeend', modal.build.input(args));
            if (args.label)
                if (args.type == 'checkbox' || args.type == 'radio')
                    row.insertAdjacentHTML('beforeend', label);
                else
                    row.insertAdjacentHTML('afterbegin', modal.build.label(args));
            return row.outerHTML;
        },
    
        line: args => {
            let row = document.createElement('div');
            row.className = 'row';
            if (args.rowClass)
                row.classList.add(args.rowClass);
            if (args.label)
                row.insertAdjacentHTML('beforeend', modal.build.label(args));
            return row.outerHTML;
        },
    
        label: args => {
            let label = document.createElement('label');
            label.setAttribute('for', args.id);
            label.className = 'fw-bold text-dark';
            label.textContent = args.label;
            return label.outerHTML;
        },

        modal: args => {
            msg.verbose('Building Dynamic Modal');
            
            // Modal container
            let modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = args.id;
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-labelledby', args.title);
    
            // Modal dialog
            let modalDialog = document.createElement('div');
            modalDialog.className = 'modal-dialog';
            if (args.className)
                modalDialog.classList.add(args.class);
    
            // Modal content
            let modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
    
            // Modal header
            let modalHeader = document.createElement('div');
            modalHeader.className = 'modal-header';
    
            let modalTitle = document.createElement('h5');
            modalTitle.className = 'modal-title';
            modalTitle.id = `${args.id}Label`;
            modalTitle.textContent = args.title;
    
            let closeButton = document.createElement('button');
            closeButton.className = 'btn-close';
            closeButton.setAttribute('type', 'button');
            closeButton.setAttribute('data-bs-dismiss', 'modal');
            closeButton.setAttribute('aria-label', 'Close');
    
            modalHeader.appendChild(modalTitle);
            modalHeader.appendChild(closeButton);
    
            // Modal body
            let modalBody = document.createElement('div');
            modalBody.className = 'modal-body';
            modalBody.innerHTML = args.body ?? '';
    
            if (args.inputs)
                Object.values(args.inputs).forEach(i => {
                    if (i.type)
                        modalBody.insertAdjacentHTML('beforeend', modal.build.inputLine(i));
                    else
                        modalBody.insertAdjacentHTML('beforeend', modal.build.line(i));
                });
    
            // Modal footer
            let modalFooter = document.createElement('div');
            modalFooter.className = 'modal-footer';
    
            if (args.buttons)
                Object.values(args.buttons).forEach(b => {
                    let button = document.createElement('button');
                    button.className = 'btn btn-outline-secondary me-1';
                    if (b.class)
                        button.classList.add(b.class);
                    button.setAttribute('type', 'button');
                    button.setAttribute('data-bs-dismiss', 'modal');
                    button.textContent = b.text;
                    modalFooter.appendChild(button);
                });
                
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);
            modalDialog.appendChild(modalContent);
            modal.appendChild(modalDialog);
    
            return modal.outerHTML;
        }
    },
    
    close: () => {
        msg.verbose('Closing Modals');
        document.querySelectorAll('.modal').forEach(modal => {
            let bsModal = Modal.getOrCreateInstance(modal);
            if (bsModal) bsModal.hide();
        });
    },

    confirm: (msg, onConfirm, onCancel, title = "Are you sure?", buttonYes = "Yes", buttonNo = "No") => {
        msg.verbose('Building Confirm Modal');
        let randomId = modal.randomId('confirm');
        document.querySelector('body').insertAdjacentHTML('beforeend', modal.build.modal({
            id: randomId,
            title: title,
            body: '<p>' + msg + '</p>',
            buttons: [
                { text: buttonYes, class: 'btn-confirm' },
                { text: buttonNo, class: 'btn-outline-danger' } ]
        }));
        let confirmModal = document.getElementById(randomId),
            bsConfirmModal = Modal.getOrCreateInstance(confirmModal);
        confirmModal.addEventListener('hidden.bs.modal', ev => {
            ev.target.remove();
        });
        confirmModal.querySelector('.btn-confirm').addEventListener('click', () => {
            onConfirm();
        });
        confirmModal.querySelector('.btn-outline-danger').addEventListener('click', () => {
            onCancel();
        });
        modal.close();
        bsConfirmModal.show();
    },

    randomId: (base = 'modal') => {
        return `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    }
    
};