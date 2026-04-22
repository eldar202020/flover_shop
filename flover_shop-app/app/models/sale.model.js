module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sale", {
    id_price_list: {
      type: Sequelize.INTEGER
    },
    id_customer: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    sale_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    payment_time: {
      type: Sequelize.TIME
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      validate: { min: { args: [0], msg: "Сумма не может быть отрицательной" } }
    }
  });
  return Sale;
};