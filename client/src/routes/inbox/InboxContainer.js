import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Inbox from '../../components/Inbox';
import AllThreadsQuery from './AllThreadsQuery.graphql';

import s from './Inbox.css';
class InboxContainer extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    allThreads: PropTypes.object
  };

  render() {
    const { allThreads } = this.props;
    return (

      <>
        <Inbox allThreads={allThreads} />
      </>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(AllThreadsQuery, {
    name: 'allThreads',
    options: {
      variables: {
        currentPage: 1
      },
      ssr: false,
      fetchPolicy: 'network-only'
    }
  }),
)(InboxContainer);
