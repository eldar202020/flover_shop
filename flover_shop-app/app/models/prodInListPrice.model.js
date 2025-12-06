module.exports = (sequelize, Sequelize)=>{
    const prodInListPrice = sequelize.define("ProductInPriceList",{
        Id_product:{
            type: Sequelize.INTEGER
        },
        Price:{
            type: Sequelize.DECIMAL
        }

    });
  return prodInListPrice ;
};