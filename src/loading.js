import { message } from './message';
import { session } from './session';

export const loading = {

    rotation: session.getIntVar('loadingRotation', 3),

    build: el => {
        if (loading.interval != null) loading.clear();
        el.classList.add('loading')
        el.insertAdjacentHTML("afterbegin",
            '<div class="loader">' +
                '<div class="loader-circle"></div>' +
                '<div class="loader-line-mask" style="transform:rotate(' + loading.rotation + 'deg)">' +
                    '<div class="loader-line"></div>' +
                '</div>' +
                '<div class="loader-logo"></div>' +
                '<div class="loader-text">Loading</div>' + 
            '</div>');
    },
    
    animation: () => {
        if (document.querySelector('.loading') == null) {
            clearInterval(loading.interval);
            loading.interval = null;
        } else {
            loading.rotation += 3;
            if (loading.rotation >= 360) loading.rotation = 0;
            let mask = document.querySelector('.loader-line-mask');
            if (mask) mask.style.cssText = 'transform:rotate(' + loading.rotation + 'deg)';
            session.set('loadingRotation', loading.rotation);
        }
    },
    
    start: (unload = 0, el) => {
        if (loading.interval != null) return;
        else {
            if (el == null) el = document.querySelector('body');
            loading.build(el);
            if (unload) {
                let opacity = 0;
                let fade = setInterval(() => {
                    el.style.opacity = '.' + opacity++;
                    if (opacity == 10) {
                        clearInterval(fade);
                        el.style.opacity = null;
                    }
                }, 50);
            }
            loading.interval = setInterval(loading.animation, 10);
        }
    },
    
    clear: () => {
        document.querySelector('.loading')?.classList.remove('loading');
        document.querySelector('.loader')?.remove();
        clearInterval(loading.interval);
        loading.interval = null;
    },
    
    stop: () => {
        let el = document.querySelector('.loader');
        let opacity = 9;
        let fade = setInterval(() => {
            el.style.opacity = '.' + opacity--;
            if (opacity == 0) {
                clearInterval(fade);
                loading.clear();
            }
        }, 50);
    },

    init: () => {
        window.addEventListener('DOMContentLoaded', () => {
            message.verbose('DOM Loaded, Starting Animation');
            loading.start();
        });
        window.addEventListener('beforeunload', () => {
            message.verbose('Navigating Away, Starting Animation');
            loading.start(1);
        });
        window.addEventListener('error', () => {
            message.verbose('DOM Error, Clearing Animation');
            loading.clear();
        });
        window.addEventListener('abort', () => {
            message.verbose('Load Aborted, Clearing Animation');
            loading.clear();
        });
        window.addEventListener('unload', () => {
            message.verbose('Page Unloaded, Clearing Animation');
            loading.clear();
        });
        window.addEventListener('load', () => {
            message.verbose('Resources Loaded, Stopping Animation');
            loading.stop();
        });
        window.addEventListener('pageshow', (e) => {
            if (e.originalEvent && e.originalEvent.persisted) {
                message.verbose('Back button detected, Stopping Animation');
                loading.stop();
            }
        });
    }
};