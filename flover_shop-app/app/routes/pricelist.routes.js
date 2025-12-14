module.exports = app => {
    const productgroup = require("../controllers/priceList.controller.js");
    
    var router = require("express").Router();

    /**
     * @swagger
     * components:
     *   schemas:
     *     PriceList:
     *       type: object
     *       required:
     *         - name
     *         - effective_date
     *       properties:
     *         id:
     *           type: integer
     *           description: Auto-incremented ID
     *           example: 1
     *         name:
     *           type: string
     *           description: Name of the price list
     *           example: "Summer 2024 Prices"
     *         effective_date:
     *           type: string
     *           format: date-time
     *           description: Date when the price list becomes effective
     *           example: "2024-06-01T00:00:00Z"
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
     * /api/priceList:
     *   post:
     *     summary: Create a new price list
     *     tags: [PriceList]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - effective_date
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Summer 2024 Prices"
     *               effective_date:
     *                 type: string
     *                 format: date-time
     *                 example: "2024-06-01T00:00:00Z"
     *     responses:
     *       201:
     *         description: Price list created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PriceList'
     *       400:
     *         description: Bad request - missing required fields
     */
    router.post("/", productgroup.create);

    /**
     * @swagger
     * /api/priceList:
     *   get:
     *     summary: Get all price lists
     *     tags: [PriceList]
     *     responses:
     *       200:
     *         description: List of all price lists
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PriceList'
     */
    router.get("/", productgroup.findAll);

    /**
     * @swagger
     * /api/priceList/{id}:
     *   get:
     *     summary: Get price list by ID
     *     tags: [PriceList]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Price list ID
     *     responses:
     *       200:
     *         description: Price list found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PriceList'
     *       404:
     *         description: Price list not found
     */
    router.get("/:id", productgroup.findOne);

    /**
     * @swagger
     * /api/priceList/{id}:
     *   put:
     *     summary: Update price list
     *     tags: [PriceList]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Price list ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Updated Summer 2024 Prices"
     *               effective_date:
     *                 type: string
     *                 format: date-time
     *                 example: "2024-07-01T00:00:00Z"
     *     responses:
     *       200:
     *         description: Price list updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PriceList'
     *       404:
     *         description: Price list not found
     */
    router.put("/:id", productgroup.update);

    /**
     * @swagger
     * /api/priceList/{id}:
     *   delete:
     *     summary: Delete price list
     *     tags: [PriceList]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Price list ID
     *     responses:
     *       200:
     *         description: Price list deleted successfully
     *       404:
     *         description: Price list not found
     */
    router.delete("/:id", productgroup.delete);

    /**
     * @swagger
     * /api/priceList:
     *   delete:
     *     summary: Delete all price lists
     *     tags: [PriceList]
     *     responses:
     *       200:
     *         description: All price lists deleted successfully
     *       500:
     *         description: Server error
     */
    router.delete("/", productgroup.deleteAll);

    app.use("/api/priceList", router);
    console.log('router for /api/priceList initialized');
}