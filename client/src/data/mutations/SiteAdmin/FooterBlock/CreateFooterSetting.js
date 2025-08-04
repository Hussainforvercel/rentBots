import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import { FooterBlock } from '../../../../data/models';
import FooterBlockType from '../../../types/FooterBlockType';

const CreateFooterSetting = {
    type: FooterBlockType,
    args: {
        id: { type: IntType },
        title1: { type: StringType },
        content1: { type: StringType },
        title2: { type: StringType },
        content2: { type: StringType },
        title3: { type: StringType },
        content3: { type: StringType },
    },
    async resolve({ request }, {
        id,
        title1,
        content1,
        title2,
        content2,
        title3,
        content3
    }) {

        try {
            if (request.user && request.user.admin == true) {

                const isFooterIdAvailable = await FooterBlock.findOne({ where: { id: 1 } });

                if (isFooterIdAvailable != null) {
                    await FooterBlock.update({
                        title1: title1,
                        content1: content1,
                        title2: title2,
                        content2: content2,
                        title3: title3,
                        content3: content3
                    },
                        {
                            where: {
                                id: 1
                            }
                        }
                    );
                }
                else {
                    await FooterBlock.create({
                        title1: title1,
                        content1: content1,
                        title2: title2,
                        content2: content2,
                        title3: title3,
                        content3: content3
                    })
                }

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
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default CreateFooterSetting;
