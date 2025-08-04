import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

//Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Payout.css';

// Component
import PayoutList from './PayoutList';
import EmptyList from './PayoutList/EmptyList';
import Loader from '../Loader';

// Graphql
import getPayoutsQuery from './getPayoutsQuery.graphql';

// History
import history from '../../core/history';

class Payout extends Component {
    static propTypes = {
      PayoutData: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        getPayouts: PropTypes.array
      })
    };

    static defaultProps = {
      loading: true,
      data: []
    }

    constructor(props) {
      super(props);

      this.state = {
        initialLoad: true
      };
    }

    componentDidMount() {
      this.setState({
        initialLoad: false
      });
      
      // Call the API to check for payout details
      this.fetchPayoutDetails();
    }

    async fetchPayoutDetails() {
      const profileId = this.props.accountData?.profileId;
      if (!profileId) {
        return;
      }
      try {
        const res = await fetch(`/api/payout-megasoft-details/${profileId}`);
        const result = await res.json();
        if (result.success && result.data) {
          // If data is returned, redirect to addpayout page
          history.push('/user/addpayout');
        }
      } catch (error) {
        // Continue with normal flow if API call fails
        console.error('Error fetching payout details:', error);
      }
    }

    render() {
        const { data, loading, currentAccountId } = this.props;
        const { initialLoad } = this.state;
        if(loading && initialLoad){
          return <Loader type={"text"} />;
        } else {
            if(data != undefined && data.length > 0){
              return <PayoutList data={data} currentAccountId={currentAccountId} />;
            } else {
              return <EmptyList />;
            }
        }
    }
}

const mapState = (state) => ({
  data: state.payout.data,
  loading: state.payout.getPayoutLoading,
  accountData: state.account.data
});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(Payout));