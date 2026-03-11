import { msg } from './msg';
import { session } from './session';

export const loading = {

    planetarium: {

        // Corona Shadow Offset: top: -80, left: -65 (Difference of -15)
        // Corona Logo Offset: top: -20, left: -52 (Difference of +32)
        // Range 100px

        shadowOffset: session.getIntVar('loadingShadowOffset', -67), // Initial Position One Step After Corona
        logoOffset: session.getIntVar('loadingLogoOffset', -50), // Initial Position One Step After Corona
        wait: session.getIntVar('loadingWait', 20), // Number of Frames to Wait at Corona
        delay: session.getIntVar('loadingDelay', 20), // Interval Delay

        build: el => {
            if (loading.interval != null) loading.clear();
            el.classList.add('loading')
            el.insertAdjacentHTML("afterbegin",
                '<div class="loader planetarium">' +
                    '<div class="loader-circle"></div>' + 
                '<div class="loader-shadow" style="margin-top:' + (loading.planetarium.shadowOffset - 15) + 'px;margin-left:' + loading.planetarium.shadowOffset + 'px;">' + 
                    '<div class="loader-logo" style="margin-top:' + (loading.planetarium.logoOffset + 32) + 'px;margin-left:' + loading.planetarium.logoOffset + 'px;"></div>' + 
                '</div>' + 
                '<div class="loader-text">Loading</div>' + 
            '</div>');
        },

        animation: () => {
            if (document.querySelector('.loading') == null) {
                clearInterval(loading.interval);
                loading.interval = null;
            } else {
                // Slow Down for Corona Approach
                if (loading.planetarium.shadowOffset == -45) {
                    clearInterval(loading.interval);
                    loading.planetarium.delay = 20;
                    loading.interval = setInterval(loading.planetarium.animation, loading.planetarium.delay);
                }
                // Speed Up for Corona Departure
                if (loading.planetarium.shadowOffset == -105) {
                    clearInterval(loading.interval);
                    loading.planetarium.delay = 10;
                    loading.interval = setInterval(loading.planetarium.animation, loading.planetarium.delay);
                }
                // Stop at Corona for Delay
                if (loading.planetarium.shadowOffset == -60 && loading.planetarium.wait > 0)
                    loading.planetarium.wait--;
                // Standard Movement Per Frame
                else {
                    loading.planetarium.shadowOffset -= 2;
                    loading.planetarium.logoOffset += 2;
                    loading.planetarium.wait = 20;
                }
                // Reset Animation
                if (loading.planetarium.shadowOffset < -165) {
                    loading.planetarium.shadowOffset = 35;
                    loading.planetarium.logoOffset = -152;
                }
                // Apply Movement
                let shadow = document.querySelector('.loader-shadow');
                if (shadow)
                    shadow.style.cssText = 'margin-top:' + (loading.planetarium.shadowOffset - 15) + 'px;margin-left:' + loading.planetarium.shadowOffset + 'px;';
                let logo = document.querySelector('.loader-logo');
                if (logo)
                    logo.style.cssText = 'margin-top:' + (loading.planetarium.logoOffset + 32) + 'px;margin-left:' + loading.planetarium.logoOffset + 'px;';
                // Save State
                session.set('loadingShadowOffset', loading.planetarium.shadowOffset);
                session.set('loadingLogoOffset', loading.planetarium.logoOffset);
                session.set('loadingWait', loading.planetarium.wait);
                session.set('loadingDelay', loading.planetarium.delay);
            }
        }
    },

    default: {
            rotation: session.getIntVar('loadingRotation', 3),

        build: el => {
            if (loading.interval != null) loading.clear();
            el.classList.add('loading')
            el.insertAdjacentHTML("afterbegin",
                '<div class="loader">' +
                    '<div class="loader-circle"></div>' +
                    '<div class="loader-line-mask" style="transform:rotate(' + loading.default.rotation + 'deg)">' +
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
                loading.default.rotation += 3;
                if (loading.default.rotation >= 360) loading.default.rotation = 0;
                let mask = document.querySelector('.loader-line-mask');
                if (mask) mask.style.cssText = 'transform:rotate(' + loading.default.rotation + 'deg)';
                session.set('loadingRotation', loading.default.rotation);
            }
        }
    },

    animationStyle: 'default',
    
    start: (unload = 0, el) => {
        if (loading.interval != null) return;
        else {
            if (el == null) el = document.querySelector('body');
            loading[loading.animationStyle].build(el);
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
            loading.interval = setInterval(loading[loading.animationStyle].animation, 10);
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

    init: (animationStyle = null) => {
        if (animationStyle != null) loading.animationStyle = animationStyle;
        window.addEventListener('DOMContentLoaded', () => {
            msg.verbose('DOM Loaded, Starting Animation');
            loading.start();
        });
        window.addEventListener('beforeunload', () => {
            msg.verbose('Navigating Away, Starting Animation');
            loading.start(1);
        });
        window.addEventListener('error', () => {
            msg.verbose('DOM Error, Clearing Animation');
            loading.clear();
        });
        window.addEventListener('abort', () => {
            msg.verbose('Load Aborted, Clearing Animation');
            loading.clear();
        });
        window.addEventListener('unload', () => {
            msg.verbose('Page Unloaded, Clearing Animation');
            loading.clear();
        });
        window.addEventListener('load', () => {
            msg.verbose('Resources Loaded, Stopping Animation');
            loading.stop();
        });
        window.addEventListener('pageshow', (e) => {
            if (e.originalEvent && e.originalEvent.persisted) {
                msg.verbose('Back button detected, Stopping Animation');
                loading.stop();
            }
        });
    }
};