import {
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import ResponseType from '../../../types/ResponseType';

const createLanguage = {
  type: ResponseType,
  args: {
    title: { type: new NonNull(StringType) },
    code: { type: new NonNull(StringType) },
    fileURL: { type: StringType },
  },
  async resolve({ request }, { models }) {
    try {
      await models.Language.create({
        title: request.title,
        code: request.code,
        fileURL: request.fileURL,
      });
      return {
        status: 200,
      };
    } catch (error) {
      return {
        status: 400,
        errorMessage: error.message,
      };
    }
  },
};

export default createLanguage; 