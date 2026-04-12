const db = require("../models");
const Provider = db.provider;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.organization_name) {
    res.status(400).send({ message: "Organization name can not be empty!" });
    return;
  }
  const provider = {
    organization_name: req.body.organization_name
  };
  Provider.create(provider)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error creating Provider." }));
};

exports.findAll = (req, res) => {
  Provider.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving providers." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Provider.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Provider not found with id=${id}` }))
    .catch(err => res.status(500).send({ message: "Error retrieving Provider with id=" + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Provider.update(req.body, { where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Provider was updated successfully." }) : res.send({ message: `Cannot update Provider with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Error updating Provider with id=" + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Provider.destroy({ where: { id: id } })
    .then(num => num == 1 ? res.send({ message: "Provider was deleted successfully!" }) : res.send({ message: `Cannot delete Provider with id=${id}.` }))
    .catch(err => res.status(500).send({ message: "Could not delete Provider with id=" + id }));
};
