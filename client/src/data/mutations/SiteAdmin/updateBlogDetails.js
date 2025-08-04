import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import { BlogDetails } from '../../models';
import BlogDetailsType from '../../types/BlogDetailsType';

const updateBlogDetails = {
    type: BlogDetailsType,
    args: {
        id: { type: IntType },
        metaTitle: { type: StringType },
        metaDescription: { type: StringType },
        pageUrl: { type: StringType },
        pageTitle: { type: StringType },
        content: { type: StringType },
        footerCategory: { type: StringType },
    },
    async resolve({ request }, {
        id,
        metaTitle,
        metaDescription,
        pageUrl,
        pageTitle,
        content,
        footerCategory,
    }) {

        try {
            if (request.user && request.user.admin == true) {
                const checkUrl = await BlogDetails.findOne({
                    where: {
                        pageUrl,
                        id: {
                            $ne: id
                        },

                    }
                });

                if (checkUrl) {
                    return {
                        status: 'URL exist'
                    }
                }
                else {
                    const Update = await BlogDetails.update({
                        metaTitle,
                        metaDescription,
                        pageUrl,
                        pageTitle,
                        footerCategory,
                        content: content
                    }, {
                        where: {
                            id: id
                        }
                    });
                    return {
                        status: 'success'
                    }
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

export default updateBlogDetails;
