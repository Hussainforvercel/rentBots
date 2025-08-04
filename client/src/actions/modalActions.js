import {
  OPEN_LONGIN_MODAL,
  CLOSE_LONGIN_MODAL,
  OPEN_SIGNUP_MODAL,
  CLOSE_SIGNUP_MODAL,
  OPEN_FORGOT_PASSWORD_MODAL,
  CLOSE_FORGOT_PASSWORD_MODAL,
  OPEN_REPORT_USER_MODAL,
  CLOSE_REPORT_USER_MODAL,
  OPEN_THANK_YOU_MODAL,
  CLOSE_THANK_YOU_MODAL,
  OPEN_SOCIAL_SHARE_MODAL,
  CLOSE_SOCIAL_SHARE_MODAL,
  OPEN_HEADER_MODAL,
  CLOSE_HEADER_MODAL,
  OPEN_FILTER_MODAL,
  CLOSE_FILTER_MODAL,
  OPEN_TRANSACTION_FILTER_MODAL,
  CLOSE_TRANSACTION_FILTER_MODAL,
  CLOSE_MORE_FILTERS_MODAL,
  OPEN_MORE_FILTERS_MODAL
} from '../constants';
import { toggleClose } from './Menu/toggleControl';

const openLoginModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_LONGIN_MODAL,
      isLoginModalOpen: true,
      isSignupModalOpen: false,
      isForgotPasswordOpen: false
    });
    dispatch(toggleClose());
  };
}

const closeLoginModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_LONGIN_MODAL,
      isLoginModalOpen: false
    });
    dispatch(toggleClose());
  };
}

const openSignupModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_SIGNUP_MODAL,
      isSignupModalOpen: true,
      isLoginModalOpen: false
    });
  };
}

const closeSignupModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_SIGNUP_MODAL,
      isSignupModalOpen: false
    });
  };
}

const openForgotPasswordModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_FORGOT_PASSWORD_MODAL,
      isForgotPasswordOpen: true,
      isLoginModalOpen: false
    });
  };
}

const closeForgotPasswordModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_FORGOT_PASSWORD_MODAL,
      isForgotPasswordOpen: false
    });
  };
}

const openReportUserModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_REPORT_USER_MODAL,
      payload: {
        isReportUserModalOpen: true,
      }
    });
  };
}

const closeReportUserModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_REPORT_USER_MODAL,
      payload: {
        isReportUserModalOpen: false
      }
    });
  };
}

const openThankYouModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_THANK_YOU_MODAL,
      payload: {
        isThankYouModalOpen: true,
        isReportUserModalOpen: false
      }
    });
  };
}

const closeThankYouModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_THANK_YOU_MODAL,
      payload: {
        isThankYouModalOpen: false,
      }
    });
  };
}

const openSocialShareModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_SOCIAL_SHARE_MODAL,
      payload: {
        isSocialShareModal: true,
      }
    });
  };
}

const closeSocialShareModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_SOCIAL_SHARE_MODAL,
      payload: {
        isSocialShareModal: false,
      }
    });
  };
}

const openHeaderModal = (modalType) => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_HEADER_MODAL,
      payload: {
        modalType,
        actionValue: true
      }
    });
  };
}

const closeHeaderModal = (modalType) => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_HEADER_MODAL,
      payload: {
        modalType,
        actionValue: false
      }
    });
  };
}


const openFiletrModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_FILTER_MODAL,
      payload: {
        filterModal: true
      }
    })
  }
}


const closeFilterModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_FILTER_MODAL,
      payload: {
        filterModal: false
      }
    })
  }
}

const openTransactionModal = () => {
  return (dispatch) => {
    dispatch({
      type: OPEN_TRANSACTION_FILTER_MODAL,
      payload: {
        transactionFilterModal: true
      }
    })
  }
}

const closeTransactionModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_TRANSACTION_FILTER_MODAL,
      payload: {
        transactionFilterModal: false
      }
    })
  }
}

const openMoreFiltersModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: OPEN_MORE_FILTERS_MODAL,
      payload: {
        isMoreFiltersModal: true,
      },
    });
  }
}

const closeMoreFiltersModal = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: CLOSE_MORE_FILTERS_MODAL,
      payload: {
        isMoreFiltersModal: false,
      }
    });
  };
}

export {
  openLoginModal, closeLoginModal, openSignupModal, closeSignupModal,
  openForgotPasswordModal, closeForgotPasswordModal, openReportUserModal,
  closeReportUserModal, openThankYouModal, closeThankYouModal,
  openSocialShareModal, closeSocialShareModal, openHeaderModal, closeHeaderModal,
  openFiletrModal, closeFilterModal, openTransactionModal, closeTransactionModal,
  openMoreFiltersModal, closeMoreFiltersModal
};