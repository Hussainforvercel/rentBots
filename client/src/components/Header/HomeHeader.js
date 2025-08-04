import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';

import Navigation from '../Navigation';
import Logo from '../Logo';
import Toaster from '../Toaster';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import LoadingBar from 'react-redux-loading-bar';

import history from '../../core/history';
import { toggleOpen, toggleClose } from '../../actions/Menu/toggleControl';

import s from './Header.css';

class HomeHeader extends React.Component {
  static propTypes = {
    borderLess: PropTypes.bool,
    showMenu: PropTypes.bool,
    toggleOpen: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
  };

  static defaultProps = {
    borderLess: false,
    showMenu: false,
    searchDisablePages: [
      '/',
      '/home'
    ]
  }

  constructor(props) {
    super(props);
    this.state = {
      searchHide: true,
      load: false,
      isOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      load: true
    });
    this.handleDisableSearchPages();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.handleDisableSearchPages();
  }

  handleMenu = () => {
    const { showMenu, toggleOpen, toggleClose } = this.props;
    if (showMenu) {
      toggleClose();
    } else {
      toggleOpen();
    }
  }

  handleDisableSearchPages = () => {
    const { searchDisablePages } = this.props;
    let location = history.location ? history.location.pathname : null;
    let searchHide = false;
    if (location && searchDisablePages.length > 0) {
      searchHide = searchDisablePages.find((o) => location === o);
      searchHide = (searchHide) ? true : false;
    }

    this.setState({
      searchHide
    })
  }
  openMenu = async () => {
    this.setState({
      isOpen: true,
    })
    document.body.classList.add('headerModalOpen');
  }

  openClose = async () => {
    this.setState({
      isOpen: false,
    })
    document.body.classList.remove('headerModalOpen');
  }

  render() {
    const { borderLess, showMenu, layoutType } = this.props;
    const { load } = this.state;

    let borderClass, headerDesignClass, location;

    if (borderLess) {
      borderClass = s.rentAllHeaderBorderLess;
    }

    if (layoutType && (layoutType == 1 || layoutType == 3 || layoutType == 4)) {
      headerDesignClass = 'headerNewDesign';
    }

    if (history.location) {
      location = history.location.pathname;
    }

    return (
      <div className={headerDesignClass}>
        <div className={s.root}>
          <Toaster />
          <LoadingBar />
          <Navbar className={cx(s.rentAllHeader, 'rentAllHeader', borderClass, s.headerFlexContainer, { [s.fixedHeader]: location === '/s' }, { ['homeHeader']: location === '/' || location === '/home' })}
            expanded={showMenu} onToggle={this.handleMenu}>
            <div className={cx(s.container, s.headerFlexBox)}>
              <Navbar.Header className={cx('logoPadding', !showMenu ? 'normalPosition' : 'fixedPosition')}>
                <Navbar.Brand className={cx(s.homeLogo, 'navBrandRTL')}>
                  <Logo link={"/"} className={cx(s.brand, s.brandImg)} load={load} />
                </Navbar.Brand>
              </Navbar.Header>
              <div onClick={() => this.openMenu()}>
                <div className={'closebtnHidden'}>
                  <DropDownMenu homeHeaderOnly={true} />
                </div>
              </div>
              <div className={cx(`${(this.state.isOpen === true) ? s.menuOpen : s.menuClose}`, s.mobileMenu)}>
                <div className={cx(s.rightMenuClose, 'closebtnHidden')}>
                  <div className={s.closeButtonPosition}>
                    <div className={cx(s.closeColor, s.cPointer, 'closeColorRTL')} onClick={() => this.openClose()} >
                      ×
                    </div>
                  </div>
                </div>
                <div onClick={() => this.openClose()}>
                  <Navigation openClose={this.state.isOpen} homeHeaderOnly={true} />
                </div>
              </div>
            </div>
          </Navbar>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  siteSettings: state?.siteSettings?.data,
  layoutType: state?.siteSettings?.data?.homePageType,
  showMenu: state?.toggle?.showMenu
});

const mapDispatch = {
  toggleOpen,
  toggleClose
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(HomeHeader)));