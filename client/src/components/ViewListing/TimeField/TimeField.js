//Components.
import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import cx from 'classnames';
import moment from 'moment';

//Action and helpers.
import { checkAvailability } from '../../../actions/checkAvailability';

// Helper function to check if a time is reserved
function isTimeReserved(selectedDate, time, reservedSlots = []) {
    if (!selectedDate) return false;
    return reservedSlots.some(slot => {
        // Check if the slot is for the same date
        const slotDate = moment(slot.checkIn).format('YYYY-MM-DD');
        const date = moment(selectedDate).format('YYYY-MM-DD');
        
        if (date === slotDate) {
            // For hourly bookings, only block the specific time slots
            if (slot.isHourly) {
                return time >= slot.startTime && time < slot.endTime;
            }
            // For daily bookings, block all time slots
            return true;
        }
        return false;
    });
}

class TimeField extends React.Component {
    static propTypes = {
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        checkAvailability: PropTypes.func.isRequired,
        listId: PropTypes.number.isRequired,
        formName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        reservedSlots: PropTypes.array,
    };

    static defaultProps = {
        reservedSlots: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            inputValue: props.value
        };
        this.handleChange = this.handleChange.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        this.state = {
            inputValue: value
        };
    }

    async handleChange(event) {
        let value = event.target.value;
        const { name, formName, maximumNights, minimumNights } = this.props;
        const { listId, checkAvailability, change } = this.props;
        const { startDate, endDate, startTime, endTime } = this.props;

        this.setState({
            inputValue: value
        })
        await change(formName, name, value);
        if (name === "endTime" && startDate) {
            checkAvailability(listId, startDate, endDate, maximumNights, startTime, value, minimumNights);
        } else if (name === "startTime" && startDate) {
            if (startDate && endDate && endTime) {
                checkAvailability(listId, startDate, endDate, maximumNights, value, endTime, minimumNights);
            }
        }
    }

    render() {
        const { name, className, TimeLookup, classNameParent, label, reservedSlots, startDate } = this.props;
        return (
            <div className={cx('inputFocusColor', classNameParent)}>
                <FormControl
                    name={name}
                    componentClass="select"
                    className={className}
                    onChange={this.handleChange}
                    value={this.state.inputValue}
                >
                    <option value="">{label}</option>
                    {
                        TimeLookup && TimeLookup.length > 0 && TimeLookup.map((item, key) => {
                            const disabled = isTimeReserved(startDate, item.value, reservedSlots);
                            return (
                                <option key={key} value={item.value} disabled={disabled}>
                                    {item.label}
                                </option>
                            );
                        })
                    }
                </FormControl>
            </div>
        );
    }
}

const mapState = state => ({
    isLoading: state.viewListing.isLoading,
    availability: state.viewListing.availability,
});

const mapDispatch = {
    checkAvailability,
    change,
};

export default connect(mapState, mapDispatch)(TimeField);
