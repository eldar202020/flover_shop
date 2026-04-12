const db = require("../models");
const ProdInListPrice = db.prodInListPrice;

exports.create = (req, res) => {
  const item = {
    id_price_list: req.body.id_price_list,
    id_product: req.body.id_product,
    price: req.body.price
  };
  ProdInListPrice.create(item)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error creating ProductInListPrice." }));
};

exports.findAll = (req, res) => {
  ProdInListPrice.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving entries." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  ProdInListPrice.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found." }))
    .catch(err => res.status(500).send({ message: "Error." }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  ProdInListPrice.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Updated successfully." }) : res.send({ message: "Cannot update." }))
    .catch(err => res.status(500).send({ message: "Error." }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ProdInListPrice.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Deleted successfully!" }) : res.send({ message: "Cannot delete." }))
    .catch(err => res.status(500).send({ message: "Error." }));
};
