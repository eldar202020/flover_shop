const db = require("../models");
const ProductGroup = db.productGroup;
const Op = db.sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Connect can not be empty",
    });
    return;
  }

  const productGroup = {
    name: req.body.title,
    description: req.body.description,
    baseGoodsGroup: req.body.baseGoodsGroup,
  };

  ProductGroup.create(productGroup)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred whil creating ProductGroup",
      });
    });
};
