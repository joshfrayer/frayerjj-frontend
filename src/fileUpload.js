import { loading } from "./loading";
import { msg } from "./msg";
import { modal } from "./modal";

export const fileUpload = {
    
    imgFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],

    icons: {
        'application/msword': 'fa-file-word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
        'application/vnd.ms-excel': 'fa-file-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel',
        'application/vnd.ms-powerpoint': 'fa-file-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa-file-powerpoint',
        'application/pdf': 'fa-file-pdf',
    },
    
    sampleArgs: {
        name: 'files', // Variable name
        mimes: ['image/jpeg', 'image/png'], // Allowed MIME types
        iconSize: 128, // Icon size
        files: [ // Existing files
            { id: 1, name: 'file1.jpg', mime: 'image/jpeg', uri: '/path/to/file1.jpg' },
        ],
        messages: { // Messages
            instructions: 'Drag and drop files here or click the button below.',
            browse: 'Browse',
            close: 'Close',
            view: 'View',
            delete: 'Delete',
            errorTitle: 'Error',
            uploadError: 'Error uploading file.',
            deleteError: 'Error deleting file.'
        },
        uris: { // URIs
            upload: '/path/to/upload',
            delete: '/path/to/delete'
        }
    },

    build: {

        core: args => {
            let container = document.createElement('div');
            let list = document.createElement('ul');
            list.classList.add('upload-files');
            Objects.values(args.files).forEach(file => {
                list.insertAdjacentHTML('beforeend', fileUpload.build.item(args, file));
            });
            let input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            let instructions = document.createElement('div');
            instructions.classList.add('upload-instructions');
            let icon = document.createElement('span');
            icon.classList.add('fas', 'fa-arrow-alt-circle-u');
            instructions.appendChild(icon);
            let text = document.createElement('p');
            text.textContent = args.messages.instructions ?? fileUpload.sampleArgs.messages.instructions;
            instructions.appendChild(text);
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-secondary', 'btn-browse');
            button.textContent = args.messages.browse ?? fileUpload.sampleArgs.messages.browse;
            instructions.appendChild(button);
            container.appendChild(list);
            container.appendChild(input);
            container.appendChild(instructions);
            return container.outerHTML;
        },

        item: (args, file) => {
            let item = document.createElement('li');
            item.classList.add('upload-file');
            item.title = file.name;
            item.setAttribute('data-uri', file.uri);
            if (fileUpload.imgFormats.includes(file.mime))
                item.classList.add('upload-type-image');
            else
                item.classList.add('upload-type-file');
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = args.name + '[]';
            input.value = file.id;
            item.appendChild(input);
            let icon = fileUpload.imgFormats.includes(file.mime) ? fileUpload.build.thumb(file) : fileUpload.build.icon(file);
            item.appendChild(icon);
            let heading = document.createElement('h6');
            heading.textContent = file.name;
            item.appendChild(heading);
            let buttons = document.createElement('div');
            buttons.classList.add('btn-group');
            let view = document.createElement('button');
            view.classList.add('btn', 'btn-outline-secondary', 'btn-view');
            view.textContent = args.messages.view ?? fileUpload.sampleArgs.messages.view;
            buttons.appendChild(view);
            let del = document.createElement('button');
            del.classList.add('btn', 'btn-outline-danger', 'btn-delete');
            del.textContent = args.messages.delete ?? fileUpload.sampleArgs.messages.delete;
            buttons.appendChild(del);
            item.appendChild(buttons);
            return item.outerHTML;
        },

        icon: file => {
            let icon = document.createElement('span');
            icon.classList.add('border', 'fas');
            if (fileUpload.icons[file.mime])
                icon.classList.add(fileUpload.icons[file.mime]);
            else
                icon.classList.add('fa-file');
            icon.style.width = fileUpload.iconSize + 'px';
            icon.style.height = fileUpload.iconSize + 'px';
            return icon;
        },

        thumb: file => {
            let thumb = document.createElement('img');
            thumb.src = file.uri;
            thumb.style.width = fileUpload.iconSize + 'px';
            thumb.style.height = fileUpload.iconSize + 'px';
            return thumb;
        }
    },

    delete: (el, item) => {
        loading.start(1, el);
        let data = new FormData();
        data.append('id', item.querySelector('input[type="hidden"]').value);
        fetch(el.getAttribute('data-delete-uri'), {
            method: 'POST',
            body: data,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        }).then(response => response.json()).then(result => {
            if (result.success)
                item.remove();
            else
                modal.alert(args.messages.errorTitle ?? fileUpload.sampleArgs.messages.errorTitle, args.messages.deleteError ?? fileUpload.sampleArgs.messages.deleteError);
            loading.stop();
        }).catch(error => {
            modal.alert(args.messages.errorTitle ?? fileUpload.sampleArgs.messages.errorTitle, args.messages.deleteError ?? fileUpload.sampleArgs.messages.deleteError);
            msg.error(error);
            loading.stop();
        });
    },

    init: () => {
        document.querySelectorAll('.file-upload').forEach(el => {
            // Get arguments
            let args = JSON.parse(el.innerHTML);
            // Build has many input
            el.innerHTML = fileUpload.build.core(args);
            // Add event listeners
            el.querySelector('.btn-browse').addEventListener('click', () => {
                el.querySelector('input[type="file"]').click();
            });
            el.querySelector('input[type="file"]').addEventListener('change', ev => {
                fileUpload.upload(el, args, ev.target.files);
            });
            el.addEventListener('dragover', ev => {
                ev.preventDefault();
                el.classList.add('dragover');
            });
            el.addEventListener('dragleave', ev => {
                el.classList.remove('dragover');
            });
            el.addEventListener('drop', ev => {
                ev.preventDefault();
                el.classList.remove('dragover');
                fileUpload.upload(el, args, ev.dataTransfer.files);
            });
            el.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    fileUpload.delete(el, btn.closest('.upload-file'));
                });
            });
            el.querySelectorAll('.btn-view').forEach(btn => {
                btn.addEventListener('click', () => {
                    fileUpload.view(args, btn.closest('.upload-file'));
                });
            });
        });
    },

    upload: (el, file, args) => {
        loading.start(1, el);
        let data = new FormData();
        data.append('owner', args.name);
        data.append('file', file[0]);
        fetch(args.uris.upload, {
            method: 'POST',
            body: data,
            headers: {
                'multipart': 'form-data',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        }).then(response => response.json()).then(result => {
            if (result.success)
                el.querySelector('.upload-files').insertAdjacentHTML('beforeend', fileUpload.build.item(args, result.file));
            else
                modal.alert(args.messages.errorTitle ?? fileUpload.sampleArgs.messages.errorTitle, args.messages.uploadError ?? fileUpload.sampleArgs.messages.uploadError);
            loading.stop();
        }).catch(error => {
            modal.alert(args.messages.errorTitle ?? fileUpload.sampleArgs.messages.errorTitle, args.messages.uploadError ?? fileUpload.sampleArgs.messages.uploadError);
            msg.error(error);
            loading.stop();
        });
    },

    view: (args, item) => {
        if (item.classList.contains('upload-type-image')) {
            let body = document.createElement('img');
            body.src = item.querySelector('img').src;
        }
        else {
            let body = document.createElement('iframe');
            body.src = `https://docs.google.com/gview?url=${window.location.protocol}//${window.location.host}${item.getAttribute('data-uri')}&embedded=true`;
        }
        let randomId = modal.randomId('fileview');
        document.querySelector('body').insertAdjacentHTML('beforeend', modal.build.modal({
            id: randomId,
            className: 'modal-lg',
            title: item.title,
            body: body.outerHTML,
            buttons: [{ text: args.messages.close ?? fileUpload.sampleArgs.messages.close }]
        }));
    }
};