module.exports = app => {
    const productgroup = require("../controllers/sale.controller.js");
    
    var router = require("express").Router();

    /**
     * @swagger
     * components:
     *   schemas:
     *     Sale:
     *       type: object
     *       required:
     *         - id_price_list
     *         - sale_date
     *         - total_amount
     *       properties:
     *         id:
     *           type: integer
     *           description: Auto-incremented ID
     *           example: 1
     *         id_price_list:
     *           type: integer
     *           description: Price list ID reference
     *           example: 1
     *         sale_date:
     *           type: string
     *           format: date-time
     *           description: Date and time of the sale
     *           example: "2024-01-15T14:30:00Z"
     *         payment_time:
     *           type: string
     *           format: time
     *           description: Time of payment
     *           example: "14:30:00"
     *         total_amount:
     *           type: number
     *           format: float
     *           description: Total amount of the sale
     *           example: 299.99
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
     * /api/sale:
     *   post:
     *     summary: Create a new sale
     *     tags: [Sale]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - id_price_list
     *               - sale_date
     *               - total_amount
     *             properties:
     *               id_price_list:
     *                 type: integer
     *                 example: 1
     *               sale_date:
     *                 type: string
     *                 format: date-time
     *                 example: "2024-01-15T14:30:00Z"
     *               payment_time:
     *                 type: string
     *                 format: time
     *                 example: "14:30:00"
     *               total_amount:
     *                 type: number
     *                 format: float
     *                 example: 299.99
     *     responses:
     *       201:
     *         description: Sale created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Sale'
     *       400:
     *         description: Bad request - missing required fields
     */
    router.post("/", productgroup.create);

    /**
     * @swagger
     * /api/sale:
     *   get:
     *     summary: Get all sales
     *     tags: [Sale]
     *     responses:
     *       200:
     *         description: List of all sales
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Sale'
     */
    router.get("/", productgroup.findAll);

    /**
     * @swagger
     * /api/sale/{id}:
     *   get:
     *     summary: Get sale by ID
     *     tags: [Sale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Sale ID
     *     responses:
     *       200:
     *         description: Sale found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Sale'
     *       404:
     *         description: Sale not found
     */
    router.get("/:id", productgroup.findOne);

    /**
     * @swagger
     * /api/sale/{id}:
     *   put:
     *     summary: Update sale
     *     tags: [Sale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Sale ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id_price_list:
     *                 type: integer
     *                 example: 2
     *               sale_date:
     *                 type: string
     *                 format: date-time
     *                 example: "2024-01-16T15:45:00Z"
     *               payment_time:
     *                 type: string
     *                 format: time
     *                 example: "15:45:00"
     *               total_amount:
     *                 type: number
     *                 format: float
     *                 example: 350.50
     *     responses:
     *       200:
     *         description: Sale updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Sale'
     *       404:
     *         description: Sale not found
     */
    router.put("/:id", productgroup.update);

    /**
     * @swagger
     * /api/sale/{id}:
     *   delete:
     *     summary: Delete sale
     *     tags: [Sale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Sale ID
     *     responses:
     *       200:
     *         description: Sale deleted successfully
     *       404:
     *         description: Sale not found
     */
    router.delete("/:id", productgroup.delete);
    /**
     * @swagger
     * /api/sale:
     *   delete:
     *     summary: Delete all sales
     *     tags: [Sale]
     *     responses:
     *       200:
     *         description: All sales deleted successfully
     *       500:
     *         description: Server error
     */
    router.delete("/", productgroup.deleteAll);
    /**
     * @swagger
     * /api/sale/{id}/saleWithProducts:
     *   get:
     *     summary: Get sale with related products
     *     tags: [Sale]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Sale ID
     *     responses:
     *       200:
     *         description: Sale with products information
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 sale:
     *                   $ref: '#/components/schemas/Sale'
     *                 products:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       name:
     *                         type: string
     *                       quantity:
     *                         type: integer
     *                       price:
     *                         type: number
     *                         format: float
     *       404:
     *         description: Sale not found
     */
    router.get("/:id/saleWithProducts", productgroup.saleWithProducts);

    app.use("/api/sale", router);
    console.log('router for /api/sale initialized');
}