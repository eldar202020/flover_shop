const db = require("../models");
const Shipment = db.shipment;
const Product = db.product;

exports.create = async (req, res) => {
  const { product_id, provider_id, count, unit_price, purchase_date } = req.body;

  if (!product_id || !provider_id || !count) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const t = await db.sequelize.transaction();
  try {
    // 1. Создаем накладную
    const shipmentData = {
      product_id,
      provider_id,
      count,
      unit_price: unit_price || 0,
      purchase_date: purchase_date || new Date().toISOString(),
    };
    const data = await Shipment.create(shipmentData, { transaction: t });

    // 2. Увеличиваем остаток товара на складе
    const product = await Product.findByPk(product_id, { transaction: t });
    if (product) {
      await product.increment("quantity", { by: count, transaction: t });
    }

    await t.commit();
    res.send(data);
  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message || "Error creating Shipment." });
  }
};

exports.findAll = (req, res) => {
  Shipment.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving shipments." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Shipment.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Shipment not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving Shipment with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Shipment.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Shipment was updated successfully." }) : res.send({ message: `Cannot update Shipment with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating Shipment with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Shipment.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Shipment was deleted successfully!" }) : res.send({ message: `Cannot delete Shipment with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete Shipment with id=" + id }));
};
