module.exports = app => {
  const customer = require("../controllers/customer.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     Customer:
   *       type: object
   *       required:
   *         - name
   *       properties:
   *         id:
   *           type: integer
   *         name:
   *           type: string
   *         phone:
   *           type: string
   *         personal_purchases:
   *           type: integer
   *         personal_discount:
   *           type: number
   */

  /**
   * @swagger
   * /api/customer:
   *   post:
   *     summary: Create a new customer
   *     tags: [Customers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Customer'
   *     responses:
   *       200:
   *         description: Customer created
   */
  router.post("/", customer.create);

  /**
   * @swagger
   * /api/customer:
   *   get:
   *     summary: Get all customers
   *     tags: [Customers]
   *     responses:
   *       200:
   *         description: List of customers
   */
  router.get("/", customer.findAll);

  /**
   * @swagger
   * /api/customer/{id}:
   *   get:
   *     summary: Get customer by ID
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Customer found
   */
  router.get("/:id", customer.findOne);

  /**
   * @swagger
   * /api/customer/{id}:
   *   put:
   *     summary: Update customer
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Customer'
   *     responses:
   *       200:
   *         description: Customer updated
   */
  router.put("/:id", customer.update);

  /**
   * @swagger
   * /api/customer/{id}:
   *   delete:
   *     summary: Delete customer
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Customer deleted
   */
  router.delete("/:id", customer.delete);

  app.use("/api/customer", router);
};
