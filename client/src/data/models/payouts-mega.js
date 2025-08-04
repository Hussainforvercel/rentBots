import DataType from 'sequelize';
import Model from '../sequelize';


const PayoutMegasoft = Model.define('PayoutMegasoft', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    method: {
        type: DataType.STRING,
        allowNull: false,
    },
    payoutAmount:{
        type: DataType.STRING,
        allowNull: false
    },
    buyerId :{
        type:DataType.STRING,
        allowNull: false,

    },
   isAmountTransfer :{
    type:DataType.BOOLEAN,
    allowNull: false,

   },
   



    

   
});

export default PayoutMegasoft; 