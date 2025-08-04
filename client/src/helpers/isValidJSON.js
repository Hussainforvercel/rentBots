
export function isValidJSON(value) {

    let isJSON = false;

    if (/^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        isJSON = true
    }
    return isJSON;
};
