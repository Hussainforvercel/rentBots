import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { graphql, compose } from 'react-apollo';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import { connect } from 'react-redux';

import NavLink from '../NavLink';
import MenuItemLink from '../MenuItemLink';
import Logout from '../Logout';
import Message from '../Message';
import WishListModal from '../WishListModal';
import HeaderModal from '../HeaderModal';
import DropDownMenu from '../DropDownMenu/DropDownMenu';

import UserBanStatusQuery from './getUserBanStatus.graphql';
import CheckUserStatusQuery from './getCheckUserStatus.graphql';
import UserStatusQuery from './getUserStatus.graphql';
import messages from '../../locale/messages';
import { setUserLogout } from '../../actions/logout';
import { openHeaderModal } from '../../actions/modalActions';

import currencyIcon from '/public/SiteIcons/currencyIcon.svg';
import currencyIconTwo from '/public/SiteIcons/currencyIconTwo.svg';

import s from './NavigationAfterLogin.css';
class NavigationAfterLogin extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    setUserLogout: PropTypes.any,
    loginUserBanStatus: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getUserBanStatus: PropTypes.shape({
        userBanStatus: PropTypes.number,
      }),
    }),
  };
  static defaultProps = {
    loginUserBanStatus: {
      loading: true,
      getUserBanStatus: {
        userBanStatus: 0,
      },
    },
    userDeleteStatus: {
      userLoading: true,
      getUserStatus: {
        userStatus: null,
      },
    },
    checkLoginUserExist: {
      userExistloading: true,
      getCheckUserStatus: {
        userExistStatus: null,
      },
    }
  };
  render() {
    const { loginUserBanStatus: { loading, getUserBanStatus }, userDeleteStatus: { userLoading, getUserStatus } } = this.props;
    const { checkLoginUserExist: { userExistloading, getCheckUserStatus }, setUserLogout, wishListModal } = this.props;
    const { userData, openHeaderModal, becomeHeader } = this.props;
    const { toCurrency, baseCurrency, layoutType, homeHeaderOnly } = this.props;

    let isVerified;
    if (userData) {
      isVerified = userData.profileId;
    }
    if (!userExistloading && getCheckUserStatus) {
      if (getCheckUserStatus.userExistStatus) {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
          setUserLogout({ isAdmin: false });
        }
      }
    }
    if (!loading && getUserBanStatus) {
      if (getUserBanStatus.userBanStatus) {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
          setUserLogout({ isAdmin: false });
        }
      }
    }
    if (!userLoading && getUserStatus) {
      if (getUserStatus.userStatus) {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
          setUserLogout({ isAdmin: false });
        }
      }
    }

    return (
      <Nav pullRight className={cx(s.menuFlexContainer, 'normalHeader', 'normalHeaderRTL')}>
        <HeaderModal />
        <NavLink
          to="/"
          className={cx('visible-xs', s.breakPointScreen, s.newMenuDesign, s.noTopBorder, 'borderNoneMb')}
        >
          <FormattedMessage {...messages.home} />
        </NavLink>
        {!homeHeaderOnly && !becomeHeader &&
          <NavLink to="/become-a-owner?mode=new" className={cx(s.nonBreakPointScreen, 'hidden-xs', 'hidden-md', s.listCarCss, 'listCarCssRTL')}>
            <FormattedMessage {...messages.listyourCar} />
          </NavLink>
        }
        {
          layoutType != 2 &&
          <NavLink
            noLink
            onClick={(e) => openHeaderModal('languageModal')}
            className={cx('hidden-xs', 'hidden-md', s.nonBreakPointScreen)}
          >
            {homeHeaderOnly &&
              <img src={currencyIcon} />
            }
            {!homeHeaderOnly &&
              <img src={currencyIconTwo} />
            }
          </NavLink>
        }
        {
          layoutType && layoutType == 2 && <NavLink
            noLink
            onClick={(e) => openHeaderModal('languageModal')}
            className={cx('hidden-xs', 'hidden-md', s.nonBreakPointScreen)}
          >
            <img src={currencyIconTwo} />
          </NavLink>

        }
        <NavLink
          noLink
          onClick={(e) => openHeaderModal('languageModal')}
          className={cx(s.breakPointScreen, "hidden-lg")}
        >
          <FormattedMessage {...messages.languageCurrency} />
        </NavLink>
        <MenuItemLink to="/dashboard" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.dashboard} />
        </MenuItemLink>
        <MenuItemLink to="/cars" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.hosting} />
        </MenuItemLink>
        <NavLink to="/trips/current" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.traveling} />
        </NavLink>
        <NavLink to="/become-a-owner?mode=new" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.becomeAHost} />
        </NavLink>
        <Message className={cx(s.breakPointScreen)} />
        <MenuItemLink to="/user/payout" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.account} />
        </MenuItemLink>
        <MenuItemLink to="/user/edit" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.editProfile} />
        </MenuItemLink>
        <NavLink to="/wishlists" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.wishList} />
        </NavLink>
        <NavLink to="/help" className={cx('visible-xs', s.breakPointScreen)}>
          <FormattedMessage {...messages.help} />
        </NavLink>
        {homeHeaderOnly &&
          <div className={cx(s.centerMenu, s.tabViewHidden, 'hidden-xs', 'hidden-md', 'hidden-sm')}>
            <NavLink to="/#" className={cx(s.centerLink, s.dot, 'headerDotRTL', 'dotHeaderRTL', (layoutType == 2 ? 'centerLink2' : ''), (layoutType == 2 ? 'dot2' : ''))}>
              <FormattedMessage {...messages.placesToStay} />
            </NavLink>
            <NavLink to="/become-a-owner?mode=new" className={cx(s.centerLink, 'centerLinkRTL', (layoutType == 2 ? 'centerLink2' : ''))}>
              <FormattedMessage {...messages.becomeAHost} />
            </NavLink>
          </div>
        }
        <Logout className={cx('visible-xs', s.breakPointScreen)} />
        <NavDropdown
          className={cx('hidden-xs', s.nonBreakPointScreen)} eventKey={3} title={
            <DropDownMenu homeHeaderOnly={homeHeaderOnly} isVerified={isVerified} />
          } noCaret id="basic-nav-dropdown"
        >
          <MenuItemLink to="/dashboard">
            <FormattedMessage {...messages.dashboard} />
          </MenuItemLink>
          <MenuItemLink to="/cars">
            <FormattedMessage {...messages.hosting} />
          </MenuItemLink>
          <NavLink to="/trips/current" >
            <FormattedMessage {...messages.traveling} />
          </NavLink>
          <NavLink to="/become-a-owner?mode=new">
            <FormattedMessage {...messages.becomeAHost} />
          </NavLink>
          <Message />
          <div className={s.menuDivider}></div>
          <MenuItemLink to="/user/payout">
            <FormattedMessage {...messages.account} />
          </MenuItemLink>
          <MenuItemLink to="/user/edit">
            <FormattedMessage {...messages.editProfile} />
          </MenuItemLink>
          <NavLink to="/wishlists" >
            <FormattedMessage {...messages.wishList} />
          </NavLink>
          <NavLink
            to={'/user/edit'}
            className={cx('visible-xs', s.breakPointScreen)}
          >
            <FormattedMessage {...messages.profile} />
          </NavLink>
          <NavLink
            to="/user/payout"
            className={cx('visible-xs', s.breakPointScreen)}
          >
            <FormattedMessage {...messages.accountSettings} />
          </NavLink>
          <NavLink to="/cars" className={cx('visible-xs', s.breakPointScreen)}>
            <FormattedMessage {...messages.host} />
          </NavLink>
          <div className={s.menuDivider}></div>
          <NavLink to="/help">
            <FormattedMessage {...messages.help} />
          </NavLink>
          <Logout />
        </NavDropdown>
        {
          wishListModal && <WishListModal />
        }
      </Nav>
    );
  }
}
const mapState = state => ({
  wishListModal: state?.modalStatus?.wishListModalOpen,
  userData: state?.account?.data,
  baseCurrency: state?.currency?.base,
  toCurrency: state?.currency?.to,
  layoutType: state?.siteSettings?.data?.homePageType,
});
const mapDispatch = {
  setUserLogout,
  openHeaderModal
};
export default
  compose(
    injectIntl,
    withStyles(s),
    graphql(UserBanStatusQuery, {
      name: 'loginUserBanStatus',
      options: {
        ssr: false,
        pollInterval: 5000,
      },
    }),
    graphql(UserStatusQuery, {
      name: 'userDeleteStatus',
      options: {
        ssr: false,
        pollInterval: 5000,
      },
    }),
    graphql(CheckUserStatusQuery, {
      name: 'checkLoginUserExist',
      options: {
        ssr: false,
        pollInterval: 5000,
      },
    }),
    (connect(mapState, mapDispatch)))(NavigationAfterLogin);