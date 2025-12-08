const { where } = require("sequelize");
const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Connect can not be empty",
    });
    return;
  }
  const Prod = {
    name: req.body.name,
    description: req.body.description,
    article: req.body.article,
    author: req.body.author,
    product_type: req.body.product_type,
    publisher: req.body.publisher,
    isbn: req.body.isbn
    
  };
  Product.create(Prod)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whil creating Product",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Product.findAll({ where: condition })
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
  Product.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `canon find Product with id=${id}.`,
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
  Product.update(req.body, {
    where: {id: id}
  })
  .then(nam =>{
    if (nam == 1){
      res.send({
        message: "Product was this.updatesuccessfully"
      });
    }else {
      res.send({
        message: `cannot update Product with id = ${id}. 
        Maybe Product was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:"Error updating Product with id "+ id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Product.destroy({
    where: {id: id}
  })
  .then(nam =>{
    if (num == 1){
      res.send({
        messege: "Products was deleted successfully!"
      });
    }else {
      res.send({
        message: `cannot delete Product with id = ${id}. 
        Maybe Product was not found`
      })
    }
  })
  .catch(err => {
     res.status(500).send({
      message:"Could not delete Product with id "+ id
    });
  })
};

exports.deleteAll = (req, res) => {
  Product.destroy({
    where:{},
    truncate: false
  })
    .then(nams => {
      res.send({
        message: `${nams} Product were deleted successfully! `
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred whil creating Product",
      });
    });
};
