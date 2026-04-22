module.exports = app => {
  const expense = require("../controllers/expense.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     Expense:
   *       type: object
   *       required:
   *         - category
   *         - amount
   *       properties:
   *         id:
   *           type: integer
   *         category:
   *           type: string
   *         amount:
   *           type: number
   *         description:
   *           type: string
   *         date:
   *           type: string
   *           format: date
   */

  /**
   * @swagger
   * /api/expenses:
   *   post:
   *     summary: Create a new expense
   *     tags: [Expenses]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Expense'
   *     responses:
   *       200:
   *         description: Expense created
   */
  router.post("/", expense.create);

  /**
   * @swagger
   * /api/expenses:
   *   get:
   *     summary: Get all expenses
   *     tags: [Expenses]
   *     responses:
   *       200:
   *         description: List of expenses
   */
  router.get("/", expense.findAll);

  app.use("/api/expenses", router);
};
