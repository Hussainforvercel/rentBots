import React, { Component } from 'react';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, gql, compose } from 'react-apollo';
import DocumentList from '../DocumentList';
import showToaster from '../../helpers/toasterMessages/showToaster';
import PictureImage from '/public/SiteIcons/photoUpload.svg';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';

const query = gql`query ShowDocumentList {
    ShowDocumentList {
        id
        userId,
        fileName,
        fileType
    }
  }`;

class DocumentUpload extends Component {

  static propTypes = {
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

  complete = async (file) => {
    const { mutate } = this.props;
    let variables = {}, fileName, fileType;
    if (file && file.xhr) {
      const { files } = JSON.parse(file.xhr.response);
      fileName = files[0].filename;
      fileType = files[0].mimetype;
      variables = {
        fileName,
        fileType
      };
      const { data } = await mutate({
        variables,
        refetchQueries: [{ query }]
      });

      if (data?.uploadDocument) {
        if (data?.uploadDocument?.status === 'success') {
          showToaster({ messageId: 'uploadDocument', toasterType: 'success' })
        } else {
          showToaster({ messageId: 'uploadDocumentError', toasterType: 'error' })
        }
      }
    }
    this.dropzone.removeFile(file);
  }

  addedfile = async (file) => {

    const { maxUploadSize } = this.props;
    let isOnline = typeof window !== 'undefined' && window.navigator.onLine;

    if (!isOnline) {
      showToaster({ messageId: 'offlineError', toasterType: 'error' })
      this.dropzone.removeFile(file);
      return;
    }

    let filetypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (file?.size > (1024 * 1024 * parseInt(maxUploadSize))) {
      this.dropzone.removeFile(file);
      showToaster({ messageId: 'maximumUploadSize', toasterType: 'error' })
      return;
    }

    if (!filetypes.includes(file.type)) {
      showToaster({ messageId: 'invalidImageFile', toasterType: 'error' })
      this.dropzone.removeFile(file);
      return;
    }
  }

  render() {
    const { placeholder, maxUploadSize } = this.props;
    const djsConfig = {
      dictDefaultMessage: '',
      addRemoveLinks: false,
      maxFilesize: maxUploadSize,
      maxFiles: 10,
      acceptedFiles: 'image/*,application/pdf',
      hiddenInputContainer: '.dzInputContainer'
    };
    const componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.pdf'],
      postUrl: '/documents'
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      complete: this.complete,
      addedfile: this.addedfile
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
            <span className={cx('documentPlaceholder')}>{placeholder}</span>
          </DropzoneComponent>
        </div>
        <DocumentList />
      </div>
    );
  }

}

const mapState = (state) => ({
  maxUploadSize: state?.siteSettings?.data?.maxUploadSize
});

const mapDispatch = {
};

export default compose(withStyles(s),

  graphql(gql`mutation uploadDocument($fileName: String,$fileType: String,){
     uploadDocument(
       fileName: $fileName,
       fileType: $fileType
     ) {    
         fileName
         fileType
         status        
        }
 }`
  ),
  (connect(mapState, mapDispatch)))(DocumentUpload);

