import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import moment from 'moment';
import { ListBlockedDates, SiteSettings } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const checkReservation = {

    type: ReservationType,

    args: {
        checkIn: { type: StringType },
        checkOut: { type: StringType },
        listId: { type: IntType },
        securityDepositStatus: { type: StringType }
    },

    async resolve({ request }, { checkIn, checkOut, listId, securityDepositStatus }) {
        try {
            let siteSettingData;

            if (!request.user) {
                return {
                    status: "notLoggedIn",
                };
            }

            if (securityDepositStatus) {
                siteSettingData = await SiteSettings.find({
                    attributes: ['value'],
                    where: {
                        name: 'securityDepositPreference'
                    },
                    raw: true
                })

                if (siteSettingData?.value != securityDepositStatus) {
                    return {
                        status: '404',
                        errorMessage: await showErrorMessage({ errorCode: 'securityDepositChange' })
                    };
                }
            }

            const checkAvailableDates = await ListBlockedDates.findAll({
                where: {
                    listId,
                    blockedDates: {
                        $between: [moment(checkIn).format('YYYY-MM-DD HH:MM:SS'), moment(checkOut).format('YYYY-MM-DD HH:MM:SS')]
                    },
                    calendarStatus: {
                        $notIn: ['available']
                    }
                }
            });

            return {
                status: checkAvailableDates?.length > 0 ? '400' : '200'
            };

        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default checkReservation;