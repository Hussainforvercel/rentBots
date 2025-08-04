
export const tokenSplitup = async (deviceIds) => {

    let tokens = [], splitupLength = 0, tokenLimits = 500;

    if (deviceIds.length > 0) {
        splitupLength = Math.ceil(deviceIds.length / tokenLimits);
        Array.from({ length: splitupLength }, (_, index) => {
            let splitForm = index * tokenLimits, splitTo = (index + 1) * tokenLimits;
            splitForm = splitForm > 0 ? splitForm + 1 : 0;
            if (((splitupLength - 1) == index) || splitupLength == 1) {
                tokens.push(deviceIds.slice(splitForm, deviceIds.length))
            } else {
                tokens.push(deviceIds.slice(splitForm, splitTo));
            }
        });
    }
    return tokens;
}