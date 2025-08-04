import { Banner } from '../../models';
import HomeCommonType from '../../types/Home/HomeCommonType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getHomeData = {

  type: HomeCommonType,

  async resolve({ request, response }) {
    try {
      let result = await Banner.findOne();
      return {
        result
      };
    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getHomeData;

