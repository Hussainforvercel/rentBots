import DataType from 'sequelize';
import Model from '../sequelize.js';

const ClaimImages = Model.define('ClaimImages', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    reservationId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    image: {
        type: DataType.STRING,
        allowNull: false
    }
});

export default ClaimImages;