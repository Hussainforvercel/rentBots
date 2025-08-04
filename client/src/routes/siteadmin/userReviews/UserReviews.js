import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import UserReviewsManagement from '../../../components/siteadmin/UserReviewsManagement/UserReviewsManagement';

import userReviewsQuery from './userReviewsQuery.graphql';

import s from './UserReviews.css';
class UserReviews extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        data: PropTypes.shape({
            loading: PropTypes.bool,
            getReviewsDetails: PropTypes.array,
        })
    };

    static defaultProps = {
        data: {
            loading: true
        }
    };

    render() {
        const { data: { loading }, title } = this.props;

        const { data: { getReviewsDetails, refetch } } = this.props;

        return (
            <UserReviewsManagement
                data={getReviewsDetails}
                title={title}
                refetch={refetch}
            />
        );
    }
}

export default compose(
    withStyles(s),
    graphql(userReviewsQuery,
        {
            options: (props) => ({
                variables: {
                    currentPage: 1,
                    searchList: ''
                },
                fetchPolicy: 'network-only',
            })
        }),
)(UserReviews);