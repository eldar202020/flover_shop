module.exports = (sequelize, Sequelize) => {
  const ProductGroup = sequelize.define("product_group", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    id_base_goods_group: {
      type: Sequelize.INTEGER
    }
  });
  return ProductGroup;
};
