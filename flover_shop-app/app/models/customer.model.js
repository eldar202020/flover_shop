module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Имя клиента не может быть пустым" } }
    },
    phone: {
      type: Sequelize.STRING,
      unique: { msg: "Этот номер телефона уже зарегистрирован" },
      allowNull: false
    },
    personal_purchases: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    personal_discount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "Скидка не может быть меньше 0%" },
        max: { args: [100], msg: "Скидка не может быть больше 100%" }
      }
    },
    birthday: {
      type: Sequelize.DATEONLY
    },
    notes: {
      type: Sequelize.TEXT
    },
    tags: {
      type: Sequelize.STRING
    }
  });
  return Customer;
};
