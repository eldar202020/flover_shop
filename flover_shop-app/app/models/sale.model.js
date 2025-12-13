module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sale", {
    id_price_list: {
      type: Sequelize.INTEGER
    },
    sale_date: {
      type: Sequelize.DATE
    },
    payment_time: {
      type: Sequelize.TIME
    },
    total_amount:{
        type: Sequelize.DECIMAL
    }  

  });
  return Sale ;     
};