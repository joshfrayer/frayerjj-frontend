export const msg = {

    verbose: (msg) => {
        if (window.verbose) console.log(msg);
        else console.debug(msg);
    },

    warn: (msg) => {
        if (window.verbose) console.warn(msg);
        else console.debug(msg);
    }

};