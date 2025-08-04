import React from 'react';
import Layout from './../components/Layout';
import MegasoftSuccess from './megasoft-success';

const title = 'Megasoft';

export default async function action({ store, params }) {

    const isAuthenticated = store.getState().runtime.isAuthenticated;

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }


    return {
      title,
      component: <Layout><MegasoftSuccess/></Layout>,
    };
  };
