import { GraphQLInt as IntType } from 'graphql';
import StaticPage from '../../models/StaticPage.js'
import StaticPageCommonType from '../../types/StaticPage/StaticPageCommonType.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getStaticPageContent = {
    type: StaticPageCommonType,
    args: {
        id: { type: IntType }
    },
    async resolve({ request }, { id }) {

        try {
            const result = await StaticPage.findOne({
                where: {
                    id: id || 2 // Default Privacy Policy
                }
            });

            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : await showErrorMessage({ errorCode: 'unableToFindPage' }),
                result
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    }
};

export default getStaticPageContent;