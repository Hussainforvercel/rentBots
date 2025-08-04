// import { CurrencyRates, Currencies } from '../data/models';
import CurrencyRates from '../data/models/CurrencyRates.js';
import  Currencies  from '../data/models/Currencies.js'

const getCurrencyRates = async () => {
    let rates = {};
    const currencyRatesData = await CurrencyRates.findAll({
        attributes: ['currencyCode', 'rate', 'isBase'],
        raw: true
    });
    const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
    currencyRatesData.map((item) => { rates[item.currencyCode] = item.rate });

    return {
        base,
        rates
    };
}

export default getCurrencyRates;