module.exports = (db) => {
  // Связь GoodsGroup (самореференс)
   db.productGroup.belongsTo(productGroup, { foreignKey: "baseGoodsGroup"});

  // Связь Goods -> GoodsGroup
  db.product.belongsTo(db.productGroup,{ foreignKey: "id_categor"});
  
  // Связи PricelistGoods
    db.prodInListPrice.belongsTo(db.product,{ foreignKey: "Id_product"});
    db.prodInListPrice.belongsTo(db.priceList,{foreignKey: "Id"} );

  // Связь Purchase -> Pricelist
  db.sale.belongsTo(db.priceList,{ foreignKey: "Id_price_list"});

  // Связи PurchaseGoods
  db.prodIsOnSale.belongsTo(db.product,{ foreignKey: "Id_sale"});
  db.prodIsOnSale.belongsTo(db.sale,{ foreignKey: "Id_product"});
};