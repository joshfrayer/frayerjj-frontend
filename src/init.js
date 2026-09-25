import { autocomplete } from './autocomplete';
import { initShared } from './sharedInit';

export const init = (args) => {
    window.autocomplete = autocomplete;

    return initShared(args, async (use, sharedFeatures) => {
        if (use('popper')) {
            const { createPopper } = await import('@popperjs/core');
            window.createPopper = createPopper;
        }
        if (use('cropper')) {
            const { avatarCropper } = await import('./avatarCropper');
            window.avatarCropper = avatarCropper;
            avatarCropper.init();
        }
        if (use('quill')) {
            const { quillUpload } = await import('./quillupload');
            window.quillUpload = quillUpload;
            quillUpload.init();
        }
        if (use('fileUpload')) {
            const { fileUpload } = await import('./fileUpload');
            window.fileUpload = fileUpload;
            fileUpload.init();
        }
        if (use('hasMany')) {
            const { hasMany } = await import('./hasMany');
            window.hasMany = hasMany;
            hasMany.init();
        }
        sharedFeatures.modal();
        if (use('phoneInput')) {
            const { phoneInput } = await import('./phoneInput');
            window.phoneInput = phoneInput;
            phoneInput.init();
        }
        sharedFeatures.validate();
        if (use('wizard')) {
            const { wizard } = await import('./wizard');
            window.wizard = wizard;
            wizard.init();
        }
        if (use('autocomplete')) autocomplete.init();
    });
};