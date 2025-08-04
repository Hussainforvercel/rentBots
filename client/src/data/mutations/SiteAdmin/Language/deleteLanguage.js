import {
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import ResponseType from '../../../types/ResponseType';

const deleteLanguage = {
  type: ResponseType,
  args: {
    id: { type: new NonNull(IntType) },
  },
  async resolve({ request }, { models }) {
    try {
      await models.Language.destroy({
        where: { id: request.id },
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

export default deleteLanguage; 