import {
    GraphQLBoolean as BooleanType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage'

const updatePayoutStatus = {
    type: ReservationType,
    args: {
        id: { type: new NonNull(IntType) },
        isHold: { type: new NonNull(BooleanType) }
    },
    async resolve({ request }, { id, isHold }) {
        try {
            let isUpdated = false;
            if (!request?.user || !request?.user?.admin) {
                return {
                    status: '500',
                    errorMessage: await showErrorMessage({ errorCode: 'notLoggedIn' })
                }
            }

            await Reservation.update({
                isHold: isHold
            }, {
                where: {
                    id
                }
            }).then(function (instance) {
                if (instance > 0) {
                    isUpdated = true
                }
            });

            return {
                status: isUpdated ? '200' : '400',
                errorMessage: isUpdated ? null : await showErrorMessage({ errorCode: 'notUpdated' })
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }

    }
}

export default updatePayoutStatus;