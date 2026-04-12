module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    personal_purchases: {
      type: Sequelize.INTEGER
    },
    personal_discount: {
      type: Sequelize.DECIMAL
    }
  });
  return Customer;
};
