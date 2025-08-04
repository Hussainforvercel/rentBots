import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getPaymentState = {
    type: ReservationType,
    args: {
        reservationId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { reservationId }) {
        try {
            const data = await Reservation.findOne({
                attributes: ['paymentState'],
                where: {
                    id: reservationId
                }
            });
            return data;
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getPaymentState;