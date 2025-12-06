module.exports = (sequelize, Sequelize) => {
  const priceList = sequelize.define("price_list", {
    name: {
      type: Sequelize.STRING
    },
    effective_date: {
      type: Sequelize.DATE
    },
    
  });
  return priceList ;
};