import showToaster from '../helpers/toasterMessages/showToaster'

export default function dropzoneError(file, maxUploadSize, getSiteSettingsLogo) {
    try {
        let errorToastr, fileFormates;

        fileFormates = [
            'application/sql',
            'application/pdf',
            'application/vnd.oasis.opendocument.presentation',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/epub+zip',
            'application/zip',
            'text/plain',
            'application/rtf',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.spreadsheet',
            'text/tab-separated-values',
            'text/calendar'
        ];

        if (getSiteSettingsLogo && file.type != "image/png" && (file.accepted === false || fileFormates.indexOf(file.type) >= 0)) {
            showToaster({ messageId: 'uploadPngImage', toasterType: 'error' })
            return;
        }

        if (file?.size > (1024 * 1024 * parseInt(maxUploadSize))) {
            errorToastr = showToaster({ messageId: 'maximumUploadSize', toasterType: 'error' })
            return errorToastr;
        }

        if (file?.accepted === false || fileFormates.indexOf(file.type) >= 0) {
            errorToastr = showToaster({ messageId: 'invalidImageFile', toasterType: 'error' })
            return errorToastr;
        }

    } catch (error) {
        console.log(error)
    }
}