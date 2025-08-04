import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import { StaticPage } from '../../models';
import StaticPageType from '../../types/siteadmin/StaticPageType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const updateStaticPage = {
    type: StaticPageType,
    args: {
        id: { type: IntType },
        content: { type: StringType },
        metaTitle: { type: StringType },
        metaDescription: { type: StringType },
    },
    async resolve({ request }, {
        id,
        content,
        metaTitle,
        metaDescription,
    }) {

        try {
            if (request.user && request.user.admin == true) {
                const update = await StaticPage.update({
                    content,
                    metaTitle,
                    metaDescription

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
                    status: 'Not Logged In'
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

export default updateStaticPage;
