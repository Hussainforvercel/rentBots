import React, { Component } from 'react';
import { compose } from 'react-apollo';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { change } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

// component
import CommomImageDisplay from '../../../CommonImageDisplay/CommomImageDisplay';
import ImageUploadComponent from '../../../ImageUploadComponent/ImageUploadComponent';

// helpers
import { setLoaderStart, setLoaderComplete } from '../../../../../actions/loader/loader';
import messages from '../../../../../locale/messages';
import { photosShow } from '../../../../../helpers/photosShow';
import { homebanneruploadDir } from '../../../../../config';

// style
import s from './Image.css';
import cs from '../../../../../components/commonStyle.css';

class Image extends React.Component {

  static defaultProps = {
    loader: false
  };

  success = async (file, fromServer) => {
    const { change, setLoaderStart, setLoaderComplete, fieldName } = this.props;
    let fileName = fromServer.file.filename;
    await setLoaderStart(fieldName);
    await change('WhyHostForm', fieldName, fileName);
    await setLoaderComplete(fieldName);
  }

  render() {
    const { loader, image, fieldName } = this.props;
    const { formatMessage } = this.props.intl;
    let path = photosShow(homebanneruploadDir);

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className={s.textAlignCenter}>
          <div className={cs.picContainerMain}>
            <div className={cs.picContainer}>
              <CommomImageDisplay
                loader={loader}
                image={image && path + image}
                isDefaultPic={image ? false : true}
                isDelete={false}
              />
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
              loaderName={fieldName}
              success={this.success}
            >
            </ImageUploadComponent>
          </div>
        </Col>
      </Row>
    );
  }
}

const mapState = (state) => ({});

const mapDispatch = {
  setLoaderStart,
  setLoaderComplete,
  change
};

export default compose(
  withStyles(s, cs),
  injectIntl,
  connect(mapState, mapDispatch)
)(Image);