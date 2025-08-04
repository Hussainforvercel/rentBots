import {
  GraphQLString as StringType,
} from 'graphql';
import fetch from 'node-fetch';
import ListPhotosType from '../../types/ListPhotosType.js';
import { websiteUrl } from '../../../config.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const RemoveMultiPhotos = {
  type: ListPhotosType,
  args: {
    photos: { type: StringType },
  },
  async resolve({ request, response }, { photos }) {

    try {
      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }
      const responses = await new Promise((resolve, reject) => {
        fetch(websiteUrl + '/deleteMultiFiles', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            auth: request.headers.auth
          },
          body: JSON.stringify({ files: photos }),
          method: 'post',
        }).then(res => res.json())
          .then(function (body) {
            if (body) {
              resolve(body)
            } else {
              reject(error)
            }
          });
      });
      const { status, errorMessage } = responses;

      return {
        status: status === 200 ? 200 : 400,
        errorMessage: status === 200 ? null : errorMessage
      }
    } catch (error) {
      return {
        errorMessage:await  showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      }
    }
  },
};

export default RemoveMultiPhotos;