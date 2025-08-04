import {
  OPEN_WISH_LIST_GROUP_MODAL,
  CLOSE_WISH_LIST_GROUP_MODAL,
  OPEN_WISH_LIST_MODAL,
  CLOSE_WISH_LIST_MODAL
} from '../../constants';
import { initialize } from 'redux-form';
import { openLoginModal } from '../../actions/modalActions';

const openAddWishListGroupModal = (initialData, formName) => {
  return (dispatch, getState) => {

    dispatch(initialize(formName, initialData, true));
    dispatch({
      type: OPEN_WISH_LIST_GROUP_MODAL,
      wishListGroupModalOpen: true,
    });

  };
}

const openEditWishListGroupModal = (initialData) => {
  return (dispatch, getState) => {

    dispatch(initialize("EditListSettingsForm", initialData, true));
    dispatch({
      type: OPEN_WISH_LIST_GROUP_MODAL,
      wishListGroupModalOpen: true,
    });

  };
}

const closeWishListGroupModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_WISH_LIST_GROUP_MODAL,
      wishListGroupModalOpen: false
    });
  };
}

const openWishListModal = (listId, isEditWishList) => {
  return (dispatch, getState) => {
    let isAuthenticated = getState().runtime.isAuthenticated;

    if (isAuthenticated) {
      dispatch({
        type: OPEN_WISH_LIST_MODAL,
        payload: {
          wishListModalOpen: true,
          listId: listId,
          isEditWishList: isEditWishList
        }
      });
    } else {
      dispatch(openLoginModal());
    }
  };
}

const closeWishListModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_WISH_LIST_MODAL,
      payload: {
        wishListModalOpen: false
      }
    });
  };
}

export {
  openAddWishListGroupModal, openEditWishListGroupModal, closeWishListGroupModal,
  openWishListModal, closeWishListModal
}; 
