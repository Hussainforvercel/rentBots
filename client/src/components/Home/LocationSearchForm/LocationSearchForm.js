
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FaSearch } from 'react-icons/fa';
import { reduxForm } from 'redux-form';
import Button from 'react-bootstrap/lib/Button';
import cx from 'classnames';

import PlaceGeoSuggest from '../PlaceGeoSuggest';

import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';
import messages from '../../../locale/messages';
import history from '../../../core/history';
import { setPersonalizedValues } from '../../../actions/personalized';

import streeingIcon from '/public/SiteIcons/streeingFormIcon.svg';

import s from './LocationSearchForm.css';
import cs from '../../../components/commonStyle.css';
import { googleMapLoader } from '../../../helpers/googleMapLoader';

class LocationSearchForm extends React.Component {
  static propTypes = {
    setPersonalizedValues: PropTypes.any.isRequired,
    getSpecificSettings: PropTypes.any.isRequired,
    personalized: PropTypes.shape({
      location: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
      chosen: PropTypes.number,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      personCapacity: PropTypes.number,
      formatMessage: PropTypes.any,
    }),
    settingsData: PropTypes.shape({
      listSettings: PropTypes.array.isRequired
    }).isRequired
  };

  static defaultProps = {
    listingFields: []
  };


  static defaultProps = {
    personalized: {
      location: null,
      lat: null,
      lng: null,
      startDate: null,
      endDate: null,
      personCapacity: null,
      chosen: null
    },
    settingsData: {
      listSettings: []
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      mobileDevice: false,
      personCapacity: [],
      googleMapsApiLoaded: false
    }
  }

  async componentDidMount() {
    const autocompleteService = await googleMapLoader('places');
    this.setState({ googleMapsApiLoaded: true });
    this.autocompleteService = autocompleteService;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { listingFields } = nextProps;
    if (listingFields != undefined) {
      this.setState({
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity
      });
    }
  }

  UNSAFE_componentWillMount() {
    const { listingFields } = this.props;
    if (detectMobileBrowsers.isMobile() === true) {
      this.setState({ mobileDevice: true });
    }
    if (listingFields != undefined) {
      this.setState({
        roomType: listingFields?.roomType,
        personCapacity: listingFields?.personCapacity
      });
    }
  }

  handleClick = () => {
    const { personalized, setPersonalizedValues } = this.props;
    let updatedURI, uri = '/s?';
    if (personalized?.chosen != null) {
      uri = uri + '&address=' + personalized?.location + '&chosen=' + personalized?.chosen;
    } else {
      if (personalized?.location != null) {
        uri = uri + '&address=' + personalized?.location;
      }
    }
    updatedURI = encodeURI(uri);
    history.push(updatedURI);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { googleMapsApiLoaded } = this.state;

    return (
      <div className={cx(s.locationGrid, 'homeLocationSearchForm')}>
        <div className={s.locationFlex}>
          <div className={s.iconWidth}>
            <img src={streeingIcon} />
          </div>
          <div className={s.inputWidth}>
            {
              googleMapsApiLoaded ?
                <PlaceGeoSuggest
                  label={formatMessage(messages.homeWhere)}
                  className={cx(s.formControlInput, s.input)}
                  containerClassName={s.geoSuggestContainer}
                />
                :
                <></>
            }
          </div>
        </div>
        <div className={s.btnWidth}>
          <Button className={cx(cs.btnPrimary, s.btnBlock, s.btnLarge)} onClick={this.handleClick}>
            <FaSearch className={cx('textWhite', 'imgIconRight', 'imgIconRightMb')} width={18} height={18} />
            <span className={'hidden-xs'}><FormattedMessage {...messages.search} /></span>
          </Button>
        </div>

      </div>
    );
  }
}

LocationSearchForm = reduxForm({
  form: 'SearchForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(LocationSearchForm);

const mapState = (state) => ({
  personalized: state?.personalized,
  settingsData: state?.viewListing?.settingsData,
  listingFields: state?.listingFields?.data,
});

const mapDispatch = {
  setPersonalizedValues
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(LocationSearchForm)));