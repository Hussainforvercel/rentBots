import DataType from 'sequelize';
import Model from '../sequelize.js';

const ListViews = Model.define('ListViews', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    listId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    userId: {
        type: DataType.UUID,
        primaryKey: true,
    }
});

export default ListViews;