import {
  GraphQLInt as IntType,
} from 'graphql';
import { DocumentVerification } from '../../../data/models';
import DocumentVerificationType from '../../types/DocumentVerification';
import showErrorMessage from '../../../helpers/showErrorMessage';

const RemoveDocumentList = {
  type: DocumentVerificationType,
  args: {
    id: { type: IntType },
  },
  async resolve({ request, response }, { id }) {

    try {
      // Check whether user is logged in
      if (request?.user && !request?.user?.admin) {

        let userId = request?.user?.id;
        let where = {
          id,
          userId
        };

        await DocumentVerification.destroy({ where });
        const photosCount = await DocumentVerification.count({ where: { userId } });

        return {
          status: "success",
          photosCount
        };

      }
      else {
        return {
          status: "Not loggedIn"
        };
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default RemoveDocumentList;
/* 
mutation ($id:Int) {
  RemoveDocumentList (id: $id) {
    status
    photosCount
  }
}
*/