module.exports = app => {
    const productgroup = require("../controllers/productGroup.controller.js");
    
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
     *           description: Auto-incremented ID
     *           example: 1
     *         name:
     *           type: string
     *           description: Name of the product group
     *           example: "Flowers"
     *         description:
     *           type: string
     *           description: Description of the product group
     *           example: "All types of flowers"
     *         baseGoodsGroup:
     *           type: integer
     *           description: Reference to base goods group
     *           example: 1
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
     * /api/productgroups:
     *   post:
     *     summary: Create a new product group
     *     tags: [ProductGroup]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Flowers"
     *               description:
     *                 type: string
     *                 example: "All types of flowers"
     *               baseGoodsGroup:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       201:
     *         description: Product group created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductGroup'
     *       400:
     *         description: Bad request - missing required fields
     */
    router.post("/", productgroup.create);

    /**
     * @swagger
     * /api/productgroups:
     *   get:
     *     summary: Get all product groups
     *     tags: [ProductGroup]
     *     responses:
     *       200:
     *         description: List of all product groups
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ProductGroup'
     */
    router.get("/", productgroup.findAll);

    /**
     * @swagger
     * /api/productgroups/{id}:
     *   get:
     *     summary: Get product group by ID
     *     tags: [ProductGroup]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product group ID
     *     responses:
     *       200:
     *         description: Product group found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductGroup'
     *       404:
     *         description: Product group not found
     */
    router.get("/:id", productgroup.findOne);

    /**
     * @swagger
     * /api/productgroups/{id}:
     *   put:
     *     summary: Update product group
     *     tags: [ProductGroup]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product group ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Updated Flowers Group"
     *               description:
     *                 type: string
     *                 example: "Updated description"
     *               baseGoodsGroup:
     *                 type: integer
     *                 example: 2
     *     responses:
     *       200:
     *         description: Product group updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductGroup'
     *       404:
     *         description: Product group not found
     */
    router.put("/:id", productgroup.update);

    /**
     * @swagger
     * /api/productgroups/{id}:
     *   delete:
     *     summary: Delete product group
     *     tags: [ProductGroup]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Product group ID
     *     responses:
     *       200:
     *         description: Product group deleted successfully
     *       404:
     *         description: Product group not found
     */
    router.delete("/:id", productgroup.delete);

    /**
     * @swagger
     * /api/productgroups:
     *   delete:
     *     summary: Delete all product groups
     *     tags: [ProductGroup]
     *     responses:
     *       200:
     *         description: All product groups deleted successfully
     *       500:
     *         description: Server error
     */
    router.delete("/", productgroup.deleteAll);

    app.use("/api/productgroups", router);
    console.log('router for /api/productgroups initialized');
}