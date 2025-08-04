import React from 'react';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, injectIntl } from 'react-intl';
import showToaster from '../../helpers/toasterMessages/showToaster';
// Style
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';
class Dropzone extends React.Component {

    constructor(props) {
        super(props);
        this.complete = this.complete.bind(this);
        this.dropzone = null;
        this.addedFile = this.addedFile.bind(this);
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

        this.setState({
            djsConfig: {
                dictDefaultMessage: '+',
                addRemoveLinks: false,
                maxFilesize: maxUploadSize,
                maxFiles: 20,
                acceptedFiles: 'image/jpeg,image/png',
                hiddenInputContainer: '.dzInputContainer',
            }
        });
    }

    addedFile(file) {
        const { setImageLoader, maxUploadSize, setUploadComplete } = this.props;
        let isOnline = typeof window !== 'undefined' && window.navigator.onLine;

        if(!isOnline) {
			showToaster({ messageId: 'offlineError', toasterType: 'error' })
			this.dropzone.removeFile(file);
            setImageLoader(false);
			return;
		}
        setUploadComplete(true)
        setImageLoader(true)
        let filetypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (file?.size > (1024 * 1024 * parseInt(maxUploadSize))) {
            this.dropzone.removeFile(file);
            showToaster({ messageId: 'maximumUploadSize', toasterType: 'error' })
            setImageLoader(false);
        }

        if (!filetypes.includes(file.type)) {
            showToaster({ messageId: 'invalidImageFile', toasterType: 'error' })
            this.dropzone.removeFile(file);
            setImageLoader(false);
        }
    }

    complete(file) {
        const { listId, createListPhotos, input, setImageLoader } = this.props;
        setImageLoader(true)
        if (file?.xhr) {
            const { files } = JSON.parse(file.xhr.response);
            let fileName, fileType, value;
            fileName = files[0]?.filename;
            fileType = files[0]?.mimetype;
            value = input?.value ? [...input.value] : [];
            value.push(fileName);
            input.onChange(value);
            this.dropzone.removeFile(file);
            setImageLoader(false);
        }
    }

    queueComplete = () => {
        const { setImageLoader, setUploadComplete } = this.props;
        setImageLoader(false);
        setUploadComplete(false)
    }

    render() {
        const { placeholder, listId, errorMessageClass, meta: { touched, error }, maxUploadSize } = this.props;
        // const { djsConfig } = this.state;
        
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png'],
            postUrl: '/claim/photos'
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            complete: this.complete,
            addedfile: this.addedFile,
            queuecomplete: this.queueComplete
        };

        const djsConfig = {
            dictDefaultMessage: '+',
            addRemoveLinks: false,
            maxFilesize: maxUploadSize,
            maxFiles: 20,
            acceptedFiles: 'image/jpeg,image/png',
            // hiddenInputContainer: '.dzInputContainer',
        }

        return (
            <div className={cx(s.claimImageUploadSection, "claimImageUploadContainer")}>
                <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig}
                />
                {touched && error && <span className={errorMessageClass}><FormattedMessage {...error} /> </span>}
            </div>
        );
    }

}

const mapState = (state) => ({
    maxUploadSize: state.siteSettings.data.maxUploadSize
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Dropzone)));
