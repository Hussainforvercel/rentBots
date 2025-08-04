import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import { Row, Col } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EmailLogoUploader.css';
import bt from '../../../../components/commonStyle.css';

// Redux
import { connect } from 'react-redux';
import { change } from 'redux-form'

// Translation
import { injectIntl } from 'react-intl';
import messages from '../../../../locale/messages';
import { doRemoveEmailLogo, doUploadEmailLogo, startEmailLogoUploaderLoader, stopEmailLogoUploaderLoader } from '../../../../actions/siteadmin/manageLogo';


// Asset
import ImageUploadComponent from '../../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../../CommonImageDisplay/CommomImageDisplay'
import { logouploadDir } from '../../../../config';
import { photosShow } from '../../../../helpers/photosShow';
class EmailLogoUploader extends React.Component {

  static propTypes = {
    emailLogoUploaderLoading: PropTypes.bool,
    doRemoveEmailLogo: PropTypes.any.isRequired,
    getLogoData: PropTypes.shape({
      loading: PropTypes.bool,
      getEmailLogo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    })
  };

  static defaultProps = {
    getLogoData: {
      loading: true
    },
    emailLogoUploaderLoading: false
  };

  success = async (file, fromServer) => {
    const { doUploadEmailLogo, getLogoData: { loading, getEmailLogo }, change, startEmailLogoUploaderLoader, stopEmailLogoUploaderLoader } = this.props;
    let fileName, oldPicture, filePath;
    fileName = fromServer?.file?.filename;
    oldPicture = getEmailLogo != null ? getEmailLogo.value : null;
    filePath = fromServer?.file?.path;
    startEmailLogoUploaderLoader();
    doUploadEmailLogo(fileName, filePath, oldPicture);
    await change('SiteSettingsForm', 'emailLogo', fileName);
    stopEmailLogoUploaderLoader();
  }

  render() {
    const { getLogoData: { loading, getEmailLogo }, doRemoveEmailLogo, emailLogoUploaderLoading } = this.props;
    const { formatMessage } = this.props.intl;
    let path = photosShow(logouploadDir);
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className={s.textAlignCenter}>
          <div className={bt.picContainerMain}>
            <div className={cx(bt.picContainer, 'bgBlack')}>
              <CommonImageDisplay
                loading={loading}
                image={getEmailLogo?.value && path + getEmailLogo?.value}
                isDefaultPic={getEmailLogo?.value ? false : true}
                loader={emailLogoUploaderLoading}
                isDelete={false}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop3)}>
          <div className={cx(bt.chooseBtnContainer, 'adminUploader')}>
            <ImageUploadComponent
              defaultMessage={formatMessage(messages.clickHeretoUploadLogo)}
              componentConfig={{
                iconFiletypes: ['.jpg', '.png', '.jpeg'],
                multiple: false,
                showFiletypeIcon: false,
                postUrl: '/uploadEmailLogo'
              }}
              loaderName={'emailLogoUploaderLoading'}
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
  emailLogoUploaderLoading: state?.loader?.emailLogoUploaderLoading
});

const mapDispatch = {
  doRemoveEmailLogo,
  doUploadEmailLogo,
  startEmailLogoUploaderLoader,
  stopEmailLogoUploaderLoader,
  change
};

export default compose(
  injectIntl,
  withStyles(s, bt),
  connect(mapState, mapDispatch),
  graphql(gql`
          query getEmailLogo{
            getEmailLogo {
            id
          title
          name
          value
          type
        }
      }
          `, {
    name: 'getLogoData',
    options: {
      ssr: false
    }
  }),
)(EmailLogoUploader);