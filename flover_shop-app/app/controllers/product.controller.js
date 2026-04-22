const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  const product = {
    name: req.body.name,
    description: req.body.description,
    id_category: req.body.id_category,
    quantity: req.body.quantity || 0,
    cost_price: req.body.cost_price || 0,
    min_threshold: req.body.min_threshold || 5,
    additional_attributes: req.body.additional_attributes || {}
  };
  Product.create(product)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error creating Product." }));
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Product.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error retrieving products." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Product.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Product not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving Product with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Product.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Product was updated successfully." }) : res.send({ message: `Cannot update Product with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating Product with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Product.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Product was deleted successfully!" }) : res.send({ message: `Cannot delete Product with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete Product with id=" + id }));
};

exports.deleteAll = (req, res) => {
  Product.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} Products were deleted successfully!` }))
    .catch(err => res.status(500).send({ message: err.message || "Error deleting products." }));
};

exports.getProductGroup = (req, res) => {
  const id = req.params.id;
  db.sequelize.query('SELECT pg.* FROM product_groups pg JOIN products p ON pg.id = p.id_category WHERE p.id = :id', {
    replacements: { id: id },
    type: QueryTypes.SELECT,
  })
    .then(result => res.send(result[0]))
    .catch(err => res.status(500).send({ message: err.message || "Error retrieving product group" }));
};
