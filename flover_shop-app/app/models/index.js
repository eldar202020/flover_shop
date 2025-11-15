const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD
, {
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

const product_db = {};
product_db.Sequelize = Sequelize;
product_db.sequelize = sequelize;
product_db.product = require("./product.model.js")(sequelize, Sequelize);
module.exports = product_db;

const sale_bd = {};
sale_bd.Sequelize = Sequelize;
sale_bd.sequelize = sequelize;
sale_bd.sale = require("./sale.model.js")(sequelize, Sequelize);
module.exports = sale_bd;

const goodsgroup_bd = {};
goodsgroup_bd.Sequelize = Sequelize;
goodsgroup_bd.sequelize = sequelize;
goodsgroup_bd.sale = require("./goodsGroup.model.js")(sequelize, Sequelize);
module.exports = goodsgroup_bd;

const priceList_bd = {};
priceList_bd.Sequelize = Sequelize;
priceList_bd.sequelize = sequelize;
priceList_bd.sale = require("./priceList.model.js")(sequelize, Sequelize);
module.exports = priceList_bd;

const PIOS_bd = {};
PIOS_bd.Sequelize = Sequelize;
PIOS_bd.sequelize = sequelize;
PIOS_bd.sale = require("./prodIsOnSale.model.js")(sequelize, Sequelize);
module.exports = PIOS_bd;

const PILP_bd = {};
PILP_bd.Sequelize = Sequelize;
PILP_bd.sequelize = sequelize;
PILP_bd.sale = require("./prodInListPrice.model.js")(sequelize, Sequelize);
module.exports = PILP_bd;