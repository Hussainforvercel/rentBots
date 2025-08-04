import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Button from 'react-bootstrap/lib/Button';

import minusIcon from '/public/SiteIcons/incrementPlus.svg';
import plusIcon from '/public/SiteIcons/incrementMinus-sign.svg';

import s from './IncrementButton.css';

class IncrementButton extends React.Component {
  static propTypes = {
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    labelSingluar: PropTypes.string,
    labelPlural: PropTypes.string,
    incrementBy: PropTypes.number,
    value: PropTypes.string,
    onChange: PropTypes.any
  };

  increment = (value, maxValue, incrementBy) => {
    if (value < maxValue) {
      return (Number(value) + Number(incrementBy));
    }
  }

  decrement = (value, minValue, incrementBy) => {
    if (value > minValue) {
      return (Number(value) - Number(incrementBy));
    }
  }

  render() {

    const { value, labelSingluar, labelPlural, minValue, maxValue, incrementBy, onChange } = this.props;

    let isDisableIncrement = value >= maxValue, isDisableDecrement = value <= minValue, label;

    if (value > 1) {
      label = labelPlural;
    } else {
      label = labelSingluar;
    }

    return (
      <div className={s.incrementDecrementButton}>
        <label className={cx(s.incrementDecrementText, 'floatRightRTL')}> {value} {label}</label>
        <Button className={cx(s.iconButton, 'floatRightRTL', 'iconButtonRTL')} onClick={() => onChange(this.decrement(value, minValue, incrementBy))} disabled={isDisableDecrement}>
          <img src={plusIcon} />
        </Button>
        <Button className={cx(s.iconButton, 'floatRightRTL', 'iconButtonRTL')} onClick={() => onChange(this.increment(value, maxValue, incrementBy))} disabled={isDisableIncrement}>
          <img src={minusIcon} />
        </Button>
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(IncrementButton));
