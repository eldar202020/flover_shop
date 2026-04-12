module.exports = app => {
  const controller = require("../controllers/prodinListPrice.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     ProdInListPrice:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *         id_price_list:
   *           type: integer
   *         id_product:
   *           type: integer
   *         price:
   *           type: number
   */

  /**
   * @swagger
   * /api/prodinlistprice:
   *   post:
   *     summary: Create product-price entry
   *     tags: [ProductInListPrice]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProdInListPrice'
   *     responses:
   *       200:
   *         description: Entry created
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/prodinlistprice:
   *   get:
   *     summary: Get all entries
   *     tags: [ProductInListPrice]
   *     responses:
   *       200:
   *         description: List of entries
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/prodinlistprice/{id}:
   *   get:
   *     summary: Get entry by ID
   *     tags: [ProductInListPrice]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Entry found
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/prodinlistprice/{id}:
   *   put:
   *     summary: Update entry
   *     tags: [ProductInListPrice]
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
   *             $ref: '#/components/schemas/ProdInListPrice'
   *     responses:
   *       200:
   *         description: Entry updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/prodinlistprice/{id}:
   *   delete:
   *     summary: Delete entry
   *     tags: [ProductInListPrice]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Entry deleted
   */
  router.delete("/:id", controller.delete);

  app.use("/api/prodinlistprice", router);
};