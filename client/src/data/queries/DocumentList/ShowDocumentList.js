import {
  GraphQLList as List,
  GraphQLString as StringType
} from 'graphql';
import { DocumentVerification } from '../../../data/models';
import showErrorMessage from '../../../helpers/showErrorMessage';
import DocumentVerificationType from '../../types/DocumentVerification';

const ShowDocumentList = {

  type: new List(DocumentVerificationType),

  args: {
    userId: { type: StringType },
  },

  async resolve({ request, response }, { userId }) {
    try {
      let userId = request?.user?.id;

      if (!request?.user) {
        return {
          status: '400',
          errorMessage: await showErrorMessage({ errorCode: 'loginError', error })
        };
      }

      return await DocumentVerification.findAll({
        where: {
          userId
        }
      });

    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  },
};

export default ShowDocumentList;