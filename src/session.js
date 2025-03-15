import { message } from "./message";

export const session = {
    // Get a session variable as an integer
    getIntVar: (varName, defaultVal) => {
        message.verbose('Getting Integer Session Variable: ' + varName);
        var val = parseInt(sessionStorage.getItem(varName));
        return isNaN(val) ? defaultVal : val;
    },
    // Get a session variable as a boolean
    getBoolVar: (varName, defaultVal) => {
        message.verbose('Getting Boolean Session Variable: ' + varName);
        var val = sessionStorage.getItem(varName);
        return val == 'true' ? true : val == 'false' ? false : defaultVal;
    },
    // Get a session variable as a string
    getStrVar: (varName, defaultVal) => {
        message.verbose('Getting String Session Variable: ' + varName);
        var val = sessionStorage.getItem(varName);
        return val ?? defaultVal;
    },
    // Set a session variable
    set: (varName, val) => {
        message.verbose('Setting Session Variable: ' + varName + ' = ' + val);
        sessionStorage.setItem(varName, val);
    },
    // Remove a session variable
    removeVar: (varName) => {
        message.verbose('Removing Session Variable: ' + varName);
        sessionStorage.removeItem(varName);
    },
    // Clear all session variables
    clear: () => {
        message.verbose('Clearing Session Variables');
        sessionStorage.clear();
    }
};