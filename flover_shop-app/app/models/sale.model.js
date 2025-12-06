module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sale", {
    Id_price_list: {
      type: Sequelize.INTEGER
    },
    sale_date: {
      type: Sequelize.DATE
    },
    Payment_time: {
      type: Sequelize.TIME
    },
    Total_amount:{
        type: Sequelize.DECIMAL
    }  

  });
  return Sale ;     
};