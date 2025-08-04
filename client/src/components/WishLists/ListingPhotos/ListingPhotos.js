import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Carousel } from 'react-bootstrap';
import cx from 'classnames';

import { photosShow } from '../../../helpers/photosShow';
import { fileuploadDir } from '../../../config';

import s from './ListingPhotos.css';


class ListingPhotos extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    listPhotos: PropTypes.array,
    coverPhoto: PropTypes.number,
    size: PropTypes.string,
  };

  static defaultProps = {
    listPhotos: [],
    coverPhoto: 0,
    size: 'x_medium_',
  };

  render() {
    const { id, listPhotos, coverPhoto, size } = this.props;
    let imagepath, path;
    path = photosShow(fileuploadDir);
    imagepath = `${path}${size}`;

    return (
      <div className={cx(s.listPhotoContainer, 'listingCarousel')}>
        <div>
          <Carousel
            // nextIcon={<FontAwesome.FaAngleRight />}
            // prevIcon={<FontAwesome.FaAngleLeft />}
            indicators={false}
            interval={0}
            wrap={false}
            className={cx('row')}
          >
            {
              listPhotos != null && listPhotos.length && listPhotos.map((item, itemIndex) => {
                return (
                  <Carousel.Item key={itemIndex}>
                    <div key={itemIndex}>
                      <a href={`/cars/${id}`} target={'_blank'} className={s.displayBlock}>
                        <div
                          className={s.bgImage}
                          style={{ backgroundImage: `url(${imagepath}${item.name})` }}
                        />
                      </a>
                    </div>
                  </Carousel.Item>
                )
              })
            }
          </Carousel>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ListingPhotos);