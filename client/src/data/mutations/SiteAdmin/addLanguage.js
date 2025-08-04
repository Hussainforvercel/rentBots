import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Language from '../../../data/models/siteadmin/Language';
import LanguageType from '../../types/siteadmin/LanguageType';

const addLanguage = {
  type: LanguageType,
  args: {
    title: { type: new NonNull(StringType) },
    code: { type: new NonNull(StringType) },
    fileURL: { type: StringType },
  },
  async resolve({ request }, { title, code, fileURL }) {
    try {
      const language = await Language.create({
        title,
        code,
        fileURL,
      });
      return language;
    } catch (error) {
      console.error('Error in addLanguage mutation:', error);
      throw new Error('Failed to add language');
    }
  },
};

export default addLanguage; 