import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { BlogDetails } from '../../models';
import BlogDetailsType from '../../types/BlogDetailsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const editBlogDetails = {

    type: BlogDetailsType,

    args: {
        id: { type: new NonNull(IntType) },
    },

    async resolve({ request }, { id }) {
        try {
            const blogData = await BlogDetails.find({
                where: {
                    id: id
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

export default editBlogDetails;