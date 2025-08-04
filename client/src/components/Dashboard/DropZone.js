import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';
import {
    doUploadProfilePicture,
    startProfilePhotoLoader,
    stopProfilePhotoLoader
} from '../../actions/manageUserProfilePicture';
import showToaster from '../../helpers/toasterMessages/showToaster';
import editIcon from '/public/SiteIcons/editingWishIcon.svg';
import profileEditIcon from '/public/SiteIcons/editProfileIcon.svg';
import cs from '../../components/commonStyle.css';

class Dropzone extends Component {

    static propTypes = {
        doUploadProfilePicture: PropTypes.any.isRequired,
        startProfilePhotoLoader: PropTypes.any.isRequired,
        guestPicture: PropTypes.string,
        formatMessage: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.dropzone = null;
    }

    componentDidMount() {
        const isBrowser = typeof window !== 'undefined';
        const isDocument = typeof document !== undefined;
        if (isBrowser && isDocument) {
            document.querySelector(".dz-hidden-input").style.visibility = 'visible';
            document.querySelector(".dz-hidden-input").style.opacity = '0';
            document.querySelector(".dz-hidden-input").style.height = '100%';
            document.querySelector(".dz-hidden-input").style.width = '100%';
            document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
        }
    }

    componentDidUpdate() {
        const isBrowser = typeof window !== 'undefined';
        const isDocument = typeof document !== undefined;
        if (isBrowser && isDocument) {
            document.querySelector(".dz-hidden-input").style.visibility = 'visible';
            document.querySelector(".dz-hidden-input").style.opacity = '0';
            document.querySelector(".dz-hidden-input").style.height = '100%';
            document.querySelector(".dz-hidden-input").style.width = '100%';
            document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
        }
    }

    success = (file, fromServer) => {
        const { doUploadProfilePicture, guestPicture } = this.props;
        let fileName = fromServer.file.filename;
        doUploadProfilePicture(fileName, guestPicture);
    }

    addedfile = (file, fromServer) => {
        const { stopProfilePhotoLoader, maxUploadSize, startProfilePhotoLoader } = this.props;
        let filetypes = ['image/jpeg', 'image/png', 'image/jpg']
        let isOnline = typeof window !== 'undefined' && window.navigator.onLine;

        if(!isOnline) {
			showToaster({ messageId: 'offlineError', toasterType: 'error' })
			this.dropzone.removeFile(file);
            stopProfilePhotoLoader();
			return;
		}
        startProfilePhotoLoader();
        if (file?.size > (1024 * 1024 * parseInt(maxUploadSize))) {
            showToaster({ messageId: 'maximumUploadSize', toasterType: 'error' })
            this.dropzone.removeFile(file);
            stopProfilePhotoLoader();
            return;
        }
        if (file && !filetypes.includes(file.type)) {
            this.dropzone.removeFile(file);
            showToaster({ messageId: 'invalidImageFile', toasterType: 'error' })
            stopProfilePhotoLoader();
            return;
        }
    }

    render() {
        const { defaultMessage, maxUploadSize, className, iconPosition, isEditIcon } = this.props;
        const djsConfig = {
            dictDefaultMessage: '',
            addRemoveLinks: false,
            uploadMultiple: false,
            maxFilesize: maxUploadSize,
            acceptedFiles: 'image/jpeg,image/png',
            dictMaxFilesExceeded: 'Remove the existing image and try upload again',
            previewsContainer: false,
            hiddenInputContainer: '.dashboardDropzoneBox'
        };
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png'],
            postUrl: '/uploadProfilePhoto'
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            success: this.success,
            addedfile: this.addedfile
        };

        return (
            <div className={'dashboardDropzoneParent'}>
                <div className={cx('dashboardDropzoneBox', 'dashboardFile', className)}>
                    <DropzoneComponent
                        config={componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={djsConfig}
                    >
                        {isEditIcon ? <img src={profileEditIcon} /> : <span><img src={editIcon} className={cx(cs.dropzoneImgSpace, iconPosition, 'dropzoneImgSpaceRTL')} />{defaultMessage}</span>}
                    </DropzoneComponent>
                </div>
            </div>
        );
    }
}

const mapState = (state) => ({
    maxUploadSize: state.siteSettings.data.maxUploadSize
});

const mapDispatch = {
    doUploadProfilePicture,
    startProfilePhotoLoader,
    stopProfilePhotoLoader
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Dropzone)));
