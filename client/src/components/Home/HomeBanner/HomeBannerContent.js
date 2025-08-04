import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { injectIntl } from 'react-intl';
import s from './HomeBanner.css';
import cx from 'classnames';
//Components
import BannerCaption from '../BannerCaption';
import SearchForm from '../SearchForm';
import BookYourCarSkeleton from '../../Skeleton/BookYourCarSkeleton';
import BookYourCar from '../BookYourCar/BookYourCar';

class HomeBannerContent extends React.Component {

    static propTypes = {
        getImageBannerData: PropTypes.shape({
            loading: PropTypes.bool,
            getImageBanner: PropTypes.object
        }),
        wholeData: PropTypes.object, // Added prop type for wholeData
        infoCollection: PropTypes.object, // Added prop type for infoCollection
        getBannerData: PropTypes.object, // Added prop type for getBannerData
        layoutType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Added prop type for layoutType
    };

    static defaultProps = {
        getImageBannerData: {
            loading: true
        },
        wholeData: {}, // Added default empty object for wholeData
        infoCollection: {}, // Added default empty object for infoCollection
        getBannerData: {}, // Added default empty object for getBannerData
    };

    render() {
        const { layoutType, wholeData = {}, infoCollection = {}, getBannerData } = this.props;
        
        // Added defensive check for layoutType equal to 2
        const showSearchForm = layoutType && layoutType == 2;
        
        return (
            <div className={s.container}>
                <div className={s.sectionWidth}>
                    {
                        showSearchForm && (
                            <div className={s.pageContainer}>
                                <SearchForm />
                            </div>
                        )
                    }
                    {
                        showSearchForm && (
                            <div className={cx(s.pageContainer, s.pageContainerMb)}>
                                <BannerCaption data={getBannerData || {}} />
                            </div>
                        )
                    }
                </div>
                {
                    // Added defensive check for wholeData and wholeData.getFindYouCar
                    (!wholeData || !wholeData.getFindYouCar) ? (
                        <BookYourCarSkeleton />
                    ) : (
                        <BookYourCar infoCollection={infoCollection} />
                    )
                }
            </div>
        );
    }
}

export default injectIntl(withStyles(s)(HomeBannerContent));