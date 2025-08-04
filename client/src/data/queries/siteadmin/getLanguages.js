import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLString as StringType,
} from 'graphql';
import LanguageType from '../../types/LanguageType';

const getLanguages = {
  type: new List(LanguageType),
  async resolve({ request }, { models }) {
    try {
      const languages = await models.Language.findAll();
      return languages;
    } catch (error) {
      return [];
    }
  }
};

export default getLanguages; 