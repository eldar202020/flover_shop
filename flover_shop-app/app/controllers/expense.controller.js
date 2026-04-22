const db = require("../models");
const Expense = db.expense;

exports.create = (req, res) => {
  const expense = {
    category: req.body.category,
    amount: req.body.amount,
    description: req.body.description,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };

  Expense.create(expense)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error creating expense." }));
};

exports.findAll = (req, res) => {
  Expense.findAll({ order: [['date', 'DESC']] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: "Error retrieving expenses." }));
};
