import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ManagePayoutMegasoft from './ManagePayoutMegasoft';

const title = 'Megasoft Payout Management';

export default async function action({ store }) {

        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        return {
            title,
            component: <AdminLayout><ManagePayoutMegasoft title={title} /></AdminLayout>
        }
    } 