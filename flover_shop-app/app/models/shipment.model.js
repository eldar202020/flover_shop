module.exports = (sequelize, Sequelize) => {
  const Shipment = sequelize.define("shipment", {
    product_id: {
      type: Sequelize.INTEGER
    },
    provider_id: {
      type: Sequelize.INTEGER
    },
    count: {
      type: Sequelize.INTEGER
    }
  });
  return Shipment;
};
