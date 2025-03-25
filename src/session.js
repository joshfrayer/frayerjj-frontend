import { msg } from "./msg";

export const session = {
    // Get a session variable as an integer
    getIntVar: (varName, defaultVal) => {
        msg.verbose('Getting Integer Session Variable: ' + varName);
        var val = parseInt(sessionStorage.getItem(varName));
        return isNaN(val) ? defaultVal : val;
    },
    // Get a session variable as a boolean
    getBoolVar: (varName, defaultVal) => {
        msg.verbose('Getting Boolean Session Variable: ' + varName);
        var val = sessionStorage.getItem(varName);
        return val == 'true' ? true : val == 'false' ? false : defaultVal;
    },
    // Get a session variable as a string
    getStrVar: (varName, defaultVal) => {
        msg.verbose('Getting String Session Variable: ' + varName);
        var val = sessionStorage.getItem(varName);
        return val ?? defaultVal;
    },
    // Set a session variable
    set: (varName, val) => {
        //msg.verbose('Setting Session Variable: ' + varName + ' = ' + val);
        sessionStorage.setItem(varName, val);
    },
    // Remove a session variable
    removeVar: (varName) => {
        msg.verbose('Removing Session Variable: ' + varName);
        sessionStorage.removeItem(varName);
    },
    // Clear all session variables
    clear: () => {
        msg.verbose('Clearing Session Variables');
        sessionStorage.clear();
    }
};