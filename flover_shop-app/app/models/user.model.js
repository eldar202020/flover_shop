module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: { msg: "Пользователь с таким именем уже существует" },
      validate: { notEmpty: { msg: "Имя пользователя не может быть пустым" } }
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM("admin", "manager", "cashier"),
      allowNull: false,
      defaultValue: "cashier"
    },
    full_name: {
      type: Sequelize.STRING
    }
  });
  return User;
};
