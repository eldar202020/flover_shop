module.exports = (sequelize, Sequelize) => {
  const ProductInListPrice = sequelize.define("product_in_list_price", {
    id_price_list: {
      type: Sequelize.INTEGER
    },
    id_product: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.DECIMAL
    }
  });
  return ProductInListPrice;
};