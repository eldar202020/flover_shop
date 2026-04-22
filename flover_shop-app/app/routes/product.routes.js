module.exports = app => {
  const product = require("../controllers/product.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     Product:
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
   *         id_category:
   *           type: integer
   *         quantity:
   *           type: integer
   *         additional_attributes:
   *           type: object
   *           description: Гибкие атрибуты (цвет, длина стебля и т.д.)
   */

  /**
   * @swagger
   * /api/product:
   *   post:
   *     summary: Create product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product created
   */
  router.post("/", product.create);

  /**
   * @swagger
   * /api/product:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: List of products
   */
  router.get("/", product.findAll);

  /**
   * @swagger
   * /api/product/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product found
   */
  router.get("/:id", product.findOne);

  /**
   * @swagger
   * /api/product/{id}:
   *   put:
   *     summary: Update product
   *     tags: [Products]
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
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product updated
   */
  router.put("/:id", product.update);

  /**
   * @swagger
   * /api/product/{id}:
   *   delete:
   *     summary: Delete product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product deleted
   */
  router.delete("/:id", product.delete);

  /**
   * @swagger
   * /api/product/{id}/getproductgroup:
   *   get:
   *     summary: Get product group
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Found group
   */
  router.get("/:id/getproductgroup", product.getProductGroup);

  app.use("/api/product", router);
};