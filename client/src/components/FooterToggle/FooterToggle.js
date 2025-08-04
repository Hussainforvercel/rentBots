import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    Button,

} from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import ReactDrawer from 'react-drawer';

import Footer from '../Footer';

// Locale
import messages from '../../locale/messages';

//Image
import globalIcon from '/public/SiteIcons/footerGlobalIocn.svg';

import S from './FooterToggle.css';
import cs from '../commonStyle.css';
import s from '!isomorphic-style-loader/!css-loader!react-drawer/lib/react-drawer.css';

class FooterToggle extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
            position: 'bottom',
            noOverlay: true
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.onDrawerClose = this.onDrawerClose.bind(this);
        this.setNoOverlay = this.setNoOverlay.bind(this);
    }

    setNoOverlay(e) {
        this.setState({ noOverlay: e.target.checked });
    }
    toggleDrawer() {
        this.setState({ open: !this.state.open });
    }
    closeDrawer() {
        this.setState({ open: false });
    }
    onDrawerClose() {
        this.setState({ open: false });
    }
    render() {
        return (
            <div>
                <Button
                    onClick={this.toggleDrawer}
                    disabled={this.state.open && !this.state.noOverlay}
                    className={cx(S.buttonStyle, S.buttonPosition, 'buttonPositionRTL', cs.commonMediumText)}
                >
                    {!this.state.open ? <>
                        <img src={globalIcon} className={cx(S.iconStyle, 'iconStyleRTL')} />
                        <span className={S.footerIconText}><FormattedMessage {...messages.footerTerms} /></span>
                    </> :
                        <>
                            <span><MdClose className={cx(S.iconStyle, 'iconStyleRTL')} /></span>
                            <span className={S.footerIconText}><FormattedMessage {...messages.footerClose} /></span>
                        </>
                    }
                </Button>
                <ReactDrawer
                    open={this.state.open}
                    position={this.state.position}
                    onClose={this.onDrawerClose}
                    noOverlay={this.state.noOverlay}>
                    <Footer page={"search"} />
                </ReactDrawer>
            </div>
        );
    }
}
export default injectIntl(withStyles(s, S, cs)(FooterToggle));