import {
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';
import { BlogDetails } from '../../models';
import BlogDetailsType from '../../types/BlogDetailsType';

const updateBlogStatus = {
    type: BlogDetailsType,
    args: {
        id: { type: IntType },
        isEnable: { type: BooleanType },
    },
    async resolve({ request }, {
        id,
        isEnable,
    }) {
        try {
            if (request.user && request.user.admin == true) {
                const Update = await BlogDetails.update({
                    isEnable: !isEnable,
                }, {
                    where: {
                        id: id
                    }
                });
                return {
                    status: 'success'
                }
            } else {
                return {
                    status: 'failed'
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};
export default updateBlogStatus;
