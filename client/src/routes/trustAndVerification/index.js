import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import TrustAndVerification from './TrustAndVerification';
import { emailVerification } from '../../actions/manageUserVerification';

const title = 'Trust and Verification';

export default async function action({ store, query }) {

  // From Redux Store
  let isAuthenticated = store.getState().runtime.isAuthenticated;
  console.log(store.getState())
  if (!isAuthenticated) {
    if ('confirm' in query && 'email' in query) {
      //return { redirect: '/login?verification=email' };
      return { redirect: "/login?refer=/user/verification------confirm=" + query.confirm + "--email=" + query.email };
    }
    return { redirect: '/login' };
  }

  let accountData = store.getState().account?.data;
  let userId
  if (accountData) {
    userId = accountData.userId;
  }
  if ('confirm' in query && 'email' in query && userId) {
    await store.dispatch(emailVerification(query.confirm, query.email, userId));
  }

  return {
    title,
    component: <UserLayout><TrustAndVerification title={title} /></UserLayout>,
  };
};
