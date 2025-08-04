import {
  GraphQLString as StringType,
} from 'graphql';
import { DocumentVerification } from '../../../data/models';
import DocumentVerificationType from '../../types/DocumentVerification';
import showErrorMessage from '../../../helpers/showErrorMessage';

const uploadDocument = {
  type: DocumentVerificationType,
  args: {
    fileName: { type: StringType },
    fileType: { type: StringType },
  },
  async resolve({ request, response }, { fileName, fileType }) {

    try {
      if (request?.user && !request?.user?.admin) {
        const uploadDocuments = await DocumentVerification.create({
          fileName,
          fileType,
          userId: request?.user?.id
        });

        return {
          status: uploadDocuments ? 'success' : 'failed'
        }
      } else {
        return {
          status: "notLoggedIn",
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

export default uploadDocument;

/*


mutation uploadDocument(
 $fileName: String,$fileType: String,
){
    uploadDocument(
      fileName: $fileName,
      fileType: $fileType
    ) {
        fileName
        fileType
       
    }
}


 
*/

/**
mutation CreateThreadItems(
  $listId: Int!, 
  $host: String!,
  $content: String!,
  $type: String,
  $startDate: String,
  $endDate: String,
  $personCapacity: Int
){
    CreateThreadItems(
      listId: $listId,
      host: $host,
      content: $content,
      type: $type,
      startDate: $startDate,
      endDate: $endDate,
      personCapacity: $personCapacity
    ) {
        id
        sentBy
        content
        type
        startDate
        endDate
        personCapacity
        createdAt
    }
}
**/
