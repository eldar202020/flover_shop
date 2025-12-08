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
      type: Sequelize.BOOLEAN
    },
    author: {
      type: Sequelize.STRING
    },
    product_type:{
        type: Sequelize.STRING
    },
    publisher:{
        type: Sequelize.STRING
    },
    isbn:{
        type: Sequelize.STRING
    }

  });
  return Product ;
};
