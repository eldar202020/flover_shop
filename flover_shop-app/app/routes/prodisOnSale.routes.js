module.exports = app => {
  const controller = require("../controllers/prodIsOnSale.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     ProdIsOnSale:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *         id_product:
   *           type: integer
   *         id_sale:
   *           type: integer
   *         quantity:
   *           type: integer
   */

  /**
   * @swagger
   * /api/prodisonsale:
   *   post:
   *     summary: Create product-sale entry
   *     tags: [ProdIsOnSale]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProdIsOnSale'
   *     responses:
   *       200:
   *         description: Entry created
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/prodisonsale:
   *   get:
   *     summary: Get all entries
   *     tags: [ProdIsOnSale]
   *     responses:
   *       200:
   *         description: List of entries
   */
  router.get("/", controller.findAll);

  // Получить позиции конкретной продажи (ДОЛЖЕН быть до /:id)
  router.get("/sale/:saleId", controller.findBySaleId);

  /**
   * @swagger
   * /api/prodisonsale/{id}:
   *   get:
   *     summary: Get entry by ID
   *     tags: [ProdIsOnSale]
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
   * /api/prodisonsale/{id}:
   *   put:
   *     summary: Update entry
   *     tags: [ProdIsOnSale]
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
   *             $ref: '#/components/schemas/ProdIsOnSale'
   *     responses:
   *       200:
   *         description: Entry updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/prodisonsale/{id}:
   *   delete:
   *     summary: Delete entry
   *     tags: [ProdIsOnSale]
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

  app.use("/api/prodisonsale", router);
};