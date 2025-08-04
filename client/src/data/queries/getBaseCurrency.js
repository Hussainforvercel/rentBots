import { Currencies } from '../../data/models';
import CurrenciesType from '../types/CurrenciesType';

const getBaseCurrency = {

  type: CurrenciesType,

  async resolve({ request }) {

    return await Currencies.find({
      where: {
        isBaseCurrency: true
      }
    });

  },
};

export default getBaseCurrency;
