module.exports = app => {
  const productGroup = require("../controllers/productGroup.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     ProductGroup:
   *       type: object
   *       required:
   *         - name
   *       properties:
   *         id:
   *           type: integer
   *         name:
   *           type: string
   *         description:
   *           type: string
   *         id_base_goods_group:
   *           type: integer
   */

  /**
   * @swagger
   * /api/productgroup:
   *   post:
   *     summary: Create product group
   *     tags: [ProductGroups]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductGroup'
   *     responses:
   *       200:
   *         description: Product group created
   */
  router.post("/", productGroup.create);

  /**
   * @swagger
   * /api/productgroup:
   *   get:
   *     summary: Get all product groups
   *     tags: [ProductGroups]
   *     responses:
   *       200:
   *         description: List of product groups
   */
  router.get("/", productGroup.findAll);

  /**
   * @swagger
   * /api/productgroup/{id}:
   *   get:
   *     summary: Get product group by ID
   *     tags: [ProductGroups]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product group found
   */
  router.get("/:id", productGroup.findOne);

  /**
   * @swagger
   * /api/productgroup/{id}:
   *   put:
   *     summary: Update product group
   *     tags: [ProductGroups]
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
   *             $ref: '#/components/schemas/ProductGroup'
   *     responses:
   *       200:
   *         description: Product group updated
   */
  router.put("/:id", productGroup.update);

  /**
   * @swagger
   * /api/productgroup/{id}:
   *   delete:
   *     summary: Delete product group
   *     tags: [ProductGroups]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product group deleted
   */
  router.delete("/:id", productGroup.delete);

  app.use("/api/productgroup", router);
};