import {
    DELETE_IMPORT_CALENDAR_START,
    DELETE_IMPORT_CALENDAR_SUCCESS,
    DELETE_IMPORT_CALENDAR_ERROR,
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { getListingDataStep3 } from '../getListingDataStep3';
import { GetCalendars as query, DeleteCalendar as mutation } from '../../lib/graphql/listing';

export const deleteImportCal = (listId, calendarId) => {
    return async (dispatch, getState, { client }) => {
        try {

            dispatch({
                type: DELETE_IMPORT_CALENDAR_START,
                payload: {
                    importCalLoading: true
                }
            });

            const { data } = await client.mutate({
                mutation,
                variables: { listId, calendarId },
            });

            if (data?.deleteCalendar?.status === '200') {
                showToaster({ messageId: 'calendarRemoved', toasterType: 'error' })
                const { data } = await client.query({
                    query,
                    variables: { listId },
                    fetchPolicy: 'network-only',
                });
                if (data?.getListingCalendars) {
                    dispatch({
                        type: DELETE_IMPORT_CALENDAR_SUCCESS,
                        payload: {
                            calendars: data?.getListingCalendars,
                            importCalLoading: false
                        }
                    });
                    dispatch(getListingDataStep3(listId));
                }
            } else {
                showToaster({ messageId: 'deleteCalendarFailed', toasterType: 'error' })
                dispatch({
                    type: DELETE_IMPORT_CALENDAR_ERROR,
                    payload: {
                        status: data?.deleteCalendar?.status,
                        importCalLoading: false
                    }
                });
            }

        } catch (error) {
            dispatch({
                type: DELETE_IMPORT_CALENDAR_ERROR,
                payload: {
                    error,
                    importCalLoading: false
                }
            });
        }
    };
}