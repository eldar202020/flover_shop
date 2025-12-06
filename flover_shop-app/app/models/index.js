const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.product = require("./product.model.js")(sequelize, Sequelize);
db.productGroup = require("./productGroup.model.js")(sequelize, Sequelize);
db.sale = require("./sale.model.js")(sequelize, Sequelize);
db.priceList = require("./priceList.model.js")(sequelize, Sequelize);
db.prodIsOnSale = require("./prodIsOnSale.model.js")(sequelize, Sequelize);
db.prodInListPrice = require("./prodInListPrice.model.js")(sequelize, Sequelize);

require("./references.model.js")(db)

module.exports = db;