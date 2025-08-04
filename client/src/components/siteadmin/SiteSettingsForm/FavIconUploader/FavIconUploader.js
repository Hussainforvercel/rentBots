import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { graphql, gql, compose } from 'react-apollo';

// React Redux
import { connect } from 'react-redux';
import { setLoaderStart, setLoaderComplete } from '../../../../actions/loader/loader';

import { Row, Col } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './FavIconUploader.css';
import bt from '../../../../components/commonStyle.css';

// Locale
import messages from '../../../../locale/messages';
import { deleteFavIcon, updateFaviconLogo } from '../../../../actions/siteadmin/manageLogo';
import ImageUploadComponent from '../../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../../CommonImageDisplay/CommomImageDisplay';
import { photosShow } from '../../../../helpers/photosShow';
import { faviconUploadDir } from '../../../../config';

class FavIconUploader extends React.Component {

    static propTypes = {
        favIconLoader: PropTypes.bool,
        data: PropTypes.object
    };

    static defaultProps = {
        favIconLoader: false
    };

    success = async (file, fromServer) => {
        const { updateFaviconLogo, data: { getSiteSettingsLogo }, setLoaderStart, setLoaderComplete } = this.props;
        let fileName = fromServer.file.filename,
            oldPicture = getSiteSettingsLogo ? getSiteSettingsLogo.value : null;
        await setLoaderStart('favIconLoader');
        await updateFaviconLogo('Favicon Logo', 'faviconLogo', fileName, oldPicture);
        await setLoaderComplete('favIconLoader');
    }

    render() {
        const { favIconLoader, data: { loading, getSiteSettingsLogo = {} }, faviconLogo, deleteFavIcon } = this.props;
        const { formatMessage } = this.props.intl;
        let path = photosShow(faviconUploadDir);

        return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.textAlignCenter, s.positionRelative)}>
                    <div className={bt.picContainerMain}>
                        <div className={cx(bt.picContainer, 'bgBlack')}>
                            <CommonImageDisplay
                                loading={loading}
                                image={getSiteSettingsLogo?.value && path + getSiteSettingsLogo?.value}
                                isDefaultPic={getSiteSettingsLogo?.value ? false : true}
                                loader={favIconLoader}
                                isDelete={false}
                            />
                            <p className={cx(s.pngFontSize, 'pngFontSizeRTL')}><FormattedMessage {...messages.pngOnlyLabel} /></p>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop3)}>
                    <div className={cx(bt.chooseBtnContainer, 'adminUploader')}>
                        <ImageUploadComponent
                            defaultMessage={formatMessage(messages.clickHeretoUploadLogo)}
                            componentConfig={{
                                iconFiletypes: ['.png'],
                                multiple: false,
                                showFiletypeIcon: false,
                                postUrl: '/uploadFavIcon'
                            }}
                            loaderName={'favIconLoader'}
                            success={this.success}
                            getSiteSettingsLogo={getSiteSettingsLogo}
                        >
                        </ImageUploadComponent>
                    </div>
                </Col>
            </Row>
        );
    }
}

const mapState = (state) => ({
    favIconLoader: state.loader.favIconLoader
});

const mapDispatch = {
    deleteFavIcon,
    updateFaviconLogo,
    setLoaderStart,
    setLoaderComplete
};

export default compose(
    injectIntl,
    withStyles(s, bt),
    connect(mapState, mapDispatch),
    graphql(gql`
                    query getSiteSettingsLogo($title: String!, $name: String!) {
                        getSiteSettingsLogo(title:$title, name: $name) {
                        status
                errorMessage
                    title
                    name
                    value
            }
        }
                    `, {
        options: {
            ssr: true,
            variables: {
                title: 'Favicon Logo',
                name: 'faviconLogo'
            }
        }
    }),
)(FavIconUploader);