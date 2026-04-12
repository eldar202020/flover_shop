module.exports = (db) => {
  // Связь ProductGroup (самореференс)
  db.productGroup.belongsTo(db.productGroup, { foreignKey: "id_base_goods_group" });

  // Связь Product -> ProductGroup
  db.product.belongsTo(db.productGroup, { foreignKey: "id_category" });

  // Связь Shipment -> Product и Provider
  db.shipment.belongsTo(db.product, { foreignKey: "product_id" });
  db.shipment.belongsTo(db.provider, { foreignKey: "provider_id" });

  // Связи Product in PriceList
  db.prodInListPrice.belongsTo(db.product, { foreignKey: "id_product" });
  db.prodInListPrice.belongsTo(db.priceList, { foreignKey: "id_price_list" });

  // Связь Sale -> PriceList и Customer
  db.sale.belongsTo(db.priceList, { foreignKey: "id_price_list" });
  db.sale.belongsTo(db.customer, { foreignKey: "id_customer" });

  // Связи Product is on Sale
  db.prodIsOnSale.belongsTo(db.product, { foreignKey: "id_product" });
  db.prodIsOnSale.belongsTo(db.sale, { foreignKey: "id_sale" });
};