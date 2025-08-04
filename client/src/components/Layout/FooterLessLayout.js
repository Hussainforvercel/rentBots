import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import Header from '../Header';
import FooterToggle from '../FooterToggle';
import CookiesDisclaimer from '../CookiesDisclaimer';

import s from './Layout.css';
class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { className, fixedHeader } = this.props;

    return (
      <div>
        <Header fixedHeader={fixedHeader} />
        {this.props.children}
        <div className={cx(className)}>
          <FooterToggle />
        </div>
        <CookiesDisclaimer />
      </div>
    );
  }
}

export default withStyles(s)(Layout);
