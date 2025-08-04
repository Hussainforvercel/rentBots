import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { connect } from 'react-redux';
import cx from 'classnames';
import { change } from "redux-form";
import showToaster from '../../../helpers/toasterMessages/showToaster';
import dropzoneError from '../../../helpers/dropzoneError';
import { setLoaderStart, setLoaderComplete } from '../../../actions/loader/loader';

export class ImageUploadComponent extends Component {

	constructor(props) {
		super(props);
		this.dropzone = null;
	}

	componentDidUpdate() {
		const isBrowser = typeof window !== 'undefined';
		const isDocument = typeof document !== undefined;
		if (isBrowser && isDocument) {
			document.querySelector(".dz-hidden-input").style.visibility = 'visible';
			document.querySelector(".dz-hidden-input").style.opacity = '0';
			document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
		}
	}

	error = async (file) => {
		const { setLoaderComplete, loaderName, maxUploadSize, getSiteSettingsLogo } = this.props;

		await dropzoneError(file, maxUploadSize, getSiteSettingsLogo)

		if (loaderName) setLoaderComplete(loaderName);

	};

	success = async (file, fromServer) => {
		const { change, setLoaderComplete } = this.props;
		let fileName = fromServer.file.filename;
		await setLoaderComplete('ogImage');
		this.dropzone.removeFile(file);
		await change('SiteSettingsForm', 'ogImage', fileName);
	}

	complete = (file) => {
		const { setLoaderComplete, loaderName } = this.props;
		this.dropzone.files = [];
		if (loaderName) setLoaderComplete(loaderName);
	}


	addedfile = (file) => {
		const { setLoaderStart, loaderName } = this.props;
		let isOnline = typeof window !== 'undefined' && typeof window !== 'undefined' && window.navigator.onLine;

        if (!isOnline) {
            showToaster({ messageId: 'offlineError', toasterType: 'error' })
            this.dropzone.removeFile(file);
			if (loaderName) setLoaderComplete(loaderName)
            return;
        }
		if (loaderName) setLoaderStart(loaderName);
	}

	render() {
		const { defaultMessage, className, subTextClass, subText, componentConfig, success, maxUploadSize, getSiteSettingsLogo, imageName } = this.props;
		let pngFormat = getSiteSettingsLogo?.name === "faviconLogo" ? 'image/png' : 'image/jpeg, image/png, image/jpg';
		const eventHandlers = {
			init: dz => this.dropzone = dz,
			success: imageName == 'ogImage' ? this.success : success,
			error: this.error,
			complete: this.complete,
			addedfile: this.addedfile
		};

		const djsConfig = {
			dictDefaultMessage: '',
			addRemoveLinks: false,
			uploadMultiple: false,
			maxFilesize: parseInt(maxUploadSize),
			acceptedFiles: pngFormat,
			dictMaxFilesExceeded: 'Remove the existing image and try upload again',
			previewsContainer: false,
			hiddenInputContainer: '.dzInputContainerLogo',
			timeout: 300000,
			maxFiles: 1
		};

		return (
			<div className={cx('listPhotoContainer')}>
				<div className={cx('dzInputContainerLogo', 'dzInputContainerLogoOpacity')}>
					<div className={className}>
						<DropzoneComponent
							config={componentConfig}
							eventHandlers={eventHandlers}
							djsConfig={{
								...djsConfig
							}}

						>
							{defaultMessage}
						</DropzoneComponent>
					</div>
				</div>
				{subText && <p className={cx(subTextClass, 'droupText')}><span>{subText}:</span> <span>{maxUploadSize}MB</span></p>}
			</div>
		)
	}
}

const mapState = state => ({
	maxUploadSize: state?.siteSettings?.data?.maxUploadSize
});

const mapDispatch = {
	setLoaderStart,
	setLoaderComplete,
	change
};

export default (connect(mapState, mapDispatch)(ImageUploadComponent));

