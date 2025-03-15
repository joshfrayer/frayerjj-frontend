import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { message } from "./message";

export const ckeupload = {
    adapter: editor => {
        editor.plugins.get('FileRepository').createUploadAdapter = loader => {
            return new CkeUploadAdapter(loader, editor.config._config.extraParams.uri, editor.config._config.extraParams.token);
        };
    },
    init: () => {
        class CkeUploadAdapter {
            constructor(loader, uri, token) {
                this.loader = loader;
                this.uri = uri;
                this.token = token;
            }
            upload() {
                return this.loader.file.then(file => new Promise((resolve, reject) => {
                    this._initRequest();
                    this._initListeners(resolve, reject, file);
                    this._sendRequest(file);
                }));
            }
            abort() {
                if (this.xhr) this.xhr.abort();
            }
            _initRequest() {
                const xhr = this.xhr = new XMLHttpRequest();
                xhr.open('POST', this.uri, true);
                xhr.setRequestHeader('X-CSRFToken', this.token);
                xhr.responseType = 'json';
            }
            _initListeners(resolve, reject, file) {
                const xhr = this.xhr;
                const loader = this.loader;
                const genericErrorText = `Couldn't upload file: ${ file.name }.`;
                xhr.addEventListener( 'error', () => reject(genericErrorText) );
                xhr.addEventListener( 'abort', () => reject() );
                xhr.addEventListener( 'load', () => {
                    const response = xhr.response;
                    if (!response || response.error)
                        return reject(response && response.error ? response.error.message : genericErrorText);
                    resolve({ default: response.url });
                });
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', evt => {
                        if (evt.lengthComputable) {
                            loader.uploadTotal = evt.total;
                            loader.uploaded = evt.loaded;
                        }
                    });
                }
            }
            _sendRequest(file) {
                const data = new FormData();
                data.append('file', file);
                this.xhr.send(data);
            }
        };
        window.editors = [];
        document.querySelectorAll('.wysiwyg').forEach(el => {
            ClassicEditor.create(el, {
                licenseKey: 'GPL',
                htmlSupport: {
                    allow: [{
                        name: /.*/,
                        attributes: true,
                        classes: true,
                        styles: true
                    }]
                },
                extraParams: {
                    uri: document.querySelector('meta[name="asset-upload"]').getAttribute('content'), 
                    token: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                extraPlugins: [ CkeUploadAdapter ]
            }).then(editor => {
                window.editors[el.id] = editor;
                message.verbose('CKEditor Initialized');
            }).catch( error => {
                console.error( 'There was a problem initializing the editor.', error );
            });
        }); 
    }
}