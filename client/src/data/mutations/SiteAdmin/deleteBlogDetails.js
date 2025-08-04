import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';

import { BlogDetails } from '../../models';
import BlogDetailsType from '../../types/BlogDetailsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const deleteBlogDetails = {
    type: BlogDetailsType,
    args: {
        id: { type: new NonNull(IntType) }
    },
    async resolve({ request, response }, {
        id
    }) {
        try {
            if (request?.user?.admin) {
                const blogDetails = await BlogDetails.findById(id);
                if (!blogDetails) {
                    return {
                        status: '404'
                    }
                }

                const deleteBlog = await BlogDetails.destroy({
                    where: {
                        id: id
                    }
                });

                return {
                    status: deleteBlog ? '200' : '400'
                }
            } else {
                return {
                    status: 'notLoggedIn'
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
}

export default deleteBlogDetails;