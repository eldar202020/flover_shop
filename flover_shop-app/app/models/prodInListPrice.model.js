module.exports = (sequelize, Sequelize)=>{
    const prodInListPrice = sequelize.define("Product_in_the_price_list",{
        Id_product:{
            type: Sequelize.INTEGER
        },
        Price:{
            type: Sequelize.DECIMAL
        }

    });
    prodInListPrice.belongsTo(prodInListPrice,{ foreignKey: "Id_product"});
  return prodInListPrice ;
};