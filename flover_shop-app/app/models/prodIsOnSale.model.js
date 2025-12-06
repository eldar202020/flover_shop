module.exports = (sequelize, Sequelize) => {
  const PIOS = sequelize.define("prodIsOnSale", {
    Id_product: {
      type: Sequelize.INTEGER
    },
    Id_sale: {
      type: Sequelize.INTEGER
    },
    quanity: {
      type: Sequelize.INTEGER
    },
  });
  return PIOS ;     
};