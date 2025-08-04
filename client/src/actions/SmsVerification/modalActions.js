import {
  OPEN_SMS_VERIFICATION_MODAL,
  CLOSE_SMS_VERIFICATION_MODAL
} from '../../constants';

const openSmsVerificationModal = (formType) => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_SMS_VERIFICATION_MODAL,
      payload: {
        smsVerificationModalOpen: true,
        formType
      }
    });
  };
}

const closeSmsVerificationModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_SMS_VERIFICATION_MODAL
    });
  };
}

export { openSmsVerificationModal, closeSmsVerificationModal };