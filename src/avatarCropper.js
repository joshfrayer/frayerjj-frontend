import Cropper from 'cropperjs';
import { modal } from './modal';

export const avatarCropper = {

    export: (selection, redirect) => {
        selection.$toCanvas().then(canvas => {
            canvas.toBlob(blob => {
                let formData = new FormData();
                formData.append('file', blob, 'avatar.png');
                // Send the blob to the server
                fetch(window.location.href, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                }).then(response => {
                    if (response.ok) {
                        // Show success message
                        modal.alert('Avatar updated successfully.');
                        // Redirect to the specified URL
                        window.location.href = redirect;
                    } else
                        // Show error message
                        modal.alert('Error updating avatar. Please try again.');
                });
            });
        });
    },

    loadImage: (file, cropperImg, selection, exportBtn) => {
        // If valid image
        if (file && file.type.match(/image.*/)) {
            // Load image
            let reader = new FileReader();
            reader.onload = () => {
                // Set image on Cropper
                cropperImg.onload = () => {
                    // Reset selector
                    selection.$reset();
                    selection.$center();
                    // Show export button
                    exportBtn.style.display = 'block';
                }
                cropperImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else
            // Show error message
            modal.alert('Invalid file type. Please select an image file.');
    },

    init:() => {
        let img = document.getElementById('avatar-cropper');
        if (img) {

            // Set the image to a transparent 1x1 pixel
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

            // Initialize the cropper
            new Cropper(img);
            let canvas = document.querySelector('cropper-canvas');
            canvas.classList.add('container-fixed');
            window.dispatchEvent(new Event('resize'));
            let selection = document.querySelector('cropper-selection');
            selection.style.overflow = 'hidden';
            selection.style.borderRadius = '50%';
            selection.aspectRatio = 1;
            let cropperImg = document.querySelector('cropper-image');

            // Set export button
            let exportBtn = document.querySelector(cropperImg.getAttribute('data-export-btn'));
            let redirectUrl = img.getAttribute('data-redirect');
            exportBtn.style.display = 'none';
            exportBtn.addEventListener('click', () => {
                avatarCropper.export(selection, redirectUrl);
            });

            // Create a file input element
            let fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', 'image/*');
            fileInput.style.display = 'none';
            img.insertAdjacentElement('afterend', fileInput);
            fileInput.addEventListener('change', ev => {
                avatarCropper.loadImage(ev.target.files[0], cropperImg, selection, exportBtn);
            });

            // Set upload button
            let uploadBtn = document.querySelector(img.getAttribute('data-upload-btn'));
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }
};