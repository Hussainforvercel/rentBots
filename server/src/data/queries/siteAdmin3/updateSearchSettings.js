import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
} from 'graphql';
import { SearchSettings } from '../../../data/models';
import SearchSettingsType from '../../types/SearchSettingsType';

const updateSearchSettings = {

  type: SearchSettingsType,

  args: {
    id: { type: IntType },
    minPrice: { type: FloatType },
    maxPrice: { type: FloatType },
    priceRangeCurrency: { type: StringType },
  },

  async resolve({ request },
    {
      id,
      minPrice,
      maxPrice,
      priceRangeCurrency
    }) {

    if (request.user && request.user.admin == true) {

      let isSearchSettingsUpdated = false;

      await SearchSettings.update(
        {
          minPrice: minPrice,
          maxPrice: maxPrice,
          priceRangeCurrency: priceRangeCurrency
        },
        {
          where: {
            id: id
          }
        }
      )
        .then(function (instance) {
          // Check if any rows are affected
          if (instance > 0) {
            isSearchSettingsUpdated = true;
          }
        });
      if (isSearchSettingsUpdated) {
        return {
          status: 'success'
        }
      } else {
        return {
          status: 'failed'
        }
      }

    } else {
      return {
        status: "failed"
      }
    }
  },
};

export default updateSearchSettings;