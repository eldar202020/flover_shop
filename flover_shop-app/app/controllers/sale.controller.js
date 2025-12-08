const { where } = require("sequelize");
const db = require("../models");
const Sale = db.sale;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Connect can not be empty",
    });
    return;
  }
  const sale = {
    Id_price_list: req.body.Id_price_list,
    sale_date: req.body.sale_date,
    Payment_time: req.body.Payment_time,
    Total_amount: req.body.Total_amount
  };
  Sale.create(sale)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whil creating Sale",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Sale.findAll({ where: condition })
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
  Sale.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `canon find Sale with id=${id}.`,
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
  Sale.update(req.body, {
    where: {id: id}
  })
  .then(nam =>{
    if (nam == 1){
      res.send({
        message: "Sale was this.updatesuccessfully"
      });
    }else {
      res.send({
        message: `cannot update Sale with id = ${id}. 
        Maybe Sale was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:"Error updating Sale with id "+ id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Sale.destroy({
    where: {id: id}
  })
  .then(nam =>{
    if (num == 1){
      res.send({
        messege: "Sales was deleted successfully!"
      });
    }else {
      res.send({
        message: `cannot delete Sale with id = ${id}. 
        Maybe Sale was not found`
      })
    }
  })
  .catch(err => {
     res.status(500).send({
      message:"Could not delete Sale with id "+ id
    });
  })
};

exports.deleteAll = (req, res) => {
  Sale.destroy({
    where:{},
    truncate: false
  })
    .then(nams => {
      res.send({
        message: `${nams} Sale were deleted successfully! `
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred whil creating Sale",
      });
    });
};
