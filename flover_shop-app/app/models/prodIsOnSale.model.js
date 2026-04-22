module.exports = (sequelize, Sequelize) => {
  const ProdIsOnSale = sequelize.define("prod_is_on_sale", {
    id_product: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_sale: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: "Количество должно быть не менее 1" } }
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "Цена не может быть отрицательной" } }
    }
  });
  return ProdIsOnSale;
};