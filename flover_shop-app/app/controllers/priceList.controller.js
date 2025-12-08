const { where } = require("sequelize");
const db = require("../models");
const PriceList = db.priceList;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Connect can not be empty",
    });
    return;
  }
  const priceList = {
    name: req.body.name,
    effective_date: req.body.effective_date,
    
  };
  PriceList.create(priceList)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whil creating PriceList",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  PriceList.findAll({ where: condition })
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
  PriceList.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `canon find PriceList with id=${id}.`,
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
  PriceList.update(req.body, {
    where: {id: id}
  })
  .then(nam =>{
    if (nam == 1){
      res.send({
        message: "PriceList was this.updatesuccessfully"
      });
    }else {
      res.send({
        message: `cannot update PriceList with id = ${id}. 
        Maybe PriceList was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:"Error updating PriceList with id "+ id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  PriceList.destroy({
    where: {id: id}
  })
  .then(nam =>{
    if (num == 1){
      res.send({
        messege: "PriceLists was deleted successfully!"
      });
    }else {
      res.send({
        message: `cannot delete PriceList with id = ${id}. 
        Maybe PriceList was not found`
      })
    }
  })
  .catch(err => {
     res.status(500).send({
      message:"Could not delete PriceList with id "+ id
    });
  })
};

exports.deleteAll = (req, res) => {
  PriceList.destroy({
    where:{},
    truncate: false
  })
    .then(nams => {
      res.send({
        message: `${nams} PriceList were deleted successfully! `
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred whil creating PriceList",
      });
    });
};
