import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change, formValueSelector, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CustomPagination from '../CustomPagination';
import ListingItem from '../ListingItem';
import NoResults from '../NoResults';

import submit from '../SearchForm/submit';

import s from './SearchResults.css';
class SearchResults extends React.Component {
  static propTypes = {
    change: PropTypes.any,
    submitForm: PropTypes.any,
    results: PropTypes.array,
    currentPage: PropTypes.number,
    total: PropTypes.number,
    isResultLoading: PropTypes.bool
  };

  static defaultProps = {
    results: [],
    showMap: false,
    showMapLoader: false
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { currentPage } = nextProps;
    if (currentPage != undefined) {
      this.setState({ page: currentPage });
    }
  }

  handlePagination = async (currenctPage, size) => {
    const { change, handleSubmit } = this.props;
    await change('currentPage', currenctPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    await handleSubmit();
  }

  render() {
    const { page } = this.state;
    const { results, total, isResultLoading, showMap, showMapLoader, endBeforeDate } = this.props;

    if (results != null && results?.length > 0 && !endBeforeDate) {
      return (
        <div className={cx(s.searchResults, { [s.listItemOnly]: showMap == false })}>
          {
            !showMapLoader && <Row className={s.noMargin}>
              <Col xs={12} sm={12} md={12} lg={12} className={cx(s.nopaddingRight, s.minHeight, 'nopaddingRightRTL')}>
                <div className={cx(s.resultsContainer, 'resultsContainerRTL')}>
                  {
                    isResultLoading && <div className={s.loadingOverlay} />
                  }
                  {
                    results && results.map((item, listIndex) => {
                      return (
                        <div className={cx(s.listItem, s.displayInlineBlock, 'listItemRTL')} key={item.id}>
                          <ListingItem
                            id={item.id}
                            basePrice={item.listingData?.basePrice}
                            hourPrice={item.listingData?.hourlyPrice}
                            currency={item.listingData?.currency}
                            title={item.title}
                            beds={item.beds}
                            personCapacity={item.personCapacity}
                            carType={item.settingsData && item.settingsData[0] && item.settingsData[0].listsettings && item.settingsData[0].listsettings.itemName}
                            coverPhoto={item.coverPhoto}
                            listPhotos={item.listPhotos}
                            transmission={item.transmission}
                            bookingType={item.bookingType}
                            reviewsCount={item.reviewsCount}
                            reviewsStarRating={item.reviewsStarRating}
                            wishListStatus={item.wishListStatus}
                            isListOwner={item.isListOwner}
                          />
                        </div>
                      )
                    })
                  }
                </div>
                <div className={cx(s.resultsFooter, 'searchPagination')}>
                  <div className={s.resultsPagination}>
                    <div className={s.pagination}>
                      <CustomPagination
                        total={total}
                        current={page}
                        defaultCurrenct={1}
                        defaultPageSize={12}
                        handleChange={this.handlePagination}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          }
        </div>
      );

    } else {
      return (
        <div>
          {
            isResultLoading && <div className={s.loadingOverlay} />
          }
          <NoResults />
        </div>
      );
    }
  }
}

SearchResults = reduxForm({
  form: 'SearchForm',
  onSubmit: submit,
  destroyOnUnmount: false,
})(SearchResults);


const selector = formValueSelector('SearchForm');

const mapState = (state) => ({
  results: state?.search?.data,
  currentPage: selector(state, 'currentPage'),
  total: state?.search?.count,
  isResultLoading: state?.search?.isResultLoading,
  showMap: state?.personalized?.showMap,
  showMapLoader: state?.loader?.showMapLoading
});

const mapDispatch = {
  change
};

export default withStyles(s)(connect(mapState, mapDispatch)(SearchResults));
