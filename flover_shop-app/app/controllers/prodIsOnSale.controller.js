const db = require("../models");
const ProdIsOnSale = db.prodIsOnSale;

exports.create = (req, res) => {
  const item = {
    id_product: req.body.id_product,
    id_sale: req.body.id_sale,
    quantity: req.body.quantity
  };
  ProdIsOnSale.create(item)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error creating ProdIsOnSale entry." }));
};

exports.findAll = (req, res) => {
  ProdIsOnSale.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving entries." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  ProdIsOnSale.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found." }))
    .catch(err => res.status(500).send({ message: "Error." }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  ProdIsOnSale.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Updated successfully." }) : res.send({ message: "Cannot update." }))
    .catch(err => res.status(500).send({ message: "Error." }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ProdIsOnSale.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Deleted successfully!" }) : res.send({ message: "Cannot delete." }))
    .catch(err => res.status(500).send({ message: "Error." }));
};
