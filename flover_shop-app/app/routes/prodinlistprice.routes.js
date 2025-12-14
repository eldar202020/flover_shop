module.exports = app => {
    const pilp = require("../controllers/prodinListPrice.controller.js");
    
    var router = require("express").Router();

    /**
     * @swagger
     * components:
     *   schemas:
     *     ProdInListPrice:
     *       type: object
     *       required:
     *         - id_product
     *         - price
     *       properties:
     *         id:
     *           type: integer
     *           description: Auto-incremented ID
     *           example: 1
     *         id_product:
     *           type: integer
     *           description: Product ID
     *           example: 5
     *         price:
     *           type: number
     *           format: float
     *           description: Product price
     *           example: 99.99
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
     * /api/prodinListPrice:
     *   post:
     *     summary: Create a new product price record
     *     tags: [ProdInListPrice]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - id_product
     *               - price
     *             properties:
     *               id_product:
     *                 type: integer
     *                 example: 5
     *               price:
     *                 type: number
     *                 format: float
     *                 example: 99.99
     *     responses:
     *       201:
     *         description: Product price created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdInListPrice'
     *       400:
     *         description: Bad request - missing required fields
     */
    router.post("/", pilp.create);

    /**
     * @swagger
     * /api/prodinListPrice:
     *   get:
     *     summary: Get all product price records
     *     tags: [ProdInListPrice]
     *     responses:
     *       200:
     *         description: List of all product prices
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ProdInListPrice'
     */
    router.get("/", pilp.findAll);

    /**
     * @swagger
     * /api/prodinListPrice/{id}:
     *   get:
     *     summary: Get product price by ID
     *     tags: [ProdInListPrice]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product price record ID
     *     responses:
     *       200:
     *         description: Product price record found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdInListPrice'
     *       404:
     *         description: Record not found
     */
    router.get("/:id", pilp.findOne);

    /**
     * @swagger
     * /api/prodinListPrice/{id}:
     *   put:
     *     summary: Update product price
     *     tags: [ProdInListPrice]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product price record ID
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
     *               price:
     *                 type: number
     *                 format: float
     *                 example: 89.99
     *     responses:
     *       200:
     *         description: Product price updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdInListPrice'
     *       404:
     *         description: Record not found
     */
    router.put("/:id", pilp.update);

    /**
     * @swagger
     * /api/prodinListPrice/{id}:
     *   delete:
     *     summary: Delete product price record
     *     tags: [ProdInListPrice]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product price record ID
     *     responses:
     *       200:
     *         description: Record deleted successfully
     *       404:
     *         description: Record not found
     */
    router.delete("/:id", pilp.delete);

    /**
     * @swagger
     * /api/prodinListPrice:
     *   delete:
     *     summary: Delete all product price records
     *     tags: [ProdInListPrice]
     *     responses:
     *       200:
     *         description: All records deleted successfully
     *       500:
     *         description: Server error
     */
    router.delete("/", pilp.deleteAll);

    /**
     * @swagger
     * /api/prodinListPrice/{id}/ProdandPrice:
     *   get:
     *     summary: Get product and price information
     *     tags: [ProdInListPrice]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product and price data retrieved
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 product:
     *                   type: object
     *                 price:
     *                   type: number
     *       404:
     *         description: Product not found
     */
    router.get("/:id/ProdandPrice", pilp.ProdandPrice);

    /**
     * @swagger
     * /api/prodinListPrice/{id}/Pricedata:
     *   get:
     *     summary: Get detailed price data
     *     tags: [ProdInListPrice]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product price record ID
     *     responses:
     *       200:
     *         description: Detailed price data retrieved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProdInListPrice'
     *       404:
     *         description: Price data not found
     */
    router.get("/:id/Pricedata", pilp.priceDATA);

    app.use("/api/prodinListPrice", router);
    console.log('router for /api/prodinListPrice initialized');
}