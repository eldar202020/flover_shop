module.exports = (db) => {
  // === БЛОК 2. Ссылочная целостность (Один-ко-многим) ===
  // Связь ProductGroup (самореференс)
  db.productGroup.belongsTo(db.productGroup, { foreignKey: "id_base_goods_group" });
  
  // Связь Product -> ProductGroup
  db.product.belongsTo(db.productGroup, { foreignKey: "id_category" });
  
  // Связи Shipment -> Product и Provider
  db.shipment.belongsTo(db.product, { foreignKey: "product_id" });
  db.shipment.belongsTo(db.provider, { foreignKey: "provider_id" });
  
  // Связь Sale -> PriceList и Customer
  db.sale.belongsTo(db.priceList, { foreignKey: "id_price_list" });
  db.sale.belongsTo(db.customer, { foreignKey: "id_customer" });


  // === БЛОК 3. Разрешение связи "Многие-ко-многим" (BelongsToMany) ===
  // Связи Product in PriceList (Промежуточная таблица)
  db.prodInListPrice.belongsTo(db.product, { foreignKey: "id_product" });
  db.prodInListPrice.belongsTo(db.priceList, { foreignKey: "id_price_list" });
  
  // Связи Product is on Sale (Промежуточная таблица)
  db.prodIsOnSale.belongsTo(db.product, { foreignKey: "id_product" });
  db.prodIsOnSale.belongsTo(db.sale, { foreignKey: "id_sale" });
};