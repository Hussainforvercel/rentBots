
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import cx from 'classnames';
import { reduxForm, formValueSelector, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';

import CheckboxListItems from './CheckboxListItems';
import HomeType from './HomeType/HomeType';
import Price from './Price';
import InstantBook from './InstantBook';
import VehicleMakes from './VehicleMakes';
import Transmission from './Transmission';

import messages from '../../../../locale/messages';
import submit from '../../SearchForm/submit';
import { closeMoreFiltersModal, openMoreFiltersModal } from '../../../../actions/modalActions';

import s from './MoreFilters.css';

class MoreFilters extends Component {

  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
    isExpand: PropTypes.bool,
    filtersModal: PropTypes.bool
  };

  static defaultProps = {
    isExpand: false,
    fieldsSettingsData: {
      roomType: [],
      carFeatures: [],
      spaces: [],
      carRules: [],
      make: []
    },
    homeType: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { isExpand } = this.props;
    document.addEventListener('mousedown', this.handleClickOutside);
    if (isExpand) {
      document.querySelector('body').setAttribute('style', 'overflow: hidden');
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.querySelector('body').removeAttribute('style');
  }

  handleSubmit = async () => {
    const { handleSubmit, closeMoreFiltersModal } = this.props;
    const { change } = this.props;
    await change('currentPage', 1);
    await handleSubmit();
    closeMoreFiltersModal()
  }

  handleReset = async () => {
    const { className, handleTabToggle, isExpand, smallDevice, verySmallDevice, tabletDevice } = this.props;
    const { change } = this.props;
    handleTabToggle('moreFilters', isExpand)
    await change('make', null);
    await change('transmission', null);
    await change('amenities', []);
    await change('houseRules', []);
    if (smallDevice || tabletDevice) {
      await change('roomType', []);
      await change('priceRange', null);
      await change('priceRangeLabel', null);
      await change('bookingType', null);
    }
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  setBtnWrapperRef = (node) => {
    this.btnWrapperRef = node;
  }

  handleClickOutside = async (event) => {
    const { handleSubmit, closeMoreFiltersModal } = this.props;
    const { change } = this.props;

    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      change('currentPage', 1);
      await handleSubmit();
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        closeMoreFiltersModal();
      }
    }
  }

  handleOpen = async () => {
    const { openMoreFiltersModal } = this.props;
    openMoreFiltersModal();
  };

  render() {
    const { className, isExpand, formValues, searchSettings, filterIcon, filtersModal, handleOpen, closeMoreFiltersModal } = this.props;
    const { fieldsSettingsData: { carFeatures, make, carRules }, smallDevice, verySmallDevice, tabletDevice } = this.props;
    const { formatMessage } = this.props.intl;

    let isActive = false, isActiveMoreFilter = false;

    if (formValues && (formValues?.make || formValues?.transmission == "Automatic" || formValues?.bathrooms
      || (formValues?.amenities && formValues?.amenities?.length) || (formValues?.spaces && formValues?.spaces?.length)
      || (formValues?.houseRules && formValues?.houseRules?.length))) {
      isActiveMoreFilter = true;
      isActive = true;
    }

    if ((smallDevice || verySmallDevice || tabletDevice) && formValues && ((formValues?.bookingType) || (formValues?.priceRange) || (formValues?.roomType && formValues?.roomType?.length))) {
      isActive = true;
    }

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || isActive == true) }, s.btn, s.btnFontsize, 'hidden-md hidden-lg')}
            onClick={this.handleOpen}>
            <img src={filterIcon} className={cx('searchHeaderIcon', 'searchHeaderIconWidth')} />
            <FormattedMessage {...messages.filter} />
          </Button>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || isActiveMoreFilter == true) }, s.btn, s.btnFontsize, 'hidden-xs hidden-sm')}
            onClick={this.handleOpen}>
            <img src={filterIcon} className={cx('searchHeaderIcon', 'searchHeaderIconWidth')} />
            <span className={cx('hidden-md hidden-lg')}>
              <FormattedMessage {...messages.filter} />
            </span>
            <FormattedMessage {...messages.moreFilters} />
          </Button>
        </div>
        <Modal show={filtersModal} animation={false} onHide={closeMoreFiltersModal} className={cx('moreFilterModal', 'moreModal')}>
          <div ref={this.setWrapperRef}>
            <Modal.Header closeButton>
              <FormattedMessage {...messages.moreFilters} />
            </Modal.Header>
            <Modal.Body>
              <div className={cx(s.filterSection, 'filterSectionTabRTL')}>
                <HomeType
                  className={cx(s.filters, 'visible-xs', s.space4, s.showTabletSection)}
                />

                <Price
                  className={cx(s.filters, 'visible-xs', s.space4, s.showTabletSection)}
                  searchSettings={searchSettings}
                />
                <InstantBook
                  className={cx(s.filters, 'visible-xs', s.space4, s.showTabletSection)}
                />
                <Row className={cx(s.filters, s.transmissionBottom, s.marginNone)}>
                  <Col lg={5} md={4} sm={4} xs={12} className={s.paddingNone}>
                    <VehicleMakes
                      options={make}
                    />
                  </Col>
                  <Col lg={7} md={8} sm={8} xs={12} className={cx(s.paddingNone, s.toggleTop)}>
                    <Transmission />
                  </Col>
                </Row>
                <CheckboxListItems
                  className={s.filters}
                  fieldName={'amenities'}
                  options={carFeatures}
                  captionTitle={formatMessage(messages.aminities)}
                  showLabel={formatMessage(messages.showMore)}
                  hideLabel={formatMessage(messages.showLess)}
                  isActive={false}
                />
                <div className={s.houseMobile}>
                  <CheckboxListItems
                    className={s.filters}
                    fieldName={'houseRules'}
                    options={carRules}
                    captionTitle={formatMessage(messages.houseRules)}
                    showLabel={formatMessage(messages.showMore)}
                    hideLabel={formatMessage(messages.showLess)}
                    isActive={false}
                  />
                </div>
              </div>
              <div className={s.filtersFooter}>
                <div>
                  <Button
                    bsStyle="link"
                    className={cx(s.btnPrimaryBorder, s.viewResultBtn)}
                    onClick={this.handleReset}>
                    <FormattedMessage {...messages.clearAll} />
                  </Button>
                </div>
                <div>
                  <Button
                    className={cx(s.btn, s.btnSecondary, s.viewResultBtn)}
                    onClick={this.handleSubmit}>
                    <FormattedMessage {...messages.applyFilters} />
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </div >
    );
  }
}

MoreFilters = reduxForm({
  form: 'SearchForm',
  onSubmit: submit,
  destroyOnUnmount: false,
})(MoreFilters);

const selector = formValueSelector('SearchForm');

const mapState = (state) => ({
  fieldsSettingsData: state?.listingFields?.data,
  homeType: selector(state, 'roomType'),
  formValues: getFormValues('SearchForm')(state),
  filtersModal: state?.modalStatus?.isMoreFiltersModal,
});

const mapDispatch = {
  change,
  closeMoreFiltersModal,
  openMoreFiltersModal
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(MoreFilters)));