import {
    GraphQLString as StringType
} from 'graphql';
import { StaticInfoBlock } from '../../../data/models'
import StaticBlockType from '../../types/StaticBlockType';

const updateStaticInfoBlock = {

    type: StaticBlockType,

    args: {
        carTripTitle1: { type: StringType },
        carTripTitle2: { type: StringType },
        carTripContent2: { type: StringType },
        carTripTitle3: { type: StringType },
        carTripContent3: { type: StringType }
    },

    async resolve({ request }, {
        carTripTitle1,
        carTripTitle2,
        carTripContent2,
        carTripTitle3,
        carTripContent3
    }) {

        if (request.user && request.user.admin == true) {
            let isStaticBlockSettingsUpdated = false;

            const updatecarTripTitle1 = await StaticInfoBlock.update({ value: carTripTitle1 }, { where: { name: 'carTripTitle1' } })
                .then(function (instance) {
                    if (instance > 0) {
                        isStaticBlockSettingsUpdated = true;
                    } else {
                        isStaticBlockSettingsUpdated = false;
                    }
                });

            const updatecarTripTitle2 = await StaticInfoBlock.update({ value: carTripTitle2 }, { where: { name: 'carTripTitle2' } })
                .then(function (instance) {
                    if (instance > 0) {
                        isStaticBlockSettingsUpdated = true;
                    } else {
                        isStaticBlockSettingsUpdated = false;
                    }
                });

            const updatecarTripContent2 = await StaticInfoBlock.update({ value: carTripContent2 }, { where: { name: 'carTripContent2' } })
                .then(function (instance) {
                    if (instance > 0) {
                        isStaticBlockSettingsUpdated = true;
                    } else {
                        isStaticBlockSettingsUpdated = false;
                    }
                });

            const updatecarTripTitle3 = await StaticInfoBlock.update({ value: carTripTitle3 }, { where: { name: 'carTripTitle3' } })
                .then(function (instance) {
                    if (instance > 0) {
                        isStaticBlockSettingsUpdated = true;
                    } else {
                        isStaticBlockSettingsUpdated = false;
                    }
                });

            const updatecarTripContent3 = await StaticInfoBlock.update({ value: carTripContent3 }, { where: { name: 'carTripContent3' } })
                .then(function (instance) {
                    if (instance > 0) {
                        isStaticBlockSettingsUpdated = true;
                    } else {
                        isStaticBlockSettingsUpdated = false;
                    }
                });


            

            if (isStaticBlockSettingsUpdated) {
                return {
                    status: 'success'
                }
            } else {
                return {
                    status: 'failed'
                }
            }


        } else {
            return {
                status: 'failed'
            }
        }

    },
};

export default updateStaticInfoBlock;
