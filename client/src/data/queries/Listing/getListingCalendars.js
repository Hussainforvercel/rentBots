import {
    GraphQLList as List,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { ListCalendar, Listing } from '../../models';
import ListCalendarType from '../../types/ListCalendarType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getListingCalendars = {

    type: new List(ListCalendarType),

    args: {
        listId: { type: new NonNull(IntType) },
    },

    async resolve({ request }, { listId }) {

        try {
            let where;
            if (request?.user || request?.user?.admin) {
                where = {
                    id: listId
                };

                if (!request?.user?.admin) {
                    where = {
                        id: listId,
                        userId: request?.user?.id
                    };
                }

                const isListingAvailable = await Listing.find({
                    where
                });

                if (isListingAvailable) {
                    return await ListCalendar.findAll({
                        where: {
                            listId
                        }
                    });
                } else {
                    return {
                        status: '404'
                    }
                }

            } else {
                return {
                    status: "notLoggedIn",
                };
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getListingCalendars;