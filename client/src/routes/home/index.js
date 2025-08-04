import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import HomeLayout from '../../components/Layout/HomeLayout';

import { getListingFields } from '../../actions/getListingFields';

export default async function action({ store }) {
  const state = store.getState();
  const siteSettings = state.siteSettings?.data || {};
  const title = siteSettings.siteTitle || 'Home';
  const description = siteSettings.metaDescription || '';
  const listingFields = state.listingFields?.data;
  const layoutType = siteSettings.homePageType || 'default';
  const wholeData = state.homeBannerImages?.data || [];
  console.log(siteSettings,"wholeData");
  if (listingFields === undefined) {
    store.dispatch(getListingFields());
  }

  return {
    title,
    description,
    listingFields,
    chunk: 'home',
    component: <HomeLayout layoutType={layoutType}><Home layoutType={layoutType} wholeData={wholeData} /></HomeLayout>,
  };
};
