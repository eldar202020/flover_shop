module.exports = (sequelize, Sequelize) => {
  const productGroup = sequelize.define("produt_group", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    baseGoodsGroup: {
      type: Sequelize.INTEGER
    }
  });
  return productGroup ;
};
