import Quill from 'quill';
import { msg } from "./msg";

export const quillUpload = {
    init: () => {
        const uri = document.querySelector('meta[name="asset-upload"]').getAttribute('content');
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const selectLocalImage = (quillInstance) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();
            input.onchange = () => {
                const file = input.files[0];
                if (/^image\//.test(file.type)) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', uri, true);
                    xhr.setRequestHeader('X-CSRFToken', token);
                    xhr.responseType = 'json';
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            const response = xhr.response;
                            if (response && response.url) {
                                const range = quillInstance.getSelection();
                                quillInstance.insertEmbed(range.index, 'image', response.url);
                                quillInstance.setSelection(range.index + 1);
                            } else console.error('Upload failed: No URL returned.');
                        } else console.error(`Upload failed: ${xhr.statusText}`);
                    };
                    xhr.onerror = () => {
                        console.error('Upload failed: An error occurred during the upload.');
                    };
                    xhr.send(formData);
                } else console.error('Please select an image file.');
            };
        };
        window.editors = {};
        document.querySelectorAll('.wysiwyg').forEach(editor => {
            const inputName = editor.getAttribute('data-input-name');
            const hiddenInput = document.querySelector(`[name="${inputName}"]`);
            const quill = new Quill(editor, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [[{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'link'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['blockquote', 'code-block'],
                            ['image'],
                            ['clean']
                        ],
                        handlers: {
                            'image': () => selectLocalImage(quill)
                        }
                    }
                }
            });
            if (hiddenInput && !quill.root.innerHTML.trim()) quill.root.innerHTML = hiddenInput.value;
            quill.on('text-change', () => {
                if (hiddenInput) hiddenInput.value = quill.root.innerHTML;
                else console.error(`Hidden input with id "${inputId}" not found for editor.`);
            });
            if (editor.id) window.editors[editor.id] = quill;
            msg.verbose('Quill Initialized');
        });
    }
};