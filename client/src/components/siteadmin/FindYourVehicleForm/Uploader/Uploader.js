import React, { Component } from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Uploader.css';
import cs from '../../../../components/commonStyle.css';
import { formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import messages from '../../../../locale/messages';
import { photosShow } from '../../../../helpers/photosShow';

import { getImageLoader } from '../../../../actions/siteadmin/ImageLoader/imageLoader';
import { IMAGE_LOADER1_START, IMAGE_LOADER1_SUCCESS } from '../../../../constants/index';

// Asset
import defaultPic from '/public/AdminIcons/default.svg';
import ImageUploadComponent from '../../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../../CommonImageDisplay/CommomImageDisplay'
import { homebanneruploadDir } from '../../../../config';

class Uploader extends React.Component {
  static defaultProps = {
    loader: false
  };

  success = async (file, fromServer) => {
    const { change, getImageLoader } = this.props;
    let fileName = fromServer.file.filename;
    await getImageLoader(IMAGE_LOADER1_START, true);
    await change('FindYourVehicleForm', 'image', fileName);
    await getImageLoader(IMAGE_LOADER1_SUCCESS, false)
  }

  render() {
    const { image, loader } = this.props;
    const { formatMessage } = this.props.intl;
    let path = photosShow(homebanneruploadDir);

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className={s.textAlignCenter}>
          <div className={cs.picContainerMain}>
            <div className={cs.picContainer}>
              <CommonImageDisplay
                loader={loader}
                image={image && path + image}
                isDefaultPic={image ? false : true}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2, s.spaceTop3)}>
          <div className={cx(cs.chooseBtnContainer, 'adminUploader')}>
            <ImageUploadComponent
              defaultMessage={formatMessage(messages.clickHeretoUploadImage)}
              componentConfig={{
                iconFiletypes: ['.jpg', '.png'],
                multiple: false,
                showFiletypeIcon: false,
                postUrl: '/uploadHomeBanner'
              }}
              loaderName={'loader'}
              success={this.success}
            >
            </ImageUploadComponent>
          </div>
        </Col>
      </Row>
    );
  }
}
const selector = formValueSelector('FindYourVehicleForm');

const mapState = (state) => ({
  loader: state.loader.loader,
  image: selector(state, 'image')
});

const mapDispatch = {
  change,
  getImageLoader
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(Uploader)));