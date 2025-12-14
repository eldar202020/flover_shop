const { product } = require("../models/index.js");

module.exports = (app) => {
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
   *           example: 1
   *         name:
   *           type: string
   *           example: product1
   *         description:
   *           type: string
   *           example: Products 1.1 description
   *         id_category:
   *           type: integer
   *           example: 1
   *         provider:
   *           type: string
   *           example: provider1
   */

  /**
   * @swagger
   * /api/product:
   *   post:
   *     summary: Create new Product
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
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   */
  router.post("/", product.create);

  /**
   * @swagger
   * /api/product:
   *   get:
   *     summary: Retrieve a list of products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: A list of products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
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
   *           format: int64
   *         description: The product ID
   *     responses:
   *       200:
   *         description: Product found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   */
  router.get("/:id", product.findOne);

  /**
   * @swagger
   * /api/product/{id}:
   *   put:
   *     summary: Update product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
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
   *     summary: Delete product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
   *     responses:
   *       200:
   *         description: Product deleted
   *       404:
   *         description: Product not found
   */
  router.delete("/:id", product.delete);

  /**
   * @swagger
   * /api/product:
   *   delete:
   *     summary: Delete all products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: All products deleted
   */
  router.delete("/", product.deleteAll);

  /**
   * @swagger
   * /api/product/{id}/getproductgroup:
   *   get:
   *     summary: Get product group by product ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
   *     responses:
   *       200:
   *         description: Product group found
   */
  router.get("/:id/getproductgroup", product.getProductGroup);

  app.use("/api/product", router);
  console.log("router for /api/product initialized");
};