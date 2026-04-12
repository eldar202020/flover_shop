const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  const customer = {
    name: req.body.name,
    phone: req.body.phone,
    personal_purchases: req.body.personal_purchases || 0,
    personal_discount: req.body.personal_discount || 0
  };
  Customer.create(customer)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error creating Customer." }));
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Customer.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving customers." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Customer.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Customer not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving Customer with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Customer.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Customer was updated successfully." }) : res.send({ message: `Cannot update Customer with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating Customer with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Customer.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Customer was deleted successfully!" }) : res.send({ message: `Cannot delete Customer with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete Customer with id=" + id }));
};
