import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import PayoutMegasoftManagement from '../../../components/siteadmin/PayoutMegasoftManagement/PayoutMegasoftManagement'

import s from "./ManagePayoutMegasoft.css";

class ManagePayoutMegasoft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchList: '',
            method: '',
            isAmountTransfer: '',
            startDate: '',
            endDate: '',
        };
        this.setStateVariable = this.setStateVariable.bind(this);
    }

    setStateVariable(variables) {
        this.setState(variables)
    }

    render() {
        const { currentPage, searchList, method, isAmountTransfer, startDate, endDate } = this.state;
        return <PayoutMegasoftManagement
            currentPage={currentPage}
            searchList={searchList}
            method={method}
            isAmountTransfer={isAmountTransfer}
            startDate={startDate}
            endDate={endDate}
            setStateVariable={this.setStateVariable} />
    }
}

ManagePayoutMegasoft.propTypes = {
    title: PropTypes.string.isRequired,
};

export default withStyles(s)(ManagePayoutMegasoft); 