module.exports = (sequelize, Sequelize) => {
  const Shipment = sequelize.define("shipment", {
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    provider_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: "Количество в поставке должно быть не менее 1" } }
    },
    unit_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "Цена не может быть отрицательной" } }
    },
    purchase_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
  return Shipment;
};
