import { reset } from 'redux-form';
import {
  CONTACT_HOST_OPEN,
  CONTACT_HOST_CLOSE,
} from '../../constants';
import { openLoginModal } from '../modalActions';
import history from '../../core/history';

const contactHostOpen = (listId) => {
  return async (dispatch, getState, { client }) => {

    const isAuthenticated = getState().runtime.isAuthenticated

    if (!isAuthenticated) {
      if (listId) {
        history.push('/login?refer=/cars/' + listId);
      } else {
        dispatch(openLoginModal());
      }
      return false;
    }

    dispatch({
      type: CONTACT_HOST_OPEN,
      payload: {
        showContactHostModal: true
      }
    });

    return true;
  };
}

const contactHostClose = () => {
  return async (dispatch, getState, { client }) => {

    dispatch(reset('ContactHostForm'));
    dispatch({
      type: CONTACT_HOST_CLOSE,
      payload: {
        showContactHostModal: false
      }
    });

    return true;
  };
}

export { contactHostOpen, contactHostClose };