import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { ListBlockedDates } from '../../models';
import ListCalendarPriceType from '../../types/ListCalendarPriceType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getSpecialPricing = {

    type: new List(ListCalendarPriceType),

    args: {
        listId: { type: new NonNull(IntType) },
        startDate: { type: new NonNull(StringType) },
        endDate: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, { listId, startDate, endDate }) {
        try {
            let convertStart = new Date(startDate), convertEnd = new Date(endDate);
            convertStart.setHours(0, 0, 0, 0);
            convertEnd.setHours(23, 59, 59, 999);

            const listingSpecialPricingData = await ListBlockedDates.findAll({
                where: {
                    listId,
                    blockedDates: {
                        $between: [convertStart, convertEnd]
                    },
                    calendarStatus: 'available'
                },
                order: [['blockedDates', 'ASC']],
                raw: true
            });

            return listingSpecialPricingData && listingSpecialPricingData?.length > 0 ? listingSpecialPricingData : [];

        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getSpecialPricing;