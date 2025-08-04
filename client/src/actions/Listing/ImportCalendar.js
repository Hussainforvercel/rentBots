import {
    IMPORT_CALENDAR_START,
    IMPORT_CALENDAR_SUCCESS,
    IMPORT_CALENDAR_ERROR,
} from '../../constants';
import { importCalendar } from '../../core/iCal/importCalendar';
import { getListingDataStep3 } from '../getListingDataStep3';
import showToaster from '../../helpers/toasterMessages/showToaster'
import { GetCalendars as query, BlockImportedDates as mutation } from '../../lib/graphql';

export const importiCal = (listId, name, url, calendarId) => {
    return async (dispatch, getState, { client }) => {

        try {

            dispatch({
                type: IMPORT_CALENDAR_START,
                payload: {
                    importCalLoading: true
                }
            });

            const data = {
                listId,
                name,
                url,
                calendarId
            };

            const { status, blockedDates, calendarDataId } = await importCalendar(data);

            var importCalendarId = calendarId ? calendarId : calendarDataId;

            if (status === 200) {
                showToaster({ messageId: 'importCalendar', toasterType: 'success' })
                if (!calendarId) {
                    const { data } = await client.query({
                        query,
                        variables: { listId },
                        fetchPolicy: 'network-only',
                    });
                    if (data?.getListingCalendars) {
                        dispatch({
                            type: IMPORT_CALENDAR_SUCCESS,
                            payload: {
                                calendars: data?.getListingCalendars,
                                importCalLoading: false
                            }
                        });
                    }
                }

                const { data } = await client.mutate({
                    mutation,
                    variables: { listId, calendarId: importCalendarId, blockedDates },
                });

                if (data?.blockImportedDates) {
                    if (data?.blockImportedDates?.status === '200') {
                        await dispatch(getListingDataStep3(listId));
                    }
                }
                dispatch({
                    type: IMPORT_CALENDAR_ERROR,
                    payload: {
                        importCalLoading: false
                    }
                });

            } else {
                if (status === 409) {
                    showToaster({ messageId: 'calendarAlreadyExists', toasterType: 'error' })
                } else {
                    showToaster({ messageId: 'invalidCalendar', toasterType: 'error' })
                }

                dispatch({
                    type: IMPORT_CALENDAR_ERROR,
                    payload: {
                        status,
                        importCalLoading: false
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: IMPORT_CALENDAR_ERROR,
                payload: {
                    error,
                    importCalLoading: false
                }
            });
        }
    };
}