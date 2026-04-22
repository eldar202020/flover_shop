module.exports = app => {
  const sale = require("../controllers/sale.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     Sale:
   *       type: object
   *       required:
   *         - id_customer
   *       properties:
   *         id:
   *           type: integer
   *         id_price_list:
   *           type: integer
   *         id_customer:
   *           type: integer
   *         sale_date:
   *           type: string
   *           format: date-time
   *         payment_time:
   *           type: string
   *         total_amount:
   *           type: number
   *         products:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id_product:
   *                 type: integer
   *               quantity:
   *                 type: integer
   *               price:
   *                 type: number
   */

  /**
   * @swagger
   * /api/sale:
   *   post:
   *     summary: Create sale
   *     tags: [Sales]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Sale'
   *     responses:
   *       200:
   *         description: Sale created
   */
  router.post("/", sale.create);

  /**
   * @swagger
   * /api/sale:
   *   get:
   *     summary: Get all sales
   *     tags: [Sales]
   *     responses:
   *       200:
   *         description: List of sales
   */
  router.get("/", sale.findAll);

  /**
   * @swagger
   * /api/sale/{id}:
   *   get:
   *     summary: Get sale by ID
   *     tags: [Sales]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sale found
   */
  router.get("/:id", sale.findOne);

  /**
   * @swagger
   * /api/sale/{id}:
   *   put:
   *     summary: Update sale
   *     tags: [Sales]
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
   *             $ref: '#/components/schemas/Sale'
   *     responses:
   *       200:
   *         description: Sale updated
   */
  router.put("/:id", sale.update);

  /**
   * @swagger
   * /api/sale/{id}:
   *   delete:
   *     summary: Delete sale
   *     tags: [Sales]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sale deleted
   */
  router.delete("/:id", sale.delete);

  /**
   * @swagger
   * /api/sale/{id}/saleWithProducts:
   *   get:
   *     summary: Get sale details with products
   *     tags: [Sales]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sale with products details found
   */
  router.get("/:id/saleWithProducts", sale.saleWithProducts);

  app.use("/api/sale", router);
};