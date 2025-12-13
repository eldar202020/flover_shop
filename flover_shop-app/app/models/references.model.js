module.exports = (db) => {
  // Связь GoodsGroup (самореференс)
   db.productGroup.belongsTo(db.productGroup, { foreignKey: "baseGoodsGroup"});

  // Связь Goods -> GoodsGroup
  db.product.belongsTo(db.productGroup,{ foreignKey: "id_category"});
  
  // Связи PricelistGoods
    db.prodInListPrice.belongsTo(db.product,{ foreignKey: "id_product"});
    db.prodInListPrice.belongsTo(db.priceList,{foreignKey: "id"} );

  // Связь Purchase -> Pricelist
  db.sale.belongsTo(db.priceList,{ foreignKey: "id_price_list"});

  // Связи PurchaseGoods  
  db.prodIsOnSale.belongsTo(db.product,{ foreignKey: "id_sale"});
  db.prodIsOnSale.belongsTo(db.sale,{ foreignKey: "id_product"});
};