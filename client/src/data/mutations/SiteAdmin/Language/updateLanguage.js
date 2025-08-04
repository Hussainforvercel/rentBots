import {
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLString as StringType,
} from 'graphql';
import ResponseType from '../../../types/ResponseType';

const updateLanguage = {
  type: ResponseType,
  args: {
    id: { type: new NonNull(IntType) },
    title: { type: new NonNull(StringType) },
    code: { type: new NonNull(StringType) },
    fileURL: { type: StringType },
  },
  async resolve({ request }, { models }) {
    try {
      await models.Language.update(
        {
          title: request.title,
          code: request.code,
          fileURL: request.fileURL,
        },
        {
          where: { id: request.id },
        }
      );
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

export default updateLanguage; 