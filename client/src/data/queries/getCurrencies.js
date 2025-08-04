import {
  GraphQLList as List
} from 'graphql';
import { Currencies } from '../../data/models';
import CurrenciesType from '../types/CurrenciesType';

const getCurrencies = {

  type: new List(CurrenciesType),

  async resolve({ request }) {

    return await Currencies.findAll({
      order: [
        ['isBaseCurrency', 'DESC'],
      ]
    });

  },
};

export default getCurrencies;
