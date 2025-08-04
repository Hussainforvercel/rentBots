import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FaCircle } from 'react-icons/fa';

import NavLink from '../NavLink';

import messages from '../../locale/messages';
import UnreadThreadsQuery from './getUnreadThreads.graphql';

import s from './Message.css';

class Message extends Component {
  static propTypes = {
    allUnreadThreadsCount: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getUnreadCount: PropTypes.shape({
        total: PropTypes.number.isRequired,
      }),
    }),
  };

  static defaultProps = {
    allUnreadThreadsCount: {
      loading: true,
      getUnreadCount: {
        total: 0,
      },
    },
  };

  render() {
    const { allUnreadThreadsCount: { loading, getUnreadCount }, className } = this.props;
    let count = 0;
    if (!loading && getUnreadCount != null) {
      count = getUnreadCount?.total != null ? getUnreadCount?.total : 0;
    }
    const isNewMessage = count > 0;

    return (
      <NavLink to="/inbox" className={className}>
        <span><FormattedMessage {...messages.messages} /></span>
        {
          isNewMessage && <FaCircle className={s.notification} />
        }
      </NavLink>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(s),
  graphql(UnreadThreadsQuery, {
    name: 'allUnreadThreadsCount',
    options: {
      ssr: false,
      pollInterval: 5000,
      fetchPolicy: 'network-only',
    },
  }),
)(Message);
