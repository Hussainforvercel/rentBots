import React from 'react';
import PropTypes from 'prop-types';

import { photosShow } from '../../helpers/photosShow';

// Assets
import mediumNoImage from './medium_no_image.png';
import largeNoImage from './large_no_image.jpeg';
import { fileuploadDir } from '../../config-sample';

class ListCoverPhoto extends React.Component {
    static propTypes = {
        coverPhoto: PropTypes.number,
        listPhotos: PropTypes.array,
        className: PropTypes.string,
        bgImage: PropTypes.bool
    };

    static defaultProps = {
        bgImage: false,
        sources: []
    }

    constructor(props) {
        super(props);
        this.state = {
            photo: null
        };
    }

    UNSAFE_componentWillMount() {
        const { coverPhoto, listPhotos, sources } = this.props;
        let activePhoto;
        if (listPhotos != undefined && listPhotos.length > 0) {
            activePhoto = listPhotos[0].name;
            if (coverPhoto != undefined && coverPhoto != null) {
                listPhotos.map((item) => {
                    if (item.id === coverPhoto) {
                        activePhoto = item.name;
                    }
                })
            }
            this.setState({ photo: activePhoto });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { coverPhoto, listPhotos, sources } = nextProps;
        let activePhoto;
        if (listPhotos != undefined && listPhotos.length > 0) {
            activePhoto = listPhotos[0].name;
            if (coverPhoto != undefined && coverPhoto != null) {
                listPhotos.map((item) => {
                    if (item.id === coverPhoto) {
                        activePhoto = item.name;
                    }
                })
            }
            this.setState({ photo: activePhoto });
        }
    }

    render() {
        const { className, photoType, bgImage } = this.props;
        const { photo } = this.state;
        let path = '', source, imagePath;
        imagePath = photosShow(fileuploadDir);

        if (photo != null) {
            source = photo;
            if (photoType != undefined) {
                path = imagePath + photoType + '';
            }
        } else {
            if (photoType != undefined) {
                if (photoType === "xx_large") {
                    source = largeNoImage;
                } else if (photoType === "x_medium") {
                    source = mediumNoImage;
                }
            } else {
                source = mediumNoImage
            }
        }
        if (bgImage) {
            return (
                // replace with source at directly image.jpeg
                <div className={className} style={{ backgroundImage: `url(${path}${"4f5ead9ad6c69e987ecf6c0db935db5f.jpeg"})` }}>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className={className} style={{ backgroundImage: `url(${path + "4f5ead9ad6c69e987ecf6c0db935db5f.jpeg"})` }} />);
        }
    }
}

export default ListCoverPhoto;