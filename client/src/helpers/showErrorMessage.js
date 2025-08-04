import errorMessage from "./errorMessages/errorMessage_en";
const showErrorMessage = async ({ errorCode, error, language, data }) => {
    const lang = language ? language : "en"
    if (lang == "en") {
        return await errorMessage(errorCode, error, data);
    }
}
export default showErrorMessage;