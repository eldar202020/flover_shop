module.exports = (sequelize, Sequelize) => {
  const PIOS = sequelize.define("prod_is_on_sale", {
    id_product: {
      type: Sequelize.INTEGER
    },
    id_sale: {
      type: Sequelize.INTEGER
    },
    quanity: {
      type: Sequelize.INTEGER
    },
  });
  return PIOS ;     
};