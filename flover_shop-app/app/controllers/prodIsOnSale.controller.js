const { where } = require("sequelize");
const db = require("../models");
const ProdIsOnSale = db.sale;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Connect can not be empty",
    });
    return;
  }
  const prodIsOnSale = {
    Id_product: req.body.Id_product,
    Id_sale: req.body. Id_sale,
    quanity: req.body.quanity
  };
  ProdIsOnSale.create(prodIsOnSale)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whil creating ProdIsOnSale",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  ProdIsOnSale.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  ProdIsOnSale.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `canon find ProdIsOnSale with id=${id}.`,
      });
    }
  })
  .catch(err => {
    res.status(500).send({
        message:  "Ошибка" + id,
      });
  });

};

exports.update = (req, res) =>{
  const id = req.params.id;
  ProdIsOnSale.update(req.body, {
    where: {id: id}
  })
  .then(nam =>{
    if (nam == 1){
      res.send({
        message: "ProdIsOnSale was this.updatesuccessfully"
      });
    }else {
      res.send({
        message: `cannot update ProdIsOnSale with id = ${id}. 
        Maybe ProdIsOnSale was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:"Error updating ProdIsOnSale with id "+ id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ProdIsOnSale.destroy({
    where: {id: id}
  })
  .then(nam =>{
    if (num == 1){
      res.send({
        messege: "ProdIsOnSales was deleted successfully!"
      });
    }else {
      res.send({
        message: `cannot delete ProdIsOnSale with id = ${id}. 
        Maybe ProdIsOnSale was not found`
      })
    }
  })
  .catch(err => {
     res.status(500).send({
      message:"Could not delete ProdIsOnSale with id "+ id
    });
  })
};

exports.deleteAll = (req, res) => {
  ProdIsOnSale.destroy({
    where:{},
    truncate: false
  })
    .then(nams => {
      res.send({
        message: `${nams} ProdIsOnSale were deleted successfully! `
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred whil creating ProdIsOnSale",
      });
    });
};
