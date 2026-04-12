const db = require("../models");
const PriceList = db.priceList;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  const priceList = {
    name: req.body.name,
    effective_date: req.body.effective_date
  };
  PriceList.create(priceList)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error creating PriceList." }));
};

exports.findAll = (req, res) => {
  PriceList.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving price lists." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  PriceList.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `PriceList not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving PriceList with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  PriceList.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "PriceList was updated successfully." }) : res.send({ message: `Cannot update PriceList with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating PriceList with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  PriceList.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "PriceList was deleted successfully!" }) : res.send({ message: `Cannot delete PriceList with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete PriceList with id=" + id }));
};
