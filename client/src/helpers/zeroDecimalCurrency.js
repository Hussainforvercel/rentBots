const zeroDecimalCurrencies = [
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX',
    'VND', 'VUV', 'XAF', 'XOF', 'XPF'
];

const unSupportedDecimalCurrencies = ['JPY', 'HUF', 'TWD'];

function isZeroDecimalCurrency(currency) {
    return currency && zeroDecimalCurrencies.indexOf(currency) >= 0;
}

function isUnSupportedDecimalCurrency(currency) {
    return currency && unSupportedDecimalCurrencies.indexOf(currency) >= 0;
};

export {
    isZeroDecimalCurrency, isUnSupportedDecimalCurrency
};