import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import AdminDashboard from '../../../components/siteadmin/AdminDashboard';
import Loader from '../../../components/Loader';

import UserDashboard from './UserDashboard.graphql';
import ListingDashboard from './ListingDashboard.graphql';
import ReservationDashboard from './ReservationDashboard.graphql';
import GetAdminUser from './GetAdminUser.graphql'
import { setUserLogout } from '../../../actions/logout'

class Dashboard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        getUserData: PropTypes.object,
        ListingDashboard: PropTypes.object,
    };

    componentDidMount() {
        const { getAdminUser, setUserLogout } = this.props
        if (getAdminUser.getAdminUser === null) {
            setUserLogout({ isAdmin: false })
        }
    }

    render() {
        const { getUserData, getListingData, getReservationData, title, getAdminUser } = this.props;

        if (getUserData.loading || getListingData.loading || getReservationData.loading) {
            return <Loader type={"text"} />;
        } else if (getAdminUser.getAdminUser === null) {
            return (
                <div>
                    <Loader type={"text"} />
                </div>
            )
        }

        return <AdminDashboard title={title} user={getUserData} listing={getListingData} reservation={getReservationData} />;
    }
}
const mapState = state => ({})

const mapDispatch = {
    setUserLogout
}
export default compose(
    graphql(UserDashboard,
        {
            name: 'getUserData',
            options: (props) => ({
                fetchPolicy: 'network-only'
            })
        }
    ),
    graphql(ListingDashboard,
        {
            name: 'getListingData',
            options: (props) => ({
                fetchPolicy: 'network-only'
            })
        }
    ),
    graphql(ReservationDashboard,
        {
            name: 'getReservationData',
            options: (props) => ({
                fetchPolicy: 'network-only'
            })
        }
    ),
    graphql(GetAdminUser,
        {
            name: 'getAdminUser',
            options: (props) => ({
                fetchPolicy: 'network-only'
            })
        }
    ),
    (connect(mapState, mapDispatch))
)(Dashboard);