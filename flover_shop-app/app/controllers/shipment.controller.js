const db = require("../models");
const Shipment = db.shipment;

exports.create = (req, res) => {
  const shipment = {
    product_id: req.body.product_id,
    provider_id: req.body.provider_id,
    count: req.body.count
  };
  Shipment.create(shipment)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error creating Shipment." }));
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
