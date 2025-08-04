import {
    GraphQLString as StringType
} from 'graphql';
import { StaticInfoBlock } from '../../models';
import StaticBlockType from '../../types/StaticBlockType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const removeStaticBlockImages = {
    type: StaticBlockType,
    args: {
        name: { type: StringType },
    },
    async resolve({ request }, { name }) {

        try {
            if (request?.user?.admin == true) {

                let removeStaticImages = await StaticInfoBlock.update({
                    value: null
                },
                    {
                        where: { name: name }
                    });

                return {
                    status: removeStaticImages ? 'success' : 'failed'
                }
            } else {
                return {
                    status: 'not logged in'
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

export default removeStaticBlockImages;
