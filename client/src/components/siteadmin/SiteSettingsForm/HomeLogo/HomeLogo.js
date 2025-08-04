import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomeLogo.css';
import cp from '../../../../components/commonStyle.css';

// Redux
import { connect } from 'react-redux';
import { doRemoveLogo, doUploadLogo, startLogoUploaderLoader, stopLogoUploaderLoader } from '../../../../actions/siteadmin/manageHomeLogo';

// Component
import Loader from '../../../Loader/Loader';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../locale/messages';

// Asset
import defaultPic from '/public/AdminIcons/default.svg';
import DeleteIcon from '/public/AdminIcons/dlt.png';
import ImageUploadComponent from '../../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../../CommonImageDisplay/CommomImageDisplay';
import { logouploadDir } from '../../../../config';
import { photosShow } from '../../../../helpers/photosShow';

class Uploader extends React.Component {

  static propTypes = {
    homeLogoUploaderLoading: PropTypes.bool,
    doRemoveLogo: PropTypes.any.isRequired,
    getHomeLogoData: PropTypes.shape({
      loading: PropTypes.bool,
      getHomeLogo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    })
  };

  static defaultProps = {
    profilePictureData: {
      loading: true
    },
    homeLogoUploaderLoading: false
  };

  success = async (file, fromServer) => {
    const { doUploadLogo, getHomeLogoData: { getHomeLogo }, startLogoUploaderLoader, stopLogoUploaderLoader } = this.props;
    let fileName = fromServer.file.filename,
      oldPicture = getHomeLogo ? getHomeLogo.value : null,
      filePath = fromServer.file.path;
    await startLogoUploaderLoader();
    await doUploadLogo(fileName, filePath, oldPicture);
    await stopLogoUploaderLoader();
  }

  deleteImage = async () => {
    const { doRemoveLogo, getHomeLogoData: { getHomeLogo } } = this.props;
    await doRemoveLogo(getHomeLogo?.value);
  }

  render() {
    const { getHomeLogoData: { loading, getHomeLogo }, doRemoveLogo, homeLogoUploaderLoading } = this.props;
    const { formatMessage } = this.props.intl;
    let path = photosShow(logouploadDir);

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={cp.picContainerMain}>
            <div className={cp.picContainer}>
              <CommonImageDisplay
                loading={loading}
                image={getHomeLogo?.value && path + getHomeLogo?.value}
                isDefaultPic={getHomeLogo?.value ? false : true}
                loader={homeLogoUploaderLoading}
                deleteImage={this.deleteImage}
                isDelete={true}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop3)}>
          <div className={cx(cp.chooseBtnContainer, 'adminUploader')}>
            <ImageUploadComponent
              defaultMessage={formatMessage(messages.clickHeretoUploadLogo)}
              componentConfig={{
                iconFiletypes: ['.jpg', '.png', '.jpeg'],
                multiple: false,
                showFiletypeIcon: false,
                postUrl: '/uploadHomeLogo'
              }}
              loaderName={'homeLogoUploaderLoading'}
              success={this.success}
            />
          </div>
        </Col>
      </Row >
    );
  }
}

const mapState = (state) => ({
  homeLogoUploaderLoading: state.loader.homeLogoUploaderLoading
});

const mapDispatch = {
  doRemoveLogo,
  doUploadLogo,
  startLogoUploaderLoader,
  stopLogoUploaderLoader
};

export default compose(
  injectIntl,
  withStyles(s, cp),
  connect(mapState, mapDispatch),
  graphql(gql`
          query getHomeLogo{
            getHomeLogo {
            id
          title
          name
          value
          type
        }
      }
          `, {
    name: 'getHomeLogoData',
    options: {
      ssr: false
    }
  }),
)(Uploader);