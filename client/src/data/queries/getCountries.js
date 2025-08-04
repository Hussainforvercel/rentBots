import {
    GraphQLList as List,
} from 'graphql';
import { Country } from '../../data/models';
import CountryType from '../types/CountryType';

const getCountries = {

    type: new List(CountryType),

    async resolve({ request }) {
        return await Country.findAll();
    }
};

export default getCountries;
