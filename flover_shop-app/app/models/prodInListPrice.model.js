module.exports = (sequelize, Sequelize)=>{
    const prodInListPrice = sequelize.define("product_in_list_price",{
        id_product:{
            type: Sequelize.INTEGER
        },
        price:{
            type: Sequelize.DECIMAL
        }

    });
  return prodInListPrice ;
};