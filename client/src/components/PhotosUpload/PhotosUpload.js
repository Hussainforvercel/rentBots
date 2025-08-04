import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, injectIntl } from 'react-intl';

import PhotosList from '../PhotosList';
import showToaster from '../../helpers/toasterMessages/showToaster';
import messages from '../../locale/messages';
import dropzoneError from '../../helpers/dropzoneError';
import { createListPhotos, removeListPhotos } from '../../actions/manageListPhotos';
import { stopProfilePhotoLoader } from '../../actions/manageUserProfilePicture';

import PictureImage from '/public/SiteIcons/photoUpload.svg';

import s from '!isomorphic-style-loader!css-loader!./filepicker.css';

class PhotosUpload extends Component {

  static propTypes = {
    createListPhotos: PropTypes.any.isRequired,
    removeListPhotos: PropTypes.any.isRequired,
    listId: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.dropzone = null;
    this.state = {
      djsConfig: {}
    }
  }

  componentDidMount() {
    const { placeholder, maxUploadSize } = this.props;
    const isBrowser = typeof window !== 'undefined';
    const isDocument = typeof document !== undefined;
    if (isBrowser && isDocument) {
      document.querySelector(".dz-hidden-input").style.visibility = 'visible';
      document.querySelector(".dz-hidden-input").style.opacity = '0';
      document.querySelector(".dz-hidden-input").style.height = '100%';
      document.querySelector(".dz-hidden-input").style.width = '100%';
      document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
    }

    if (placeholder) {
      this.setState({
        djsConfig: {
          dictDefaultMessage: "",
          addRemoveLinks: false,
          maxFilesize: maxUploadSize,
          acceptedFiles: 'image/jpeg, image/png, image/jpg',
          hiddenInputContainer: '.dzInputContainer'
        }
      });
    }
  }

  UNSAFE_componentWillMount() {
    const { placeholder, maxUploadSize } = this.props;

    if (placeholder) {
      this.setState({
        djsConfig: {
          dictDefaultMessage: "",
          addRemoveLinks: false,
          maxFilesize: maxUploadSize,
          acceptedFiles: 'image/jpeg, image/png, image/jpg',
          hiddenInputContainer: '.dzInputContainer'
        }
      });
    }
  }

  error = (file) => {
    const { stopProfilePhotoLoader, maxUploadSize } = this.props;

    dropzoneError(file, maxUploadSize);
    this.dropzone.removeFile(file);
    stopProfilePhotoLoader();
  }

  addedfile = (file) => {
    const { maxUploadSize, stopProfilePhotoLoader } = this.props;
    let isOnline = typeof window !== 'undefined' && window.navigator.onLine;

    if (!isOnline) {
      showToaster({ messageId: 'offlineError', toasterType: 'error' })
      this.dropzone.removeFile(file);
      stopProfilePhotoLoader();
      return;
    }
    if (file?.size > (1024 * 1024 * parseInt(maxUploadSize))) {
      showToaster({ messageId: 'maximumUploadSize', toasterType: 'error' })
      this.dropzone.removeFile(file);
    }
  }

  complete = (file) => {
    const { listId, createListPhotos } = this.props;
    if (file && file.xhr) {
      const { files } = JSON.parse(file.xhr.response);
      let fileName = files[0].filename;
      let fileType = files[0].mimetype;
      if (listId != undefined) {
        createListPhotos(listId, fileName, fileType);
      }
      this.dropzone.removeFile(file);
    }
  }

  render() {
    const { placeholder, listId, maxUploadSize } = this.props;
    const { djsConfig } = this.state;
    const componentConfig = {
      iconFiletypes: ['.jpg', '.png', 'jpeg'],
      postUrl: '/photos'
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: this.success,
      complete: this.complete,
      addedfile: this.addedfile,
      error: this.error
    };

    return (
      <div className={cx('listPhotoContainer')}>
        <div className={cx('dzInputContainer')}>
          <DropzoneComponent
            config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}
          >
            <img src={PictureImage} className={'photoUploadImg'} alt='PictureImage' />
            <span className={'documentPlaceholder'}>{placeholder}</span>

          </DropzoneComponent>
        </div>
        <div className={'maxText'}>
          <FormattedMessage {...messages.uploadSizedLabel} />{' '}{maxUploadSize}MB
        </div>
        <PhotosList listId={listId} />
      </div>
    );
  }
}

const mapState = (state) => ({
  maxUploadSize: state?.siteSettings?.data?.maxUploadSize
});

const mapDispatch = {
  createListPhotos,
  removeListPhotos,
  stopProfilePhotoLoader
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(PhotosUpload)));
