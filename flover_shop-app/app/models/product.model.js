module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    article: {
      type: Sequelize.BOOLEAN
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
