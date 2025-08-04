import {
    SEND_VERIFICATION_SMS_START,
    SEND_VERIFICATION_SMS_SUCCESS,
    SEND_VERIFICATION_SMS_ERROR
} from '../../constants';
import { openSmsVerificationModal } from '../SmsVerification/modalActions';
import { processSms } from '../../core/sms/processSms';
import { decode } from '../../helpers/queryEncryption';
import { setLoaderStart, setLoaderComplete } from '../loader/loader';
import { AddPhoneNumber as mutation, getPhoneData } from '../../lib/graphql';

export const sendVerificationSms = (countryCode, phoneNumber) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: SEND_VERIFICATION_SMS_START,
                payload: {
                    smsLoading: true
                }
            });
            dispatch(setLoaderStart('smsLoading'));

            const { data } = await client.mutate({
                mutation,
                variables: {
                    countryCode,
                    phoneNumber
                },
                refetchQueries: [{
                    query: getPhoneData
                }]
            });

            if (data?.AddPhoneNumber?.status == '200') {
                const { status, errorMessage } = await processSms('verification',
                    data.AddPhoneNumber.countryCode,
                    decode(data.AddPhoneNumber.phoneNumber),
                    data.AddPhoneNumber.userProfileNumber
                );

                if (status == 200) {
                    dispatch(openSmsVerificationModal('verifyPhoneNumber'));
                    dispatch({
                        type: SEND_VERIFICATION_SMS_SUCCESS,
                        payload: {
                            smsLoading: false
                        }
                    });
                } else {
                    dispatch({
                        type: SEND_VERIFICATION_SMS_ERROR,
                        payload: {
                            smsLoading: false
                        }
                    });
                }
                dispatch(setLoaderComplete('smsLoading'));

                if (errorMessage) {
                    return {
                        status,
                        errorMessage
                    }
                }
            } else {
                dispatch({
                    type: SEND_VERIFICATION_SMS_ERROR,
                    payload: {
                        smsLoading: false
                    }
                });
                dispatch(setLoaderComplete('smsLoading'));

                return {
                    status: 400,
                    errorMessage: 'Oops! Something error occured. Please try again.'
                };
            }
        } catch (error) {
            dispatch(setLoaderComplete('smsLoading'));
            dispatch({
                type: SEND_VERIFICATION_SMS_ERROR,
                payload: {
                    error,
                    smsLoading: false
                }
            });
            return {
                status: 400
            };
        }
        return {
            status: 200
        };
    };
}