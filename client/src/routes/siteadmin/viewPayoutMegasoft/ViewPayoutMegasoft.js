import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ViewPayoutMegasoftContainer from '../../../components/siteadmin/ViewPayoutMegasoft/ViewPayoutMegasoft';
import s from './ViewPayoutMegasoft.css';

class ViewPayoutMegasoft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
        };
    }

    render() {
        const { id } = this.props;
        return <ViewPayoutMegasoftContainer id={id} />;
    }
}

ViewPayoutMegasoft.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
};

export default withStyles(s)(ViewPayoutMegasoft); 