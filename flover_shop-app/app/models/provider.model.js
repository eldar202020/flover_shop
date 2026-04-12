module.exports = (sequelize, Sequelize) => {
  const Provider = sequelize.define("provider", {
    organization_name: {
      type: Sequelize.STRING
    }
  });
  return Provider;
};
