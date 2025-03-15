import * as bootstrap from 'bootstrap';
import { ajax } from './ajax.js';
import { message } from './message.js';

export const modal = {

    buildLine: vars => {
        let row = '<div class="row ' + (vars.rowClass ?? '') + '">';
        if (vars.label) row += '<label class="fw-bold text-dark">' + vars.label + "</label>";
        row += '</div>';
        return row;
    },

    buildInput: vars => {
        let input = '';
        if (vars.type == 'textarea') input += '<textarea class="form-control ';
        if (vars.type == 'select') input += '<select class="form-select ';
        else input += '<input type="' + vars.type + '" value="' + vars.value + '" placeholder="' + (vars.placeholder ?? vars.label) + '" class="form-control ';
        input += (vars.inputClass ?? '') + '" id="' + vars.id + '" aria-label="' + (vars.placeholder ?? vars.label) + '" ' + (vars.checked ? 'checked' : '') + '>';
        if (vars.type == 'textarea') input += vars.value + '</textarea>'
        if (vars.type == 'select') input += '</select>';
        return input;
    },

    buildInputLine: vars => {
        let row = '<div class="row ' + (vars.rowClass ?? '') + '">';
        if (vars.type == 'checkbox' || vars.type == 'radio') {
            row += modal.buildInput(vars);
            if (vars.label) row += '<label for="' + vars.id + '" class="fw-bold text-dark">' + vars.label + '</label>';
        } else {
            if (vars.label) row += '<label for="' + vars.id + '" class="fw-bold text-dark">' + vars.label + '</label>';
            row += '<div class="input-group">';
            if (vars.prepend) row += '<span class="input-group-text">' + vars.prepend + '</span>';
            row += modal.buildInput(vars);
            if (vars.append) row += '<span class="input-group-text">' + vars.append + '</span>';
            row += '</div></div>';
        }
        return row;
    },
    
    build: vars => {
        message.verbose('Building Dynamic Modal');
        let html =
            '<div id="' + vars.id + '" class="modal" tabindex="-1">' +
                '<div class="modal-dialog ' + (vars.class ?? '') + '">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<h5 class="modal-title">' + vars.title + '</h5>' +
                            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<div class="col">' + (vars.body ?? '');
        if (vars.inputs) Object.values(vars.inputs).forEach(i => {
            if (i.type) html += modal.buildInputLine(i);
            else html += modal.buildLine(i);
        });
        html +=
                            '</div>' +
                        '</div>' +
                        '<div class="modal-footer">';
        if (vars.buttons) Object.values(vars.buttons).forEach(b => {
            html += '<button type="button" class="btn btn-outline-secondary me-1 ' + (b.class ?? '') + '" data-bs-dismiss="modal">' + b.text + '</button>';
        });                
        html +=                
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        return html;
    },
    
    alert: (msg, title = "Alert", button = "OK") => {
        message.verbose('Building Alert Modal');
        document.querySelector('body').insertAdjacentHTML('beforeend', modal.build({
            id: 'alert-modal',
            title: title,
            body: '<p>' + msg + '</p>',
            buttons: [ { text: button } ]
        }));
        let alertModal = document.getElementById('alert-modal');
        alertModal.addEventListener('hidden.bs.modal', ev => {
            ev.target.remove();
        });
        let bsAlertModal = new bootstrap.Modal(alertModal);
        bsAlertModal.show();
    },
    
    confirm: (msg, onConfirm, onCancel, title = "Are you sure?", buttonYes = "Yes", buttonNo = "No") => {
        message.verbose('Building Confirm Modal');
        document.querySelector('body').insertAdjacentHTML('beforeend', modal.build({
            id: 'confirm-modal',
            title: title,
            body: '<p>' + msg + '</p>',
            buttons: [
                { text: buttonYes, class: 'btn-confirm' },
                { text: buttonNo, class: 'btn-outline-danger' } ]
        }));
        let confirmModal = document.getElementById('confirm-modal');
        confirmModal.addEventListener('hidden.bs.modal', ev => {
            ev.target.remove();
        });
        confirmModal.querySelector('.btn-confirm').addEventListener('click', () => {
            onConfirm();
        });
        confirmModal.querySelector('.btn-outline-danger').addEventListener('click', () => {
            onCancel();
        });
        let bsConfirmModal = new bootstrap.Modal(confirmModal);
        bsConfirmModal.show();
    },

    close: () => {
        message.verbose('Closing Modals');
        document.querySelectorAll('.modal').forEach(modal => {
            let bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
            else new bootstrap.Modal(modal).hide();
        });
    },
    
    ajax: {
    
        error: {
            load: { title: 'Unable to Load Data', msg: 'There was a problem trying to load data. Please try again.' },
            save: { title: 'Unable to Save Data', msg: 'There was a problem trying to save data. Please try again' }
        },
    
        init: () => {
            // Cycle through all AJAX Modals in DOM
            document.querySelectorAll('.ajax-modal').forEach(el => {
                message.verbose('Enabling AJAX Modal');
                el.addEventListener('click', () => {
                    message.verbose('Building AJAX Modal');
                    let buttons;
                    if (el.getAttribute('modal-info')) buttons = [{ text: 'OK' }];
                    else buttons = [{ text: 'Save', class: 'btn-save' }, { text: 'Cancel' }];
                    document.querySelector('body').insertAdjacentHTML('beforeend', modal.build({
                        id: el.getAttribute('data-bs-target').substring(1),
                        title: el.getAttribute('modal-title'),
                        body: '',
                        class: (el.getAttribute('modal-class') ?? ''),
                        buttons: buttons
                    }));
                    let ajaxModal = document.getElementById(el.getAttribute('data-bs-target').substring(1));
                    ajaxModal.addEventListener('hidden.bs.modal', ev => {
                        ev.target.remove();
                    });
                    let bsAjaxModal = new bootstrap.Modal(ajaxModal);
                    let ajaxModalBody = ajaxModal.querySelector('.modal-body');
                    bsAjaxModal.show();
                    loading.start(ajaxModalBody);
                    message.verbose('Loading AJAX Modal');
                    ajax({
                        method: 'GET',
                        uri: el.getAttribute('modal-load-uri'),
                        json: false,
                        success: html => {
                            ajaxModalBody.insertAdjacentHTML('afterbegin', html);
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
                            message.verbose('AJAX Modal Loaded');
                            if (!el.getAttribute('modal-info')) {
                                let saveButton = ajaxModal.querySelector('.btn-save');
                                saveButton.removeAttribute('data-bs-dismiss').addEventListener('click', () => {
                                    message.verbose('Saving AJAX Modal');
                                    loading.start(ajaxModal.querySelector('.modal-body'));
                                    let form = ajaxModal.querySelector('form');
                                    ajax({
                                        method: 'POST',
                                        uri: form.getAttribute('action'),
                                        vars: serialize(form),
                                        success: () => {
                                            message.verbose('AJAX Modal Saved');
                                            bsAjaxModal.hide();
                                            ajaxModal.remove();
                                            loading.stop();
                                        },
                                        failure: () => {
                                            message.warn('AJAX Modal Save Failed');
                                            modal.alert(modal.ajax.error.save.msg, modal.ajax.error.save.title);
                                            loading.stop();
                                        }
                                    });
                                });
                            }
                        },
                        failure: () => {
                            message.warn('AJAX Modal Load Failed');
                            loading.stop();
                            bsAjaxModal.hide();
                            ajaxModal.remove();
                            modal.alert(modal.ajax.error.load.msg, modal.ajax.error.load.title);
                        }
                    });
                });
            });
        }
    }
};