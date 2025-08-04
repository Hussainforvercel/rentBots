import {
    ADMIN_UPDATE_STATIC_START,
    ADMIN_UPDATE_STATIC_SUCCESS,
    ADMIN_UPDATE_STATIC_ERROR
} from '../../constants';
// Redirection
import history from '../../core/history';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { updateStaticPage as mutation, getEditStaticPage as query } from '../../lib/graphql';

export const updateStaticPageAction = (values) => {
    return async (dispatch, getState, { client }) => {
        try {

            dispatch({ type: ADMIN_UPDATE_STATIC_START });
            const { data } = await client.mutate({
                mutation,
                variables: {
                    content: values.content,
                    metaTitle: values.metaTitle,
                    metaDescription: values.metaDescription,
                    id: values.id
                },
                refetchQueries: [{ query, variables: { id: values.id } }]
            });

            if (data?.updateStaticPage?.status === "success") {
                showToaster({ messageId: 'updateStaticPageSuccess', toasterType: 'success' })
                history.push('/siteadmin/staticpage/management');
                dispatch({ type: ADMIN_UPDATE_STATIC_SUCCESS });
            }
            else {
                showToaster({ messageId: 'updateStaticPageFailed', toasterType: 'error' })
                dispatch({ type: ADMIN_UPDATE_STATIC_ERROR });
            }

        } catch (error) {
            console.log(error);
            showToaster({ messageId: 'updateStaticPageStatus', toasterType: 'error' })
            dispatch({ type: ADMIN_UPDATE_STATIC_ERROR });
            return false;
        }
        return true;
    };
}