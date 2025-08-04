import { toastr } from 'react-redux-toastr';
import errorMessage from '../errorMessages/errorMessage_en';

const showToaster = async ({ messageId, toasterType, requestMessage, language }) => {

    let message, lang, title;
    lang = language ? language : "en";
    if (lang == "en") {
        title = await errorMessage(toasterType);
        message = await errorMessage(messageId, requestMessage)
    }
    return toastr[toasterType](title, message)
}
export default showToaster;
