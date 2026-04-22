const db = require("../models");
const Sale = db.sale;
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");

exports.create = async (req, res) => {
  if (!req.body.id_customer) {
    res.status(400).send({ message: "Customer ID can not be empty!" });
    return;
  }

  const t = await db.sequelize.transaction();

  try {
    // 1. Create the sale
    const saleData = {
      id_price_list: req.body.id_price_list,
      id_customer: req.body.id_customer,
      sale_date: req.body.sale_date || new Date().toISOString(),
      payment_time: req.body.payment_time,
      total_amount: req.body.total_amount || 0
    };

    const sale = await Sale.create(saleData, { transaction: t });

    // 2. If products are provided, add them and decrement stock
    if (req.body.products && Array.isArray(req.body.products)) {
      let calcTotal = 0;
      for (const p of req.body.products) {
        // Create link entry
        await db.prodIsOnSale.create({
          id_sale: sale.id,
          id_product: p.id_product,
          quantity: p.quantity,
          price: p.price
        }, { transaction: t });

        // Decrement product stock
        const product = await db.product.findByPk(p.id_product, { transaction: t });
        if (product) {
          if (product.quantity < p.quantity) {
             throw new Error(`Insufficient stock for product: ${product.name}`);
          }
          await product.update({ quantity: product.quantity - p.quantity }, { transaction: t });
        }
        calcTotal += (p.price * p.quantity);
      }
      
      // Update total amount if not provided or if we want to be strict
      if (!req.body.total_amount) {
        await sale.update({ total_amount: calcTotal }, { transaction: t });
      }
    }

    await t.commit();
    res.send(sale);
  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message || "Error processing sale transaction" });
  }
};

exports.findAll = (req, res) => {
  Sale.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving sales." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Sale.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Sale not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving Sale with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Sale.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Sale was updated successfully." }) : res.send({ message: `Cannot update Sale with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating Sale with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Sale.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Sale was deleted successfully!" }) : res.send({ message: `Cannot delete Sale with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete Sale with id=" + id }));
};

exports.saleWithProducts = (req, res) => {
  const id = req.params.id;
  db.sequelize.query('SELECT s.*, p.name as product_name, pis.quantity, pis.price FROM sales s JOIN prod_is_on_sales pis ON s.id = pis.id_sale JOIN products p ON pis.id_product = p.id WHERE s.id = :id', {
    replacements: { id: id },
    type: QueryTypes.SELECT,
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving sale with products" }));
};