module.exports = app => {
    const productgroup = require("../controllers/prodIsOnSale.controller.js");
    
    var router = require("express").Router();

    /**
     * @swagger
     * components:
     *   schemas:
     *     ProdIsOnSale:
     *       type: object
     *       required:
     *         - id_product
     *         - id_sale
     *         - quanity
     *       properties:
     *         id:
     *           type: integer
     *           description: Auto-incremented ID
     *           example: 1
     *         id_product:
     *           type: integer
     *           description: Product ID
     *           example: 5
     *         id_sale:
     *           type: integer
     *           description: Sale ID
     *           example: 3
     *         quanity:
     *           type: integer
     *           description: Quantity of products on sale
     *           example: 10
     *         createdAt:
     *           type: string
     *           format: date-time
     *           description: Creation timestamp
     *           example: "2024-01-01T10:30:00Z"
     *         updatedAt:
     *           type: string
     *           format: date-time
     *           description: Update timestamp
     *           example: "2024-01-01T10:30:00Z"
     */

    /**
     * @swagger
     * /api/prodisOnSale:
     *   post:
     *     summary: Create a new product-sale relationship
     *     tags: [ProdIsOnSale]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - id_product
     *               - id_sale
     *               - quanity
     *             properties:
     *               id_product:
     *                 type: integer
     *                 example: 5
     *               id_sale:
     *                 type: integer
     *                 example: 3
     *               quanity:
     *                 type: integer
     *                 example: 10
     *     responses:
     *       201:
     *         description: Product added to sale successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdIsOnSale'
     *       400:
     *         description: Bad request - missing required fields
     *       500:
     *         description: Server error
     */
    router.post("/", productgroup.create);

    /**
     * @swagger
     * /api/prodisOnSale:
     *   get:
     *     summary: Get all product-sale relationships
     *     tags: [ProdIsOnSale]
     *     responses:
     *       200:
     *         description: List of all product-sale relationships
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ProdIsOnSale'
     */
    router.get("/", productgroup.findAll);

    /**
     * @swagger
     * /api/prodisOnSale/{id}:
     *   get:
     *     summary: Get product-sale relationship by ID
     *     tags: [ProdIsOnSale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ProdIsOnSale record ID
     *     responses:
     *       200:
     *         description: Product-sale relationship found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdIsOnSale'
     *       404:
     *         description: Record not found
     */
    router.get("/:id", productgroup.findOne);

    /**
     * @swagger
     * /api/prodisOnSale/{id}:
     *   put:
     *     summary: Update product-sale relationship
     *     tags: [ProdIsOnSale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ProdIsOnSale record ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id_product:
     *                 type: integer
     *                 example: 5
     *               id_sale:
     *                 type: integer
     *                 example: 3
     *               quanity:
     *                 type: integer
     *                 example: 15
     *     responses:
     *       200:
     *         description: Product-sale relationship updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdIsOnSale'
     *       404:
     *         description: Record not found
     *       400:
     *         description: Bad request
     */
    router.put("/:id", productgroup.update);

    /**
     * @swagger
     * /api/prodisOnSale/{id}:
     *   delete:
     *     summary: Delete product-sale relationship
     *     tags: [ProdIsOnSale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ProdIsOnSale record ID
     *     responses:
     *       200:
     *         description: Record deleted successfully
     *       404:
     *         description: Record not found
     */
    router.delete("/:id", productgroup.delete);

    /**
     * @swagger
     * /api/prodisOnSale:
     *   delete:
     *     summary: Delete all product-sale relationships
     *     tags: [ProdIsOnSale]
     *     responses:
     *       200:
     *         description: All records deleted successfully
     *       500:
     *         description: Server error
     */
    router.delete("/", productgroup.deleteAll);

    app.use("/api/prodisOnSale", router);
    console.log('router for /api/prodIsOnSale initialized');
}