// Redux Form
import { reset } from 'redux-form';
import { closeReportUserModal, openThankYouModal } from '../../actions/modalActions';
import showToaster from '../../helpers/toasterMessages/showToaster'
// Send Email
import { sendEmail } from '../../core/email/sendEmail';
// Fetch request
import fetch from '../../core/fetch';

async function submit(values, dispatch) {

    const query = `mutation (
    $reporterId:String,
    $userId:String,
    $reportType: String,
    $profileId: Int,
    $reporterName: String,
  ) {
      CreateReportUser (
        reporterId:$reporterId,
        userId:$userId,
        reportType: $reportType,
        profileId: $profileId,
        reporterName: $reporterName,
      ) {
        status
        firstName
      }
    }`;


    const resp = await fetch('/graphql', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: values
        }),
        credentials: 'include'
    });

    const { data } = await resp.json();

    if (data?.CreateReportUser?.status == "success") {
        dispatch(closeReportUserModal());
        dispatch(reset('ReportUserForm'));
        dispatch(openThankYouModal());

        let email = values?.adminEmail;
        // Send Email
        let content = {
            userName: data?.CreateReportUser?.firstName,
            reporterName: values?.reporterName,
            reportType: values?.reportType
        };
        const { status, response } = await sendEmail(email, 'reportUser', content);
        if (status === 200) {
            console.log("inside status 200");
            // dispatch(openThankYouModal());
        }

    } else {
        showToaster({ messageId: 'formError', toasterType: 'error' })
    }

}

export default submit;
