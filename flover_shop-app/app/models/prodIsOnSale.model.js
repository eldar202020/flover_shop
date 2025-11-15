module.exports = (sequelize, Sequelize) => {
  const PIOS = sequelize.define("prodIsOnSale", {
    Id_product: {
      type: Sequelize.INTEGER
    },
    quanity: {
      type: Sequelize.INTEGER
    },
    Sale_price: {
      type: Sequelize.DECIMAL
    },

  });
  PIOS.belongsTo(PIOS,{ foreignKey: "Id_price_list"});
  return PIOS ;     
};