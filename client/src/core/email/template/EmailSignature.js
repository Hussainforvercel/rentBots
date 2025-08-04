import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EmailSignature extends Component {
    static propTypes = {
        siteName: PropTypes.string.isRequired,
    }
    render() {
        const { siteName } = this.props;
        return (
            <div>
                Thanks, <br />
                The {siteName} Team
            </div>
        )
    }
}

export default EmailSignature;