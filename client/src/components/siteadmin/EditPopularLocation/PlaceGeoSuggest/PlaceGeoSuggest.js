import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Geosuggest from '@ubilabs/react-geosuggest';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { setPersonalizedValues } from '../../../../actions/personalized';
import { googleMapLoader } from '../../../../helpers/googleMapLoader';

import s from '!isomorphic-style-loader/!css-loader!@ubilabs/react-geosuggest/module/geosuggest.css';

class PlaceGeoSuggest extends Component {

    static propTypes = {
        label: PropTypes.string,
        className: PropTypes.string,
        containerClassName: PropTypes.string,
        setPersonalizedValues: PropTypes.func,
        googleMaps: PropTypes.object,
        personalized: PropTypes.shape({
            locationAddress: PropTypes.string,
            lat: PropTypes.number,
            lng: PropTypes.number,
            geography: PropTypes.string
        })
    };

    static defaultProps = {
        formName: 'EditPopularLocation',
        personalized: {
            locationAddress: null
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            googleMapsApiLoaded: false
        }
    }

    async componentDidMount() {
        const autocompleteService = await googleMapLoader('places');
        this.setState({
            googleMapsApiLoaded: true
        });
        this.autocompleteService = autocompleteService;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    onSuggestSelect = (data) => {
        const { onChange } = this.props;
        if (data) {
            onChange(data.label);
        }
    }

    onTextChange = (value) => {
        const { onChange } = this.props;
        if (value !== undefined && value.trim() === '') {
            onChange(value);
        }
    }

    render() {
        const { value, onChange, label, className, formName } = this.props;
        const { containerClassName, personalized } = this.props;
        const { googleMapsApiLoaded } = this.state;
        return (
            <div className={'popularLocationAutoComplete'}>
                {
                    googleMapsApiLoaded ?
                        <Geosuggest
                            ref={el => this._geoSuggest = el}
                            placeholder={''}
                            inputClassName={className}
                            className={containerClassName}
                            initialValue={value}
                            onChange={this.onTextChange}
                            onSuggestSelect={this.onSuggestSelect}
                        />
                        :
                        <></>
                }
            </div>
        )
    }
}

const mapState = (state) => ({
    personalized: state?.personalized
});

const mapDispatch = {
    setPersonalizedValues
};

export default withStyles(s)(connect(mapState, mapDispatch)(PlaceGeoSuggest));