module.exports = (sequelize, Sequelize) => {
  const Provider = sequelize.define("provider", {
    organization_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: { msg: "Поставщик с таким названием уже существует" },
      validate: { notEmpty: { msg: "Название организации не может быть пустым" } }
    }
  });
  return Provider;
};
