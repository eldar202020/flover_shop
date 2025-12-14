module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    id_category: {
      type: Sequelize.INTEGER
    },
    provider:{
        type: Sequelize.STRING
    }

  });
  return Product ;
};
