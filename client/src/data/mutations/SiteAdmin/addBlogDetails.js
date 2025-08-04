import {
    GraphQLString as StringType
} from 'graphql';
import { BlogDetails } from '../../../data/models';
import BlogDetailsType from '../../types/BlogDetailsType';

const addBlogDetails = {
    type: BlogDetailsType,
    args: {
        metaTitle: { type: StringType },
        metaDescription: { type: StringType },
        pageUrl: { type: StringType },
        pageTitle: { type: StringType },
        content: { type: StringType },
        footerCategory: { type: StringType },
    },
    async resolve({ request }, {
        metaTitle,
        metaDescription,
        pageUrl,
        pageTitle,
        content,
        footerCategory,
    }) {
        try {
            let pageURLCheck = pageUrl.trim();

            if (request.user && request.user.admin == true) {
                const checkUrl = await BlogDetails.findOne({
                    where: {
                        pageUrl: pageURLCheck
                    }
                })
                if (checkUrl) {
                    return {
                        status: 'URL exist'
                    }
                } else {
                    const createBlog = await BlogDetails.create({
                        metaTitle,
                        metaDescription,
                        pageUrl,
                        pageTitle,
                        footerCategory,
                        content: content
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
export default addBlogDetails;
