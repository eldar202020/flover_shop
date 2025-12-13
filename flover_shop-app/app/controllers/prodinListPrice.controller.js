const { where, QueryTypes } = require("sequelize");
const db = require("../models");
const ProdInListPrice = db.prodInListPrice;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.id_product) {
    res.status(400).send({
      message: "Connect can not be empty",
    });
    return;
  }
  const prodinListPrice = {
    id_product: req.body.id_product,
    price: req.body.price
  };
  ProdInListPrice.create(prodinListPrice)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whil creating ProdInListPrice",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  ProdInListPrice.findAll({ where: condition })
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
  ProdInListPrice.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `canon find ProdInListPrice with id=${id}.`,
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
  ProdInListPrice.update(req.body, {
    where: {id: id}
  })
  .then(nam =>{
    if (nam == 1){
      res.send({
        message: "ProdInListPrice was this.updatesuccessfully"
      });
    }else {
      res.send({
        message: `cannot update ProdInListPrice with id = ${id}. 
        Maybe ProdInListPrice was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:"Error updating ProdInListPrice with id "+ id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ProdInListPrice.destroy({
    where: {id: id}
  })
  .then(nam =>{
    if (num == 1){
      res.send({
        messege: "ProdInListPrices was deleted successfully!"
      });
    }else {
      res.send({
        message: `cannot delete ProdInListPrice with id = ${id}. 
        Maybe ProdInListPrice was not found`
      })
    }
  })
  .catch(err => {
     res.status(500).send({
      message:"Could not delete ProdInListPrice with id "+ id
    });
  })
};

exports.deleteAll = (req, res) => {
  ProdInListPrice.destroy({
    where:{},
    truncate: false
  })
    .then(nams => {
      res.send({
        message: `${nams} ProdInListPrice were deleted successfully! `
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred whil creating ProdInListPrice",
      });
    });
};

exports.ProdandPrice = (req, res) => {
  const id = req.params.id;
  db.sequelize.query(`SELECT p.name, pilp.price FROM product_in_list_prices pilp JOIN products p  ON p.id = pilp.id_product WHERE p.id = ${id}`,{
    type: QueryTypes.SELECT,
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка",
      });
    });
};