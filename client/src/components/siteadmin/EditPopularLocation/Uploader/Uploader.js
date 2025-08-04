import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { change } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl';

import ImageUploadComponent from '../../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../../CommonImageDisplay/CommomImageDisplay';

import { doRemoveLocation, doUploadLocation, startLocationUploaderLoader, endLocationUploaderLoader } from '../../../../actions/siteadmin/manageLocationImage';
import messages from '../../../../locale/messages';
import { photosShow } from '../../../../helpers/photosShow';
import { locationuploadDir } from '../../../../config.js';

import s from './Uploader.css';
import cs from '../../../../components/commonStyle.css';


class Uploader extends React.Component {

  static propTypes = {
    values: PropTypes.any,
    locationUploaderLoading: PropTypes.bool,
    loading: PropTypes.bool,
    doRemoveLocation: PropTypes.any.isRequired,
  };

  static defaultProps = {
    locationUploaderLoading: false,
  };

  success = async (file, fromServer) => {
    const { doUploadLocation, values, change, startLocationUploaderLoader, endLocationUploaderLoader } = this.props;
    let fileName = fromServer.file.filename;
    let oldPicture = values.image != null ? values.image : null;
    let filePath = fromServer.file.path;
    let image = fileName;
    await startLocationUploaderLoader();
    doUploadLocation(image, filePath, oldPicture, values.id);
    await change('EditPopularLocation', 'image', fileName);
    await endLocationUploaderLoader();
  }

  render() {
    const { doRemoveLocation, locationUploaderLoading, values } = this.props;
    const { formatMessage } = this.props.intl;

    let loading = true, path;
    if (values) {
      loading = false;
    }
    path = photosShow(locationuploadDir);

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={cs.picContainerMain}>
            <div className={cs.picContainer}>
              <CommonImageDisplay
                loading={loading}
                loader={locationUploaderLoading}
                isDefaultPic={values?.image ? false : true}
                isDelete={false}
                image={values?.image && path + values?.image}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2, s.spaceTop2)}>
          <div className={cx(cs.chooseBtnContainer, 'adminUploader')}>
            <ImageUploadComponent
              defaultMessage={formatMessage(messages.clickHeretoUploadImage)}
              componentConfig={{
                iconFiletypes: ['.jpg', '.png'],
                multiple: false,
                showFiletypeIcon: false,
                postUrl: '/uploadLocation'
              }}
              loaderName={'locationUploaderLoading'}
              success={this.success}
            >
            </ImageUploadComponent>
          </div>
        </Col>
      </Row>
    );
  }
}

const mapState = (state) => ({
  locationUploaderLoading: state.loader.locationUploaderLoading,
});

const mapDispatch = {
  doRemoveLocation,
  startLocationUploaderLoader,
  endLocationUploaderLoader,
  doUploadLocation,
  change
};

export default compose(injectIntl, withStyles(s, cs), connect(mapState, mapDispatch))(Uploader);