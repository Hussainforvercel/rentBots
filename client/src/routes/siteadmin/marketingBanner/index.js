import React from 'react';
import BannerSettings from './BannerSettings';
import AdminLayout from '../../../components/Layout/AdminLayout';

export default async function action({ store }) {
  // From Redux Store
  let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
  const adminPrivileges = store.getState().account.privileges && store.getState().account.privileges.privileges;
  const privileges = store.getState().listSettings && store.getState().listSettings.privileges;

  if (!isAdminAuthenticated) {
    return { redirect: '/siteadmin/login' };
  }

  return {
    title: 'Marketing Banner',
    component: <AdminLayout><BannerSettings title="Marketing Banner" /></AdminLayout>,
  };
} 