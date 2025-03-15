import { message } from './message';

export const ajax = (args) => {
    return new Promise((resolve, reject) => {

        encodeVars = vars => {
            let s = '';
            for (var v in vars) s += v + '=' + vars[v] + "&";
            return s ? s.substring(0, s.length - 1) : s;
        }
        
        if (args.method == 'GET' && args.vars) args.uri += '?' + encodeVars(args.vars);
        message.verbose('Making Request: ' + args.method + ' ' + args.uri);
        
        let xhr = new XMLHttpRequest();
        xhr.open(args.method, args.uri, true);
        
        if (args.method == 'POST' && args.vars) xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        // Timeout support
        if (args.timeout) {
            xhr.timeout = args.timeout;
            xhr.ontimeout = () => reject(new Error('Request timed out'));
        }
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    message.verbose('AJAX Request Successful');
                    const response = args.json !== false ? JSON.parse(xhr.responseText) : xhr.responseText;
                    if (typeof args.success == 'function') args.success.call(xhr, response);
                    resolve(response);
                } else {
                    message.warn('AJAX Request Failed (HTTP ' + xhr.status + ': ' + xhr.statusText + ')');
                    if (typeof args.failure == 'function') args.failure.call(xhr);
                    reject(new Error('AJAX Request Failed: ' + xhr.statusText));
                }
            }
        };
        
        xhr.send(args.method == 'POST' && args.vars ? encodeVars(args.vars) : null);
    });
};