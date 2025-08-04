import React, { Component } from "react";
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { compose, graphql, gql } from 'react-apollo';
import { change } from "redux-form";

import Loader from "../../../Loader/Loader";
import ImageUploadComponent from "../../ImageUploadComponent/ImageUploadComponent";

import { setLoaderComplete, setLoaderStart } from "../../../../actions/loader/loader";
import messages from '../../../../locale/messages';
import { photosShow } from "../../../../helpers/photosShow";
import { ogImageuploadDir } from "../../../../config";

import defaultPic from '/public/AdminIcons/default.svg';

import s from './OgImageUploader.css';
import bt from '../../../../components/commonStyle.css';

class OgImageUploder extends Component {
    static propTypes = {
        prop: PropTypes,
    }

    render() {
        const { loader, image } = this.props;
        const { formatMessage } = this.props.intl;
        let path = photosShow(ogImageuploadDir);

        return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.textAlignCenter, s.positionRelative)} >
                    <div className={bt.picContainerMain}>
                        <div className={cx(bt.picContainer, 'bgBlack')}>
                            <Loader show={loader} type={"page"}>
                                <div className={bt.profilePic}>
                                    {
                                        image && <div className={bt.bannerImageBg} style={{ backgroundImage: `url(${path}${image})` }} />
                                    }
                                    {
                                        !image && <div
                                            style={{ backgroundImage: `url(${defaultPic})` }}
                                            className={defaultPic && bt.profileImageBg}
                                        />
                                    }
                                </div>
                            </Loader>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop3)}>
                    <Col className={cx(bt.chooseBtnContainer, 'adminUploader')}>
                        <ImageUploadComponent
                            defaultMessage={formatMessage(messages.clickHeretoUploadImage)}
                            componentConfig={{
                                iconFiletypes: ['.jpg', '.png'],
                                multiple: false,
                                showFiletypeIcon: false,
                                postUrl: '/uploadOgImage'
                            }}
                            loaderName={'ogImage'}
                            imageName={'ogImage'}
                        />
                    </Col>
                </Col>
            </Row>
        )
    }
}

const mapState = (state) => ({
    loader: state?.loader?.ogImage
})

const mapDispatch = {
    change,
    setLoaderStart,
    setLoaderComplete
}

export default compose(
    injectIntl,
    withStyles(s, bt),
    connect(mapState, mapDispatch),
)(OgImageUploder);