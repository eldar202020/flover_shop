const db = require("../models");
const ProductGroup = db.productGroup;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  const group = {
    name: req.body.name,
    description: req.body.description,
    id_base_goods_group: req.body.id_base_goods_group
  };
  ProductGroup.create(group)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error creating ProductGroup." }));
};

exports.findAll = (req, res) => {
  ProductGroup.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error retrieving product groups." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  ProductGroup.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `ProductGroup not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving ProductGroup with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  ProductGroup.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "ProductGroup was updated successfully." }) : res.send({ message: `Cannot update ProductGroup with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating ProductGroup with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ProductGroup.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "ProductGroup was deleted successfully!" }) : res.send({ message: `Cannot delete ProductGroup with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete ProductGroup with id=" + id }));
};
