module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Название товара не может быть пустым" } }
    },
    description: {
      type: Sequelize.STRING
    },
    id_category: {
      type: Sequelize.INTEGER
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: { min: { args: [0], msg: "Количество не может быть отрицательным" } }
    },
    cost_price: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      validate: { min: { args: [0], msg: "Себестоимость не может быть отрицательной" } }
    },
    min_threshold: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
    additional_attributes: {
      type: Sequelize.JSONB,
      defaultValue: {}
    }
  });
  return Product;
};
