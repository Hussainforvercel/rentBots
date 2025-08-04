import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { DateRangePicker, isInclusivelyAfterDay } from 'react-dates';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

// Redux  Action
import { onChangeListingFilter } from '../../../actions/Listing/onChangeListing';

// Locale
import messages from '../../../locale/messages';
import { isRTL } from '../../../helpers/formatLocale';
import { dateFormat } from '../../../helpers/dayDifferenceHelper';

class DateRange extends React.Component {
  static propTypes = {
    onChange: PropTypes.any,
    numberOfMonths: PropTypes.number,
    formatMessage: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null
    };
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { startDate, endDate } = this.props;
    this.setState({
      startDate: startDate ? moment(startDate) : null,
      endDate: endDate ? moment(endDate) : null,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { startDate, endDate } = nextProps;
    this.setState({
      startDate: startDate ? moment(startDate) : null,
      endDate: endDate ? moment(endDate) : null,
    });

  }

  async onDatesChange({ startDate, endDate }) {
    const { onChangeListingFilter, listId, orderBy } = this.props;
    this.setState({ startDate, endDate });
    if (startDate && endDate) {
      onChangeListingFilter({ orderBy, startDate: await dateFormat(startDate), endDate: await dateFormat(endDate), listId });
    }
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    const { smallDevice, type } = this.props;
    const { formatMessage } = this.props.intl;
    const { locale } = this.props;
    const isOutsideRange = (day) => {
      if (type == 'current') return !isInclusivelyAfterDay(day, moment());
    }

    return (
      <div>
        <DateRangePicker
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          numberOfMonths={smallDevice ? 1 : 2}
          startDatePlaceholderText={formatMessage(messages.startDate)}
          endDatePlaceholderText={formatMessage(messages.endDate)}
          hideKeyboardShortcutsPanel
          readOnly
          minimumNights={0}
          anchorDirection={isRTL(locale) ? 'right' : 'left'}
          isRTL={isRTL(locale)}
          isOutsideRange={isOutsideRange}
        />
      </div>
    );
  }
}

const mapState = state => ({
  locale: state.intl.locale,
  listId: state.onChangeListing?.listId,
  orderBy: state.onChangeListing?.orderBy,
});

const mapDispatch = {
  onChangeListingFilter
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DateRange)));

