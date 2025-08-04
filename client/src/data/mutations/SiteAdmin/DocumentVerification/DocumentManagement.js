
import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import { UserVerifiedInfo, DocumentVerification } from '../../../models';
import UserVerifiedInfoType from '../../../types/UserVerifiedInfoType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const DocumentManagement = {
  type: UserVerifiedInfoType,
  args: {
    userId: { type: StringType },
    isIdVerification: { type: IntType },
  },
  async resolve({ request }, { userId, isIdVerification }) {

    try {
      if (request?.user?.admin == true) {
        let isDocumentUpdate = false;

        const isDocumentAvailable = await DocumentVerification.findOne({
          where: {
            userId
          }
        });

        if (!isDocumentAvailable) return {
          status: 'failed',
          errorMessage: await showErrorMessage({ errorCode: 'noDocumentsFound' })
        }

        await UserVerifiedInfo.update(
          {
            isIdVerification
          },
          {
            where: {
              userId
            }
          }
        )
          .then(function (instance) {
            // Check if any rows are affected
            if (instance > 0) {
              isDocumentUpdate = true;
            }
          });

        if (isDocumentUpdate) {
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
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default DocumentManagement;

/*

 mutation DocumentManagement ($id: String, $isIdVerification: Boolean){
                    DocumentManagement(id: $id, isIdVerification: $isIdVerification){
                        status
    }
}
*/