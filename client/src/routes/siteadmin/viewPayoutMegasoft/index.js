import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ViewPayoutMegasoft from './ViewPayoutMegasoft';

const title = 'Megasoft Payout Details';

export default async function action({ store, params }) {

        let isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;

        if (!isAdminAuthenticated) {
            return { redirect: '/siteadmin/login' };
        }

        const id = params.id;
        return {
            title,
            component: <AdminLayout><ViewPayoutMegasoft title={title} id={Number(id)} /></AdminLayout>
        }
    } 