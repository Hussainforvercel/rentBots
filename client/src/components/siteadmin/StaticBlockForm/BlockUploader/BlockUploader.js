import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import {
  Row,
  Col
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BlockUploader.css';
import cs from '../../../../components/commonStyle.css';
import { formValueSelector, change } from 'redux-form';

// Redux
import { connect } from 'react-redux';
import { doRemoveStaticImage, doUploadStaticImage, startStaticImageLoader, stopStaticImageLoader } from '../../../../actions/siteadmin/manageStaticBlock';

// Component
import Loader from '../../../Loader';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../locale/messages';
import { photosShow } from '../../../../helpers/photosShow';

// Asset
import defaultPic from '/public/AdminIcons/default.svg';
import DeleteIcon from '/public/AdminIcons/dlt.png';
import ImageUploadComponent from '../../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../../CommonImageDisplay/CommomImageDisplay';
import { homebanneruploadDir } from '../../../../config';

class BlockUploader extends React.Component {

  static propTypes = {
    staticImageLoading: PropTypes.bool,
    doRemoveStaticImage: PropTypes.any.isRequired,
    getLogoData: PropTypes.shape({
      loading: PropTypes.bool,
      getLogo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    })
  };

  static defaultProps = {
    profilePictureData: {
      loading: true
    },
    staticImageLoading: false
  };

  success = async (file, fromServer) => {
    const { doUploadStaticImage, getLogoData: { loading, getStaticInfo }, change, stopStaticImageLoader, startStaticImageLoader } = this.props;
    let fileName = fromServer.file.filename;
    let oldPicture = getStaticInfo != null ? getStaticInfo[0].value : null;
    let filePath = fromServer.file.path;
    startStaticImageLoader();
    doUploadStaticImage(fileName, filePath, oldPicture, 'carTripImage1');
    await change('StaticBlockForm', 'carTripImage1', fileName);
    stopStaticImageLoader();
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(e) {
    const { change } = this.props;
    await change('StaticBlockForm', 'carTripImage1', null);
  }

  deleteImage = async () => {
    const { doRemoveStaticImage, getLogoData: { getStaticInfo } } = this.props;
    await doRemoveStaticImage(getStaticInfo && getStaticInfo[0].image, 'carTripImage1');
  }

  render() {
    const { getLogoData: { loading, getStaticInfo }, image, doRemoveStaticImage, staticImageLoading } = this.props;
    const { formatMessage } = this.props.intl;
    let path = photosShow(homebanneruploadDir);

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={cs.picContainerMain}>
            <div className={cs.picContainer}>
              <div className={cs.profilePic}>
                <CommonImageDisplay
                  loading={loading}
                  loader={staticImageLoading}
                  image={getStaticInfo && getStaticInfo[0]?.value && path + getStaticInfo[0].value}
                  deleteImage={this.deleteImage}
                  isDefaultPic={getStaticInfo && getStaticInfo[0]?.value ? false : true}
                  isDelete={true}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2, s.spaceTop3)}>
          <div className={cx(cs.chooseBtnContainer, 'adminUploader')}>
            <ImageUploadComponent
              defaultMessage={formatMessage(messages.clickHeretoUploadImage)}
              componentConfig={{
                iconFiletypes: ['.jpg', '.png', '.jpeg'],
                multiple: false,
                showFiletypeIcon: false,
                postUrl: '/uploadHomeBanner'
              }}
              loaderName={'staticImageLoading'}
              success={this.success}
            >
            </ImageUploadComponent>
          </div>
        </Col>
      </Row>
    );
  }
}
const selector = formValueSelector('StaticBlockForm');

const mapState = (state) => ({
  staticImageLoading: state.loader.staticImageLoading,
  // image: selector(state, 'blockImage1')
});

const mapDispatch = {
  doRemoveStaticImage,
  doUploadStaticImage,
  startStaticImageLoader,
  stopStaticImageLoader,
  change
};

export default compose(
  injectIntl,
  withStyles(s, cs),
  connect(mapState, mapDispatch),
  graphql(gql`
  query ($name: String) {
    getStaticInfo(name: $name) {
      name
      value
    }
  }
    `, {
    name: 'getLogoData',
    options: {
      ssr: false,
      variables: {
        name: 'carTripImage1'
      },
    }
  }),
)(BlockUploader);