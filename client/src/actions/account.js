/* eslint-disable import/prefer-default-export */
import {
  SET_USER_DATA_START,
  SET_USER_DATA_SUCCESS,
  SET_USER_DATA_ERROR
} from '../constants';
import history from '../core/history';
import { decode } from '../helpers/queryEncryption';
import { userAccount as query } from '../lib/graphql';

export const loadAccount = (loginScreen, refer) => {
  return async (dispatch, getState, { graphqlRequest }) => {

    try {
      dispatch({
        type: SET_USER_DATA_START,
      });

      const { data } = await graphqlRequest(query);

      if (data?.userAccount) {
        let dateOfBirth = data.userAccount.dateOfBirth, updatedProfileData;

        if (dateOfBirth != null) {
          let dateOfBirthArray = dateOfBirth.split("-");
          let dateOfBirthObj = {
            "month": Number(dateOfBirthArray[0] - 1),
            "year": dateOfBirthArray[1],
            "day": dateOfBirthArray[2],
          };
          let decodedObj = {
            'email': decode(data.userAccount.email),
            'phoneNumber': decode(data.userAccount.phoneNumber)
          };
          updatedProfileData = Object.assign({}, data.userAccount, dateOfBirthObj, decodedObj);
        } else {
          let decodedObj = {
            'email': decode(data && data.userAccount && data.userAccount.email),
            'phoneNumber': decode(data && data.userAccount && data.userAccount.phoneNumber)
          }
          updatedProfileData = { ...data.userAccount, ...decodedObj };
        }
        dispatch({
          type: SET_USER_DATA_SUCCESS,
          updatedProfileData
        });
        if (loginScreen) {
          if (refer) {
            history.push(refer);
          } else {
            history.push('/dashboard');
          }
        }
      }
    } catch (error) {
      dispatch({
        type: SET_USER_DATA_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }
    return true;
  };
}
