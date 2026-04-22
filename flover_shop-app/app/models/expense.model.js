module.exports = (sequelize, Sequelize) => {
  const Expense = sequelize.define("expense", {
    category: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    }
  });
  return Expense;
};
