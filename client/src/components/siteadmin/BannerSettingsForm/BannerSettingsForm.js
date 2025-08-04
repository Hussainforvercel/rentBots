import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { graphql, gql, compose } from 'react-apollo';
import { connect } from 'react-redux';

// Style
import cx from 'classnames';
import {
  Button,
  Row,
  FormGroup,
  Col,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { injectIntl, FormattedMessage } from 'react-intl';


import CommonFormComponent from '../../CommonField/CommonFormComponent';
import ImageUploadComponent from '../ImageUploadComponent/ImageUploadComponent';
import CommomImageDisplay from '../CommonImageDisplay/CommomImageDisplay';

import submit from './submit';
import validate from './validate';
import messages from '../../../locale/messages';
import { photosShow } from '../../../helpers/photosShow';
import { startBannerUploaderLoader, stopBannerUploaderLoader, doUploadHomeBanner } from '../../../actions/siteadmin/manageHomepageBanner';
import { homebanneruploadDir } from '../../../config';

import PictureImage from '/public/AdminIcons/default.svg'

import s from './BannerSettingsForm.css';
import cp from '../../../components/commonStyle.css';


class BannerSettingsForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    title: PropTypes.string.isRequired,
    startBannerUploaderLoader: PropTypes.any.isRequired,
    doUploadImageBanner: PropTypes.any.isRequired
  };

  success = async (file, fromServer) => {
    const { doUploadHomeBanner, image, id, startBannerUploaderLoader, stopBannerUploaderLoader } = this.props;
    let fileName = fromServer.file.filename;
    let oldImage = image || null;
    startBannerUploaderLoader();
    doUploadHomeBanner(fileName, oldImage, id);
    stopBannerUploaderLoader();
  }

  render() {

    const { error, handleSubmit, submitting, dispatch, initialValues, title, bannerUploaderLoading, image, id } = this.props;
    const { formatMessage } = this.props.intl;
    let path = photosShow(homebanneruploadDir);

    return (
      <div className='listPhotoContainer'>
        <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL', 'adminPhotoUplod', 'dzInputContainer')}>
          <div className={cx(cp.adminContentPadding)}>
            <div className={s.sectionCenter}>
              <div className={cp.commonAdminBorderSection}>
                <h1 className={s.headerTitle}><FormattedMessage {...messages.bannerCaptionLabel} /></h1>
                <form onSubmit={handleSubmit(submit)}>
                  {error && <strong>{formatMessage(error)}</strong>}
                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew} ><FormattedMessage {...messages.homeBannerImage} /></label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} className={cp.textAlignCenter}>
                        <div className={'uploadDropZoneSection'}>
                          <ImageUploadComponent
                            defaultMessage={formatMessage(messages.photosPlaceholder)}
                            componentConfig={{
                              iconFiletypes: ['.jpg', '.png', '.jpeg'],
                              multiple: false,
                              showFiletypeIcon: false,
                              postUrl: '/uploadHomeBanner'
                            }}
                            loaderName={'bannerUploaderLoading'}
                            success={this.success}
                          >
                          </ImageUploadComponent>
                          <img src={PictureImage} alt={'PictureImage'} className={'uploadDropZoneSectionImage'} />
                        </div>
                        {
                          image != null &&
                          <CommomImageDisplay
                            loader={bannerUploaderLoading}
                            image={image && path + image}
                          />
                        }
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew} ><FormattedMessage {...messages.titleAdminLabel} /></label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Field name="title" type="text" inputClass={cx(cp.formControlInput)} component={CommonFormComponent} label={formatMessage(messages.bannerPlaceholder)} />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} >
                        <label className={cp.labelTextNew} ><FormattedMessage {...messages.contentLabel} /></label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Field name="content" component={CommonFormComponent} componentClass={'textarea'} label={formatMessage(messages.bannerPlaceholderContent)} />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup className={s.noMargin}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} className={cx(cp.textAlignRight, 'textAlignLeftRTL')}>
                        <Button className={cx(cp.btnPrimary, cp.btnlarge)} type="submit" disabled={submitting} >
                          <FormattedMessage {...messages.save} />
                        </Button>
                      </Col>
                    </Row>
                  </FormGroup>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

BannerSettingsForm = reduxForm({
  form: 'BannerSettingsForm', // a unique name for this form
  validate
})(BannerSettingsForm);

const mapState = (state) => ({
  bannerUploaderLoading: state.loader.bannerUploaderLoading
});

const mapDispatch = {
  doUploadHomeBanner,
  startBannerUploaderLoader,
  stopBannerUploaderLoader
};

export default compose(
  injectIntl,
  withStyles(s, cp),
  connect(mapState, mapDispatch)
)(BannerSettingsForm);