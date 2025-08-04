import {
    GraphQLString as StringType,
} from 'graphql';
import { BlogDetails } from '../../models';
import BlogDetailsType from '../../types/BlogDetailsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getBlogHome = {

    type: BlogDetailsType,

    args: {
        pageUrl: { type: StringType },
    },

    async resolve({ request }, { pageUrl }) {
        try {
            const blogData = await BlogDetails.find({
                where: {
                    pageUrl,
                    isEnable: true
                }
            });

            return blogData;
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default getBlogHome;
