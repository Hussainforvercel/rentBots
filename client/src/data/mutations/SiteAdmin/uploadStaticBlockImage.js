import {
    GraphQLString as StringType
} from 'graphql';
import { StaticInfoBlock } from '../../models';
import StaticBlockType from '../../types/StaticBlockType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const uploadStaticBlockImage = {
    type: StaticBlockType,
    args: {
        fileName: { type: StringType },
        name: { type: StringType }
    },
    async resolve({ request }, { fileName, name }) {

        try {
            if (request?.user?.admin == true) {
                const UpdateStaticInfoBlock = await StaticInfoBlock.update({
                    value: fileName
                }, {
                    where: {
                        name: name
                    }
                });

                return {
                    status: UpdateStaticInfoBlock ? 'success' : 'failed'
                }
            } else {
                return {
                    status: 'not logged in'
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default uploadStaticBlockImage;
